#!/usr/bin/env node
/**
 * Phase 12 audit: add missing cpe: frontmatter to ECC integrated skills.
 * Replaces the old `metadata: origin: ECC` block with the canonical `cpe:` block.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APPLY = process.argv.includes('--apply');
const ECC_REPO = 'https://github.com/affaan-m/ECC';
const ECC_COMMIT = '71d22d0a77b7e0684f4e51cba03749b788993cdb';
const ECC_SHORT = '71d22d0a';
const DATE = '2026-06-22';

const SKILLS = [
  'deployment-patterns',
  'golang-patterns',
  'hexagonal-architecture',
  'github-ops',
  'database-migrations',
  'docker-patterns',
  'java-coding-standards',
  'fastapi-patterns',
  'django-patterns',
  'intent-driven-development',
  'django-security',
  'kotlin-coroutines-flows',
  'flutter-dart-code-review',
  'android-clean-architecture',
];

console.log(`\n=== Atlas Frontmatter Fix — ECC skills${APPLY ? '' : ' [DRY-RUN]'} ===\n`);

for (const slug of SKILLS) {
  const filePath = join(ROOT, `plugins/atlas-engineering/skills/${slug}/SKILL.md`);
  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch {
    console.log(`  ✗ NOT FOUND: ${slug}`);
    continue;
  }

  // Check if cpe: block already exists
  if (content.includes('cpe:')) {
    console.log(`  - already has cpe: ${slug}`);
    continue;
  }

  const originalPath = `skills/${slug}/SKILL.md`;
  const originalUrl = `${ECC_REPO}/tree/${ECC_COMMIT}/${originalPath}`;

  const cpeBlock = `cpe:
  source: ecc
  original_path: ${originalPath}
  original_url: ${originalUrl}
  source_commit: ${ECC_SHORT}
  license: MIT
  integrated_at: ${DATE}
  adaptation: Reformatado para padrão Atlas SKILL.md; conteúdo preservado via WebFetch summary`;

  // Replace `metadata:\n  origin: ECC` or just add cpe: before closing ---
  let updated;
  if (content.includes('metadata:\n  origin: ECC')) {
    updated = content.replace('metadata:\n  origin: ECC', cpeBlock);
  } else if (content.match(/^metadata:/m)) {
    updated = content.replace(/^metadata:.*$/m, cpeBlock);
  } else {
    // Insert before the closing --- of frontmatter
    updated = content.replace(/^---\n([\s\S]*?)\n---/, (_, fm) => `---\n${fm}\n${cpeBlock}\n---`);
  }

  if (APPLY) {
    writeFileSync(filePath, updated, 'utf8');
    console.log(`  ✔ fixed: ${slug}`);
  } else {
    console.log(`  ✔ would fix: ${slug}`);
  }
}

console.log('\nDone.');
if (!APPLY) console.log('Run with --apply to write changes.');
