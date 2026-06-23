#!/usr/bin/env node
/**
 * Phase 12 audit fix: add missing cpe_path to integrated.yaml resources.
 * Derives cpe_path from type + id + target_plugin.
 * Dry-run by default; pass --apply to write.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APPLY = process.argv.includes('--apply');

function loadYaml(p) {
  return yaml.load(readFileSync(p, 'utf8'));
}
function dumpYaml(obj) {
  return yaml.dump(obj, { lineWidth: 120, quotingType: '"', forceQuotes: false });
}

/** Derive the expected cpe_path from a resource record */
function derivePath(resource) {
  const { id, type, target_plugin } = resource;
  if (!target_plugin) return null;

  // Extract the name slug from the id: strip leading "<source>-<type>-"
  // Pattern: ecc-agent-code-reviewer → code-reviewer
  //          ruflo-agent-swarm-coordinator → swarm-coordinator
  const parts = id.split('-');
  // source = parts[0], type-key = parts[1], rest = name
  const nameSlug = parts.slice(2).join('-');

  if (type === 'skill') {
    return `plugins/${target_plugin}/skills/${nameSlug}/SKILL.md`;
  }
  if (type === 'agent') {
    return `plugins/${target_plugin}/agents/${nameSlug}/AGENT.md`;
  }
  if (type === 'command') {
    return `plugins/${target_plugin}/commands/${nameSlug}.md`;
  }
  return null;
}

function processSource(sourceId, integratedPath) {
  const data = loadYaml(integratedPath);
  if (!data?.resources) return { fixed: 0, missing: 0, skipped: 0 };

  let fixed = 0, missing = 0, skipped = 0;
  let changed = false;

  for (const r of data.resources) {
    if (r.status === 'planned') { skipped++; continue; }
    if (r.cpe_path) { skipped++; continue; }

    const derived = derivePath(r);
    if (!derived) {
      console.log(`  SKIP (no target_plugin): ${r.id}`);
      missing++;
      continue;
    }

    const fullPath = join(ROOT, derived);
    const exists = existsSync(fullPath);

    if (APPLY) {
      r.cpe_path = derived;
      changed = true;
      console.log(`  ${exists ? '✔' : '⚠'} ${r.id}`);
      console.log(`      → ${derived}${exists ? '' : ' [FILE NOT FOUND]'}`);
    } else {
      console.log(`  ${exists ? '✔' : '⚠'} ${r.id}`);
      console.log(`      would set cpe_path: ${derived}${exists ? '' : ' [FILE NOT FOUND]'}`);
    }
    fixed++;
  }

  if (APPLY && changed) {
    writeFileSync(integratedPath, dumpYaml(data), 'utf8');
    console.log(`  Wrote: ${integratedPath.replace(ROOT, '.')}`);
  }

  return { fixed, missing, skipped };
}

const sources = loadYaml(join(ROOT, 'sources', 'manifest.yaml'))?.sources ?? [];

console.log(`\n=== Atlas Audit Fix — cpe_path gaps${APPLY ? '' : ' [DRY-RUN]'} ===\n`);

let totalFixed = 0, totalMissing = 0;

for (const src of sources) {
  const intPath = join(ROOT, src.integrated_yaml);
  if (!existsSync(intPath)) continue;

  const data = loadYaml(intPath);
  const needsFix = (data?.resources ?? []).filter(
    r => (r.status === 'integrated' || r.status === 'stub') && !r.cpe_path
  );
  if (needsFix.length === 0) continue;

  console.log(`[${src.id}] — ${needsFix.length} resources need cpe_path`);
  const { fixed, missing } = processSource(src.id, intPath);
  totalFixed += fixed;
  totalMissing += missing;
  console.log();
}

console.log(`Total: ${totalFixed} fixed, ${totalMissing} skipped (no target_plugin)`);
if (!APPLY) {
  console.log('\nRun with --apply to write changes.');
}
