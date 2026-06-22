// report-engine.mjs — CPE Report Engine
// Gera CREDITS.md e INTEGRATION_REPORT.md a partir dos integrated.yaml.
// Somente leitura. Nunca altera ~/.claude.

import { writeFileSync, existsSync } from 'node:fs';
import { join }                      from 'node:path';
import { ROOT, SOURCES_DIR, loadManifest, loadIntegrated, allSourceIds } from './integrate.mjs';

export async function cmdReport({ verbose = false } = {}) {
  console.log('\n=== CPE Report Engine ===\n');

  const manifest  = loadManifest();
  const sources   = manifest.sources || [];
  const today     = new Date().toISOString().split('T')[0];

  // ── Collect data ──────────────────────────────────────────────────────────

  const allResources = [];
  const sourceMap    = {};

  for (const src of sources) {
    const integrated = loadIntegrated(src.id);
    sourceMap[src.id] = { ...src, integrated };
    if (integrated?.resources) {
      for (const r of integrated.resources) {
        allResources.push({ ...r, _source: src.id, _license: integrated.license || src.license });
      }
    }
  }

  const byStatus = allResources.reduce((acc, r) => {
    const s = r.status || 'unknown';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const byPlugin = allResources
    .filter(r => r.status === 'integrated' || r.status === 'stub')
    .reduce((acc, r) => {
      const p = r.target_plugin || 'unknown';
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {});

  const byType = allResources
    .filter(r => r.status === 'integrated' || r.status === 'stub')
    .reduce((acc, r) => {
      const t = r.type || 'unknown';
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});

  // ── Generate CREDITS.md ───────────────────────────────────────────────────

  let credits = `# Créditos e Licenças\n\n`;
  credits += `> Gerado por \`cpe report\` em ${today}.\n\n`;
  credits += `O CPE não substitui os projetos originais. Atua como camada de curação\n`;
  credits += `preservando autoria, licença e rastreabilidade de cada contribuição.\n\n`;
  credits += `---\n\n`;
  credits += `## Fontes Upstream\n\n`;
  credits += `| Fonte | Autor | Repositório | Licença | Commit |\n`;
  credits += `|---|---|---|---|---|\n`;

  for (const src of sources) {
    const commit   = src.pinned_commit ? String(src.pinned_commit).substring(0, 8) : '—';
    const repo     = src.repository || '—';
    const repoCell = repo.startsWith('http') ? `[link](${repo})` : repo;
    credits += `| **${src.name || src.id}** | ${src.author || '—'} | ${repoCell} | ${src.license || '—'} | \`${commit}\` |\n`;
  }

  credits += `\n---\n\n## Recursos por Fonte\n\n`;

  for (const src of sources) {
    const { integrated } = sourceMap[src.id];
    if (!integrated?.resources?.length) continue;

    const resources = integrated.resources.filter(r => r.status === 'integrated' || r.status === 'stub');
    if (!resources.length) continue;

    credits += `### ${src.name || src.id}\n\n`;
    credits += `Licença: ${integrated.license || src.license || '—'} · Commit: ${src.pinned_commit?.substring(0, 8) || '—'}\n\n`;

    for (const r of resources) {
      const stub = r.status === 'stub' ? ' *(stub)*' : '';
      const path = r.cpe_path || '';
      credits += `- **${r.id}**${stub} — \`${path}\`\n`;
      if (r.adaptation && verbose) {
        credits += `  *${r.adaptation.trim().replace(/\n/g, ' ')}*\n`;
      }
    }
    credits += '\n';
  }

  credits += `---\n\n`;
  credits += `*Arquivo gerado automaticamente. Edite as fontes em \`sources/*/integrated.yaml\`.*\n`;

  const creditsPath = join(ROOT, 'CREDITS.md');
  writeFileSync(creditsPath, credits, 'utf8');
  console.log(`  ✔ CREDITS.md → ${creditsPath}`);

  // ── Generate INTEGRATION_REPORT.md ───────────────────────────────────────

  let report = `# CPE Integration Report\n\n`;
  report += `> Gerado em ${today}\n\n`;

  const total     = allResources.length;
  const done      = (byStatus.integrated || 0) + (byStatus.stub || 0);
  const pct       = total > 0 ? Math.round((done / total) * 100) : 0;

  report += `## Resumo\n\n`;
  report += `| | |\n|---|---|\n`;
  report += `| Total de recursos | ${total} |\n`;
  report += `| Integrados (full) | ${byStatus.integrated || 0} |\n`;
  report += `| Integrados (stub) | ${byStatus.stub || 0} |\n`;
  report += `| Planejados        | ${byStatus.planned || 0} |\n`;
  report += `| Progresso         | ${pct}% (${done}/${total}) |\n\n`;

  report += `## Por Plugin\n\n`;
  report += `| Plugin | Recursos |\n|---|---|\n`;
  for (const [plugin, count] of Object.entries(byPlugin).sort()) {
    report += `| ${plugin} | ${count} |\n`;
  }

  report += `\n## Por Tipo\n\n`;
  report += `| Tipo | Recursos |\n|---|---|\n`;
  for (const [type, count] of Object.entries(byType).sort()) {
    report += `| ${type} | ${count} |\n`;
  }

  report += `\n## Stubs (pendentes de substituição)\n\n`;
  const stubs = allResources.filter(r => r.status === 'stub');
  if (stubs.length) {
    for (const r of stubs) {
      report += `- \`${r.id}\` (${r._source}) → ${r.cpe_path || '—'}\n`;
    }
  } else {
    report += `*Nenhum stub pendente.*\n`;
  }

  report += `\n## Planejados (próximas fases)\n\n`;
  const planned = allResources.filter(r => r.status === 'planned');
  if (planned.length) {
    for (const r of planned) {
      report += `- \`${r.id}\` (${r._source}, tipo: ${r.type || '?'})\n`;
    }
  } else {
    report += `*Nenhum recurso planejado pendente.*\n`;
  }

  report += `\n---\n*Gerado por \`cpe report\`. Edite \`sources/*/integrated.yaml\` para atualizar.*\n`;

  const reportPath = join(ROOT, 'INTEGRATION_REPORT.md');
  writeFileSync(reportPath, report, 'utf8');
  console.log(`  ✔ INTEGRATION_REPORT.md → ${reportPath}`);

  console.log(`\n  Totais: ${done}/${total} recursos integrados (${pct}%)`);
  console.log(`    stubs pendentes: ${stubs.length}`);
  console.log(`    planejados: ${planned.length}\n`);
}
