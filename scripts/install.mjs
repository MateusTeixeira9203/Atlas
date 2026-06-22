// install.mjs — CPE Install / Uninstall
// Registra o CPE como marketplace no Claude Code.
//
// IMPORTANTE:
//   - Dry-run por padrão (sem --apply). Mostra o que faria.
//   - Com --apply: faz backup de ~/.claude/settings.json antes de qualquer mudança.
//   - Nunca sobrescreve arquivos existentes sem backup.
//   - Nunca altera plugins instalados pelo usuário.

import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, resolve }  from 'node:path';
import { homedir }        from 'node:os';
import { ROOT }           from './integrate.mjs';

const CLAUDE_DIR       = join(homedir(), '.claude');
const SETTINGS_PATH    = join(CLAUDE_DIR, 'settings.json');
const MARKETPLACE_JSON = join(ROOT, '.claude-plugin', 'marketplace.json');
const STATE_DIR        = join(homedir(), '.cpe-state');

export async function cmdInstall({ apply = false, verbose = false } = {}) {
  const mode = apply ? 'APPLY' : 'DRY-RUN';
  console.log(`\n=== CPE Install [${mode}] ===\n`);

  // ── Prerequisite checks ───────────────────────────────────────────────────

  const checks = [];

  // Node.js version
  const [major] = process.versions.node.split('.').map(Number);
  if (major >= 18) checks.push({ ok: true,  msg: `Node.js ${process.versions.node} ✔` });
  else             checks.push({ ok: false, msg: `Node.js ≥ 18 required (found ${process.versions.node})` });

  // marketplace.json exists
  if (existsSync(MARKETPLACE_JSON)) {
    checks.push({ ok: true,  msg: `marketplace.json found: ${MARKETPLACE_JSON}` });
  } else {
    checks.push({ ok: false, msg: `marketplace.json not found: ${MARKETPLACE_JSON}` });
  }

  // ~/.claude exists (Claude Code installed)
  if (existsSync(CLAUDE_DIR)) {
    checks.push({ ok: true,  msg: `~/.claude exists (Claude Code detected)` });
  } else {
    checks.push({ ok: false, msg: `~/.claude not found — is Claude Code installed?` });
  }

  for (const c of checks) {
    console.log(`  ${c.ok ? '✔' : '✗'} ${c.msg}`);
  }

  if (checks.some(c => !c.ok)) {
    console.log('\n  ✗ Pré-requisitos não atendidos. Corrija os erros acima.\n');
    process.exitCode = 1;
    return;
  }

  // ── What will be done ─────────────────────────────────────────────────────

  console.log('\n  Ações:');

  // 1. Backup settings.json
  const backupPath = join(STATE_DIR, `settings.backup.${Date.now()}.json`);
  if (existsSync(SETTINGS_PATH)) {
    console.log(`  · Backup: ${SETTINGS_PATH} → ${backupPath}`);
  } else {
    console.log(`  · settings.json não existe ainda (será criado)`);
  }

  // 2. Register marketplace
  const marketplace = JSON.parse(readFileSync(MARKETPLACE_JSON, 'utf8'));
  console.log(`  · Registrar marketplace: ${marketplace.name} (${marketplace.marketplace_url})`);

  // 3. What --apply would write
  console.log('\n  Resultado em settings.json (prévia):');
  const settingsPreview = buildSettings(SETTINGS_PATH, marketplace);
  console.log(`    plugins.marketplaces: [... + "${marketplace.name}"]`);

  if (!apply) {
    console.log('\n  [DRY-RUN] Nenhuma mudança aplicada.');
    console.log('  Execute com --apply para registrar o CPE:\n');
    console.log('    cpe install --apply\n');
    return;
  }

  // ── Apply ─────────────────────────────────────────────────────────────────

  if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });

  // Backup
  if (existsSync(SETTINGS_PATH)) {
    copyFileSync(SETTINGS_PATH, backupPath);
    console.log(`\n  ✔ Backup criado: ${backupPath}`);
  }

  // Write settings
  writeFileSync(SETTINGS_PATH, JSON.stringify(settingsPreview, null, 2) + '\n', 'utf8');
  console.log(`  ✔ settings.json atualizado: ${SETTINGS_PATH}`);

  console.log('\n  CPE registrado com sucesso!');
  console.log(`  Execute 'claude plugin list' para confirmar.\n`);
}

// ── Helpers ────────────────────────────────────────────────────────────────

function buildSettings(settingsPath, marketplace) {
  let settings = {};
  if (existsSync(settingsPath)) {
    try { settings = JSON.parse(readFileSync(settingsPath, 'utf8')); }
    catch { settings = {}; }
  }

  if (!settings.plugins) settings.plugins = {};
  if (!settings.plugins.marketplaces) settings.plugins.marketplaces = [];

  // Idempotent — não duplica
  const alreadyRegistered = settings.plugins.marketplaces.some(
    m => (typeof m === 'string' ? m : m.url) === marketplace.marketplace_url
  );

  if (!alreadyRegistered) {
    settings.plugins.marketplaces.push(marketplace.marketplace_url);
  }

  return settings;
}
