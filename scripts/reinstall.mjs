// reinstall.mjs — reinstala todos os plugins do Atlas de uma vez.
//
// Lê a lista de plugins do marketplace.json (fica sempre correto) e roda
// `claude plugin install <plugin>@<marketplace>` para cada um.
//
// Dry-run por padrão (mostra os comandos). Efetiva só com --apply.
// Requer o CLI `claude` no PATH (terminal integrado do VS Code).

import { execSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { ROOT } from './integrate.mjs';

const MARKETPLACE_JSON = join(ROOT, '.claude-plugin', 'marketplace.json');

// Localiza o binario do claude: PATH primeiro, depois o local do app desktop
// (%APPDATA%/Claude/claude-code/<versao>/claude.exe — pega a maior versao).
// Retorna o comando pronto para uso (ja com aspas se for caminho), ou null.
function findClaude() {
  try { execSync('claude --version', { stdio: 'ignore' }); return 'claude'; }
  catch { /* nao esta no PATH */ }
  const base = join(process.env.APPDATA || join(homedir(), 'AppData', 'Roaming'), 'Claude', 'claude-code');
  if (existsSync(base)) {
    const versions = readdirSync(base)
      .filter(d => existsSync(join(base, d, 'claude.exe')))
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
    if (versions.length) return `"${join(base, versions[0], 'claude.exe')}"`;
  }
  return null;
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

  const claude = findClaude();
  if (!claude) {
    console.log("  ✗ 'claude' não encontrado (nem no PATH, nem em %APPDATA%\\Claude\\claude-code).");
    console.log("    Rode no terminal integrado do VS Code, onde o Claude Code está.\n");
    process.exitCode = 1;
    return;
  }
  if (claude !== 'claude') console.log(`  (claude localizado em ${claude})\n`);

  // Registra o marketplace (idempotente — ignora se já existe)
  try {
    execSync(`${claude} plugin marketplace add "${ROOT}"`, { stdio: 'inherit' });
  } catch { /* já registrado */ }

  const results = [];
  for (const p of plugins) {
    const ref = `${p}@${market}`;
    console.log(`\n→ instalando ${ref}`);
    try {
      execSync(`${claude} plugin install ${ref}`, { stdio: 'inherit' });
      results.push([p, true]);
    } catch {
      results.push([p, false]);
    }
  }

  console.log('\n  Resumo:');
  for (const [p, ok] of results) console.log(`    ${ok ? '✔' : '✗'} ${p}`);
  console.log('\n  Feche e reabra o VS Code para ativar os plugins reinstalados.\n');
}
