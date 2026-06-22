#!/usr/bin/env node
// integrate.mjs — CPE Integration Pipeline
// Pipeline: Source → Analyze → Classify → Extract → Normalize → Integrate → Report
//
// Usage:
//   node scripts/integrate.mjs analyze [source-id]   → lista recursos upstream
//   node scripts/integrate.mjs status                → mostra estado de integração
//   node scripts/integrate.mjs report                → gera CREDITS.md do integrated.yaml
//
// IMPORTANTE: este script é somente leitura + relatório. Nunca altera ~/.claude.
// A extração real acontece em cada fase (3-6), aprovada manualmente.

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

// ── Utilitários de path (zero caminho absoluto hardcoded) ──────────────────

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');
const SOURCES_DIR = join(ROOT, 'sources');
const MANIFEST_PATH = join(SOURCES_DIR, 'manifest.yaml');
const STATE_DIR = join(homedir(), '.cpe-state');

function resolveStatePath(...parts) {
  return join(STATE_DIR, ...parts);
}

// ── Parsers mínimos (sem dependências externas) ────────────────────────────

/**
 * Parser YAML minimalista — apenas suporta o subconjunto usado neste projeto.
 * Para produção (Fase 8) substituir por js-yaml via package.json.
 */
function parseYamlSimple(text) {
  // Delegamos ao JSON parseável das partes estruturadas — abordagem pragmática.
  // Na Fase 8, o cpe.mjs usará js-yaml como dependência real.
  // Por ora, lê o YAML e extrai campos-chave com regex conservadoras.
  const lines = text.split('\n');
  const result = { sources: [] };
  let current = null;

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('#') || !line.trim()) continue;

    const sourceMatch = line.match(/^  - id:\s+(.+)$/);
    if (sourceMatch) {
      current = { id: sourceMatch[1].trim() };
      result.sources.push(current);
      continue;
    }
    if (current) {
      const fieldMatch = line.match(/^    (\w[\w_]+):\s+(.+)$/);
      if (fieldMatch) {
        const [, key, val] = fieldMatch;
        current[key] = val.replace(/^["']|["']$/g, '').trim();
      }
    }
  }
  return result;
}

// ── Comandos ───────────────────────────────────────────────────────────────

function cmdStatus() {
  console.log('\n=== CPE Integration Status ===\n');

  if (!existsSync(MANIFEST_PATH)) {
    console.error('ERRO: sources/manifest.yaml não encontrado.');
    process.exit(1);
  }

  const manifest = parseYamlSimple(readFileSync(MANIFEST_PATH, 'utf8'));

  for (const src of manifest.sources) {
    const integratedPath = join(SOURCES_DIR, src.id, 'integrated.yaml');
    const hasIntegrated = existsSync(integratedPath);
    const decisionsDir = join(SOURCES_DIR, src.id, 'decisions');
    const decisionCount = existsSync(decisionsDir)
      ? readdirSync(decisionsDir).filter(f => f.endsWith('.md')).length
      : 0;

    const commit = src.pinned_commit ? src.pinned_commit.substring(0, 8) : 'pendente';
    const license = src.license || 'pendente';
    const integrated = hasIntegrated ? '✔' : '✗';

    console.log(`  [${integrated}] ${src.id.padEnd(22)} commit=${commit}  license=${license.padEnd(12)}  decisions=${decisionCount}`);
  }

  console.log('\nLegenda: [✔] integrated.yaml presente  [✗] ainda pendente\n');
}

function cmdAnalyze(sourceId) {
  if (!sourceId) {
    console.error('Uso: integrate.mjs analyze <source-id>');
    process.exit(1);
  }

  const integratedPath = join(SOURCES_DIR, sourceId, 'integrated.yaml');
  if (!existsSync(integratedPath)) {
    console.error(`ERRO: ${integratedPath} não encontrado.`);
    process.exit(1);
  }

  const raw = readFileSync(integratedPath, 'utf8');
  const lines = raw.split('\n');

  // Extrai recursos por regex conservadora
  const resources = [];
  let current = null;
  for (const line of lines) {
    if (line.match(/^  - id:\s/)) {
      current = { id: line.split('id:')[1].trim() };
      resources.push(current);
    } else if (current) {
      for (const field of ['type', 'status', 'target_plugin']) {
        const m = line.match(new RegExp(`^    ${field}:\\s+(.+)$`));
        if (m) current[field] = m[1].trim();
      }
    }
  }

  console.log(`\n=== Recursos planejados: ${sourceId} ===\n`);
  for (const r of resources) {
    const status = r.status || '?';
    const type = (r.type || '?').padEnd(18);
    const plugin = r.target_plugin || 'n/a';
    console.log(`  ${status.padEnd(12)} ${type} → ${plugin}  [${r.id}]`);
  }
  console.log(`\n  Total: ${resources.length} recursos\n`);
}

function cmdReport() {
  console.log('\n=== Gerando CREDITS.md ===\n');

  const manifest = parseYamlSimple(readFileSync(MANIFEST_PATH, 'utf8'));

  let md = '# Créditos e Licenças\n\n';
  md += '> Gerado automaticamente por `scripts/integrate.mjs report`.\n';
  md += `> Última atualização: ${new Date().toISOString().split('T')[0]}\n\n`;
  md += 'O CPE não substitui os projetos originais. Atua como camada de integração\n';
  md += 'preservando autoria, licença e rastreabilidade de cada contribuição.\n\n';
  md += '## Fontes (upstream)\n\n';
  md += '| Fonte | Autor | Repositório | Licença | Commit |\n';
  md += '|---|---|---|---|---|\n';

  for (const src of manifest.sources) {
    const commit = src.pinned_commit ? src.pinned_commit.substring(0, 8) : 'pendente';
    const repo = src.repository || '—';
    const repoLink = repo.startsWith('http') ? `[link](${repo})` : repo;
    md += `| ${src.name || src.id} | ${src.author || '—'} | ${repoLink} | ${src.license || 'pendente'} | \`${commit}\` |\n`;
  }

  md += '\n> Licença e commit de cada fonte são registrados em `sources/<id>/integrated.yaml`.\n';

  const creditsPath = join(ROOT, 'CREDITS.md');
  writeFileSync(creditsPath, md, 'utf8');
  console.log(`  ✔ CREDITS.md gerado em ${creditsPath}\n`);
}

// ── Entry point ────────────────────────────────────────────────────────────

const [,, cmd, ...args] = process.argv;

switch (cmd) {
  case 'status':  cmdStatus(); break;
  case 'analyze': cmdAnalyze(args[0]); break;
  case 'report':  cmdReport(); break;
  default:
    console.log('CPE Integration Pipeline\n');
    console.log('Comandos:');
    console.log('  status              → estado de integração de todas as fontes');
    console.log('  analyze <source-id> → lista recursos planejados de uma fonte');
    console.log('  report              → gera CREDITS.md a partir dos integrated.yaml');
    console.log('\nEste script é somente leitura. Nunca altera ~/.claude.');
}
