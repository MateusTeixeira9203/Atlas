// integrate.mjs — CPE Integration Pipeline (core functions)
// Exporta cmdStatus e cmdAnalyze para uso via cpe.mjs.
// Usa js-yaml para parsing correto — sem regex frágil.
//
// Contrato: somente leitura. Nunca altera ~/.claude ou fontes upstream.

import yaml                                      from 'js-yaml';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join }                from 'node:path';
import { fileURLToPath }                         from 'node:url';
import { homedir }                               from 'node:os';

// ── Paths (zero absoluto hardcoded) ───────────────────────────────────────

const __dir      = dirname(fileURLToPath(import.meta.url));
export const ROOT         = resolve(__dir, '..');
export const SOURCES_DIR  = join(ROOT, 'sources');
export const MANIFEST_PATH= join(SOURCES_DIR, 'manifest.yaml');
export const STATE_DIR    = join(homedir(), '.cpe-state');

// ── Helpers ────────────────────────────────────────────────────────────────

export function loadYaml(path) {
  return yaml.load(readFileSync(path, 'utf8'));
}

export function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    console.error(`ERRO: ${MANIFEST_PATH} não encontrado.`);
    process.exit(1);
  }
  return loadYaml(MANIFEST_PATH);
}

export function loadIntegrated(sourceId) {
  const path = join(SOURCES_DIR, sourceId, 'integrated.yaml');
  if (!existsSync(path)) return null;
  return loadYaml(path);
}

export function allSourceIds() {
  return readdirSync(SOURCES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

// ── Status ─────────────────────────────────────────────────────────────────

export async function cmdStatus({ verbose = false } = {}) {
  const manifest = loadManifest();
  const sources  = manifest.sources || [];

  console.log('\n=== CPE Integration Status ===\n');

  let totalIntegrated = 0;
  let totalStub       = 0;
  let totalPlanned    = 0;

  for (const src of sources) {
    const integrated = loadIntegrated(src.id);
    const decisionsDir = join(SOURCES_DIR, src.id, 'decisions');
    const decisions = existsSync(decisionsDir)
      ? readdirSync(decisionsDir).filter(f => f.endsWith('.md')).length
      : 0;

    const commit  = src.pinned_commit ? String(src.pinned_commit).substring(0, 8) : 'pendente';
    const license = (src.license || 'pendente').padEnd(12);
    const check   = integrated ? '✔' : '✗';

    if (integrated?.resources) {
      const byStatus = countByStatus(integrated.resources);
      totalIntegrated += byStatus.integrated || 0;
      totalStub       += byStatus.stub       || 0;
      totalPlanned    += byStatus.planned    || 0;

      const summary = `integrated=${byStatus.integrated||0}  stub=${byStatus.stub||0}  planned=${byStatus.planned||0}`;
      console.log(`  [${check}] ${String(src.id).padEnd(24)} ${summary}  commit=${commit}  license=${license}  decisions=${decisions}`);

      if (verbose && integrated.resources) {
        for (const r of integrated.resources) {
          const icon = r.status === 'integrated' ? '  ✔' : r.status === 'stub' ? '  ~' : '  ·';
          console.log(`       ${icon} [${r.type?.padEnd(10)}] ${r.id}`);
        }
      }
    } else {
      console.log(`  [${check}] ${String(src.id).padEnd(24)} (sem integrated.yaml)  commit=${commit}  license=${license}`);
    }
  }

  console.log(`\n  Totais: integrated=${totalIntegrated}  stub=${totalStub}  planned=${totalPlanned}`);
  console.log('  Legenda: [✔] integrated.yaml presente  [✗] pendente  ~ stub  · planned\n');
}

// ── Analyze ────────────────────────────────────────────────────────────────

export async function cmdAnalyze(sourceId, { verbose = false } = {}) {
  if (!sourceId) {
    console.error('Uso: cpe analyze <source-id>');
    process.exit(1);
  }

  const integrated = loadIntegrated(sourceId);
  if (!integrated) {
    console.error(`ERRO: sources/${sourceId}/integrated.yaml não encontrado.`);
    process.exit(1);
  }

  const resources = integrated.resources || [];
  const byStatus  = countByStatus(resources);

  console.log(`\n=== ${sourceId} — ${resources.length} recursos ===`);
  console.log(`  integrated=${byStatus.integrated||0}  stub=${byStatus.stub||0}  planned=${byStatus.planned||0}`);
  console.log(`  license=${integrated.license || '—'}  integrated_at=${integrated.integrated_at || '—'}\n`);

  for (const status of ['integrated', 'stub', 'planned']) {
    const group = resources.filter(r => r.status === status);
    if (!group.length) continue;
    const label = { integrated: '✔ INTEGRATED', stub: '~ STUB', planned: '· PLANNED' }[status];
    console.log(`  ${label} (${group.length})`);
    for (const r of group) {
      const type   = String(r.type || '?').padEnd(12);
      const plugin = r.target_plugin || r.cpe_path?.split('/')[1] || '—';
      const path   = r.cpe_path || r.original_path || '';
      console.log(`    ${type} → ${String(plugin).padEnd(18)} ${path}`);
      if (verbose && r.adaptation) {
        console.log(`             note: ${r.adaptation.trim().replace(/\n/g, ' ')}`);
      }
    }
    console.log();
  }
}

// ── Internal helpers ───────────────────────────────────────────────────────

function countByStatus(resources) {
  return resources.reduce((acc, r) => {
    const s = r.status || 'unknown';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
}
