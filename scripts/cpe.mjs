#!/usr/bin/env node
// cpe.mjs — Claude Professional Environment CLI
// Entry point que roteia para subcomandos.
//
// Usage:
//   cpe status                → estado de integração de todas as fontes
//   cpe analyze <source-id>   → recursos de uma fonte
//   cpe report                → gera CREDITS.md + INTEGRATION_REPORT.md
//   cpe doctor                → valida proveniência, orphans, manifests
//   cpe install [--apply]     → registra CPE como plugin (dry-run sem --apply)
//
// Convenções:
//   - Dry-run por padrão. Efetiva só com --apply.
//   - Nunca sobrescreve arquivos Claude Code sem backup.
//   - Zero caminhos absolutos hardcoded.

import { cmdStatus, cmdAnalyze }    from './integrate.mjs';
import { cmdReport }                from './report-engine.mjs';
import { cmdDoctor }                from './doctor.mjs';
import { cmdInstall }               from './install.mjs';

const [,, cmd, ...args] = process.argv;
const flags = new Set(args.filter(a => a.startsWith('--')));
const positional = args.filter(a => !a.startsWith('--'));

const HELP = `
CPE — Claude Professional Environment v0.8.0

Comandos:
  status                  → estado de integração de todas as fontes
  analyze <source-id>     → recursos planejados/integrados de uma fonte
  report                  → gera CREDITS.md + INTEGRATION_REPORT.md (somente leitura)
  doctor                  → valida proveniência, cpe_path, orphans
  install [--apply]       → registra CPE como marketplace (dry-run sem --apply)

Flags:
  --apply                 → aplicar mudanças (padrão: dry-run)
  --verbose               → output detalhado

Este CLI é somente leitura exceto em 'install --apply'.
Nunca altera ~/.claude sem --apply.
`;

switch (cmd) {
  case 'status':  await cmdStatus({ verbose: flags.has('--verbose') }); break;
  case 'analyze': await cmdAnalyze(positional[0], { verbose: flags.has('--verbose') }); break;
  case 'report':  await cmdReport({ verbose: flags.has('--verbose') }); break;
  case 'doctor':  await cmdDoctor({ verbose: flags.has('--verbose') }); break;
  case 'install': await cmdInstall({ apply: flags.has('--apply'), verbose: flags.has('--verbose') }); break;
  default:
    console.log(HELP);
}
