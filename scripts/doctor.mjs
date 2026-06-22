// doctor.mjs — CPE Doctor
// Valida: proveniência completa, cpe_path apontando para arquivos reais,
// frontmatter CPE presente, orphans (arquivos sem registro no integrated.yaml).
// Somente leitura. Nunca modifica nada.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative }                                   from 'node:path';
import { ROOT, SOURCES_DIR, loadManifest, loadIntegrated, allSourceIds } from './integrate.mjs';

export async function cmdDoctor({ verbose = false } = {}) {
  console.log('\n=== CPE Doctor ===\n');

  const errors   = [];
  const warnings = [];
  const ok       = [];

  const manifest = loadManifest();
  const sources  = manifest.sources || [];

  // ── 1. manifest.yaml ──────────────────────────────────────────────────────

  for (const src of sources) {
    if (!src.id)           errors.push(`manifest: fonte sem id: ${JSON.stringify(src)}`);
    if (!src.license)      warnings.push(`manifest[${src.id}]: license não definida`);
    if (!src.pinned_commit)warnings.push(`manifest[${src.id}]: pinned_commit ausente`);
    if (!src.repository)   warnings.push(`manifest[${src.id}]: repository ausente`);
  }

  // ── 2. integrated.yaml por fonte ──────────────────────────────────────────

  for (const src of sources) {
    const integrated = loadIntegrated(src.id);
    if (!integrated) {
      warnings.push(`sources/${src.id}/integrated.yaml não encontrado`);
      continue;
    }

    const resources = integrated.resources || [];
    for (const r of resources) {
      // Campos obrigatórios em todos os recursos
      if (!r.id)     { errors.push(`${src.id}: recurso sem id`); continue; }
      if (!r.type)   errors.push(`${src.id}/${r.id}: campo 'type' ausente`);
      if (!r.status) errors.push(`${src.id}/${r.id}: campo 'status' ausente`);

      if (r.status === 'integrated' || r.status === 'stub') {
        // Campos obrigatórios para recursos integrados
        if (!r.integrated_at) warnings.push(`${src.id}/${r.id}: integrated_at ausente`);
        if (!r.cpe_path)      errors.push(`${src.id}/${r.id}: cpe_path ausente (obrigatório para status=${r.status})`);

        // Verifica se o arquivo CPE realmente existe
        if (r.cpe_path) {
          const fullPath = join(ROOT, r.cpe_path);
          if (!existsSync(fullPath)) {
            errors.push(`${src.id}/${r.id}: cpe_path não encontrado: ${r.cpe_path}`);
          } else {
            // Verifica presença do frontmatter CPE
            const content = readFileSync(fullPath, 'utf8');
            if (!content.includes('cpe:')) {
              warnings.push(`${src.id}/${r.id}: arquivo sem frontmatter 'cpe:' → ${r.cpe_path}`);
            } else {
              ok.push(`${r.id}`);
            }
          }
        }
      }
    }
  }

  // ── 3. Orphan detection ───────────────────────────────────────────────────
  // Arquivos em plugins/ com frontmatter CPE que não aparecem em nenhum integrated.yaml

  const registeredPaths = new Set();
  for (const src of sources) {
    const integrated = loadIntegrated(src.id);
    for (const r of (integrated?.resources || [])) {
      if (r.cpe_path) registeredPaths.add(r.cpe_path);
    }
  }

  const pluginsDir = join(ROOT, 'plugins');
  const cpeFiles   = findCpeFiles(pluginsDir);

  for (const file of cpeFiles) {
    const rel = relative(ROOT, file).replace(/\\/g, '/');
    if (!registeredPaths.has(rel)) {
      warnings.push(`ORPHAN: ${rel} tem frontmatter 'cpe:' mas não está em nenhum integrated.yaml`);
    }
  }

  // ── 4. templates/ validation ──────────────────────────────────────────────

  const templatesDir = join(ROOT, 'templates');
  if (existsSync(templatesDir)) {
    const templateFiles = findTemplateFiles(templatesDir);
    for (const file of templateFiles) {
      const content = readFileSync(file, 'utf8');
      const rel = relative(ROOT, file).replace(/\\/g, '/');
      if (!content.includes('cpe:')) {
        warnings.push(`template sem frontmatter 'cpe:': ${rel}`);
      }
    }
  }

  // ── Output ────────────────────────────────────────────────────────────────

  if (errors.length) {
    console.log(`  ERROS (${errors.length}):`);
    for (const e of errors) console.log(`    ✗ ${e}`);
    console.log();
  }

  if (warnings.length) {
    console.log(`  AVISOS (${warnings.length}):`);
    for (const w of warnings) console.log(`    ⚠ ${w}`);
    console.log();
  }

  if (verbose && ok.length) {
    console.log(`  OK (${ok.length}):`);
    for (const o of ok) console.log(`    ✔ ${o}`);
    console.log();
  }

  const status = errors.length === 0
    ? (warnings.length === 0 ? '✔ SAUDÁVEL' : '⚠ AVISOS')
    : '✗ ERROS';

  console.log(`  Resultado: ${status}  (${errors.length} erros, ${warnings.length} avisos, ${ok.length} ok)\n`);

  if (errors.length) process.exitCode = 1;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function findCpeFiles(dir, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) findCpeFiles(full, results);
    else if (entry.name.endsWith('.md')) {
      const content = readFileSync(full, 'utf8');
      if (content.includes('cpe:')) results.push(full);
    }
  }
  return results;
}

function findTemplateFiles(dir, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) findTemplateFiles(full, results);
    else if (entry.name === 'TEMPLATE.md') results.push(full);
  }
  return results;
}
