// reinstall.mjs — reinstala todos os plugins do Atlas de uma vez.
//
// Lê a lista de plugins do marketplace.json (fica sempre correto) e roda
// `claude plugin install <plugin>@<marketplace>` para cada um.
//
// Dry-run por padrão (mostra os comandos). Efetiva só com --apply.
// Requer o CLI `claude` no PATH (terminal integrado do VS Code).

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './integrate.mjs';

const MARKETPLACE_JSON = join(ROOT, '.claude-plugin', 'marketplace.json');

function hasClaude() {
  try { execSync('claude --version', { stdio: 'ignore' }); return true; }
  catch { return false; }
}

export async function cmdReinstall({ apply = false } = {}) {
  console.log(`\n=== Atlas Reinstall [${apply ? 'APPLY' : 'DRY-RUN'}] ===\n`);

  const mp      = JSON.parse(readFileSync(MARKETPLACE_JSON, 'utf8'));
  const market  = mp.name;
  const plugins = mp.plugins.map(p => p.name);

  console.log(`  Marketplace: ${market}`);
  console.log(`  Plugins (${plugins.length}): ${plugins.join(', ')}\n`);

  if (!apply) {
    console.log('  Comandos que seriam executados:');
    console.log(`    claude plugin marketplace add ${ROOT}`);
    for (const p of plugins) console.log(`    claude plugin install ${p}@${market}`);
    console.log('\n  [DRY-RUN] Nada executado. Rode com --apply:\n');
    console.log('    node scripts/cpe.mjs reinstall --apply\n');
    return;
  }

  if (!hasClaude()) {
    console.log("  ✗ 'claude' não encontrado no PATH.");
    console.log("    Rode no terminal integrado do VS Code, onde o Claude Code está.\n");
    process.exitCode = 1;
    return;
  }

  // Registra o marketplace (idempotente — ignora se já existe)
  try {
    execSync(`claude plugin marketplace add "${ROOT}"`, { stdio: 'inherit' });
  } catch { /* já registrado */ }

  const results = [];
  for (const p of plugins) {
    const ref = `${p}@${market}`;
    console.log(`\n→ instalando ${ref}`);
    try {
      execSync(`claude plugin install ${ref}`, { stdio: 'inherit' });
      results.push([p, true]);
    } catch {
      results.push([p, false]);
    }
  }

  console.log('\n  Resumo:');
  for (const [p, ok] of results) console.log(`    ${ok ? '✔' : '✗'} ${p}`);
  console.log('\n  Feche e reabra o VS Code para ativar os plugins reinstalados.\n');
}
