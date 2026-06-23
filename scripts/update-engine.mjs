// update-engine.mjs — CPE Update Engine
// Detecta stubs substituíveis por conteúdo real do upstream.
// Verifica existência via HEAD em raw.githubusercontent.com (sem rate limit).
// NUNCA aplica mudanças — apenas gera relatório.
//
// Categorias de stubs:
//   REPLACEABLE  — upstream tem o arquivo no commit pinado
//   AVAILABLE    — upstream tem o arquivo no HEAD (commit mais recente)
//   NOT_FOUND    — arquivo não existe no upstream
//   INCOMPLETE   — arquivo CPE existe (cpe_path) mas marcado stub (conteúdo sumário)

import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join }                                  from 'node:path';
import { ROOT, STATE_DIR, loadManifest, loadIntegrated } from './integrate.mjs';

const RAW_BASE = 'https://raw.githubusercontent.com';

// ── Upstream availability check ────────────────────────────────────────────

async function headCheck(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return res.ok;
  } catch {
    return false;
  }
}

function rawUrl(owner, repo, commit, path) {
  const cleanPath = path.replace(/^\//, '');
  return `${RAW_BASE}/${owner}/${repo}/${commit}/${cleanPath}`;
}

function parseRepo(repositoryUrl) {
  const m = repositoryUrl?.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, '') };
}

function guessTargetPath(stub, src) {
  // Build a suggested CPE path based on stub type and source
  const type    = stub.type || 'unknown';
  const plugin  = stub.target_plugin || 'cpe-engineering';
  const origPath= stub.original_path || '';
  const basename= origPath.split('/').pop()?.replace(/\.md$/, '') || stub.id;

  switch (type) {
    case 'agent':   return `plugins/${plugin}/agents/${basename}/AGENT.md`;
    case 'skill':   return `plugins/${plugin}/skills/${basename}/SKILL.md`;
    case 'command': return `plugins/${plugin}/commands/${basename}.md`;
    default:        return `plugins/${plugin}/${type}s/${basename}.md`;
  }
}

// ── Priority scoring ───────────────────────────────────────────────────────

function priorityScore(stub, sourceId) {
  let score = 0;
  // Active plugin (engineering/workflows) → higher priority
  const plugin = stub.target_plugin || '';
  if (plugin.includes('engineering') || plugin.includes('workflows')) score += 10;
  if (plugin.includes('design'))  score += 5;
  // No cpe_path = truly missing (higher priority than incomplete)
  if (!stub.cpe_path) score += 5;
  // Integrated type ordering
  const typeScore = { agent: 4, command: 3, skill: 2 };
  score += typeScore[stub.type] || 1;
  return score;
}

// ── Main ───────────────────────────────────────────────────────────────────

export async function cmdUpdate({ sourceFilter = null, json = false, verbose = false } = {}) {
  const today    = new Date().toISOString().split('T')[0];
  const manifest = loadManifest();
  const sources  = manifest.sources || [];

  const filtered = sourceFilter
    ? sources.filter(s => s.id === sourceFilter)
    : sources;

  if (!json) {
    console.log(`\n=== CPE Update Engine — ${today} ===`);
    console.log('Verificando disponibilidade dos stubs no upstream...\n');
  }

  // ── Collect all stubs ────────────────────────────────────────────────────

  const candidates = [];

  for (const src of filtered) {
    const integrated = loadIntegrated(src.id);
    if (!integrated) continue;

    const stubs = (integrated.resources || []).filter(r => r.status === 'stub');
    if (!stubs.length) continue;

    const parsed = parseRepo(src.repository);

    for (const stub of stubs) {
      candidates.push({
        stub,
        src,
        parsed,
        priority: priorityScore(stub, src.id),
      });
    }
  }

  // Sort by priority descending
  candidates.sort((a, b) => b.priority - a.priority);

  if (!json) console.log(`Stubs encontrados: ${candidates.length} (em ${new Set(candidates.map(c => c.src.id)).size} fonte(s))\n`);

  // ── Check availability (in batches to avoid hammering) ───────────────────

  const results = [];

  for (const { stub, src, parsed } of candidates) {
    const result = {
      id:          stub.id,
      sourceId:    src.id,
      type:        stub.type || 'unknown',
      targetPlugin: stub.target_plugin || 'unknown',
      originalPath: stub.original_path || null,
      cpePath:     stub.cpe_path || null,
      suggestedPath: !stub.cpe_path && stub.original_path ? guessTargetPath(stub, src) : null,
      status:      'NOT_CHECKED',
      upstreamUrl: null,
    };

    // Category: INCOMPLETE — file exists in CPE but is a stub (content is summary)
    if (stub.cpe_path && existsSync(join(ROOT, stub.cpe_path))) {
      result.status = 'INCOMPLETE';
      if (parsed && stub.original_path) {
        result.upstreamUrl = rawUrl(parsed.owner, parsed.repo, src.pinned_commit.substring(0, 8), stub.original_path);
      }
      results.push(result);
      continue;
    }

    // Check upstream availability
    if (!parsed || !stub.original_path) {
      result.status = 'NOT_FOUND';
      result.note   = !parsed ? 'repo URL inválida' : 'original_path ausente';
      results.push(result);
      continue;
    }

    // Check at pinned commit first
    const pinnedUrl = rawUrl(parsed.owner, parsed.repo, src.pinned_commit.substring(0, 8), stub.original_path);
    result.upstreamUrl = pinnedUrl;

    const existsAtPin = await headCheck(pinnedUrl);
    if (existsAtPin) {
      result.status = 'REPLACEABLE';
    } else {
      // Check at HEAD (main/master)
      const headUrl = rawUrl(parsed.owner, parsed.repo, 'main', stub.original_path);
      const existsAtHead = await headCheck(headUrl);
      if (existsAtHead) {
        result.status     = 'AVAILABLE';
        result.upstreamUrl = headUrl;
        result.note        = 'não estava no commit pinado — disponível no HEAD';
      } else {
        result.status = 'NOT_FOUND';
      }
    }

    results.push(result);
  }

  // ── Group by category ─────────────────────────────────────────────────────

  const replaceable = results.filter(r => r.status === 'REPLACEABLE');
  const available   = results.filter(r => r.status === 'AVAILABLE');
  const incomplete  = results.filter(r => r.status === 'INCOMPLETE');
  const notFound    = results.filter(r => r.status === 'NOT_FOUND');

  // ── Print ─────────────────────────────────────────────────────────────────

  if (!json) {
    printSection('SUBSTITUÍVEIS — upstream tem o arquivo no commit pinado', replaceable, verbose);
    printSection('DISPONÍVEIS — upstream tem o arquivo no HEAD (commit mais recente)', available, verbose);
    printSection('INCOMPLETOS — arquivo CPE existe mas conteúdo é sumário', incomplete, verbose);
    if (verbose) printSection('NÃO ENCONTRADOS', notFound, verbose);

    console.log('─'.repeat(60));
    console.log(`  Resumo:`);
    console.log(`    Substituíveis (pinned): ${replaceable.length}`);
    console.log(`    Disponíveis (HEAD):     ${available.length}`);
    console.log(`    Incompletos (CPE stub): ${incomplete.length}`);
    console.log(`    Não encontrados:        ${notFound.length}`);
    console.log();
    console.log('  Nota: Este engine apenas reporta. Substituição é manual.');
    console.log('  Fluxo: ler conteúdo upstream → escrever SKILL/AGENT.md → atualizar integrated.yaml');
    console.log();
  }

  // ── Persist ───────────────────────────────────────────────────────────────

  if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });

  const reportData = {
    generated: new Date().toISOString(),
    summary: { replaceable: replaceable.length, available: available.length, incomplete: incomplete.length, notFound: notFound.length },
    results,
  };

  const reportPath = join(STATE_DIR, `update-report-${today}.json`);
  const latestPath = join(STATE_DIR, 'update-latest.json');
  writeFileSync(reportPath,  JSON.stringify(reportData, null, 2), 'utf8');
  writeFileSync(latestPath,  JSON.stringify(reportData, null, 2), 'utf8');

  // Generate UPDATE_REPORT.md
  await generateMarkdownReport(reportData, replaceable, available, incomplete, notFound, today);

  if (!json) {
    console.log(`  Relatório salvo:`);
    console.log(`    ${reportPath}`);
    console.log(`    UPDATE_REPORT.md\n`);
  } else {
    console.log(JSON.stringify(reportData, null, 2));
  }

  return reportData;
}

// ── Markdown report ────────────────────────────────────────────────────────

async function generateMarkdownReport(data, replaceable, available, incomplete, notFound, today) {
  let md = `# CPE Update Report\n\n`;
  md += `> Gerado em ${today} pelo \`cpe update\`.\n\n`;
  md += `| Categoria | Quantidade |\n|---|---|\n`;
  md += `| Substituíveis (pinned commit) | ${replaceable.length} |\n`;
  md += `| Disponíveis (HEAD) | ${available.length} |\n`;
  md += `| Incompletos (stub em CPE) | ${incomplete.length} |\n`;
  md += `| Não encontrados | ${notFound.length} |\n\n`;
  md += `---\n\n`;

  if (replaceable.length) {
    md += `## Substituíveis — Prioridade Alta\n\n`;
    md += `Estes stubs têm conteúdo real disponível no commit pinado. Substitua manualmente:\n\n`;
    for (const r of replaceable) {
      md += `### ${r.id}\n\n`;
      md += `- **Tipo:** ${r.type}\n`;
      md += `- **Plugin:** ${r.targetPlugin}\n`;
      md += `- **Upstream:** ${r.upstreamUrl}\n`;
      md += `- **Target CPE:** \`${r.suggestedPath || r.cpePath || 'a determinar'}\`\n\n`;
      md += `\`\`\`bash\n# Para substituir:\ncurl -s "${r.upstreamUrl}" > /tmp/upstream.md\n# Revisar conteúdo, normalizar frontmatter CPE, salvar em ${r.suggestedPath || 'target'}\n\`\`\`\n\n`;
    }
  }

  if (available.length) {
    md += `## Disponíveis no HEAD (não no pinned)\n\n`;
    md += `Arquivo existe no HEAD mas não no commit pinado. Considere atualizar o pinned_commit antes de substituir:\n\n`;
    for (const r of available) {
      md += `- **${r.id}** — ${r.upstreamUrl}\n`;
      if (r.note) md += `  *${r.note}*\n`;
    }
    md += '\n';
  }

  if (incomplete.length) {
    md += `## Incompletos — Conteúdo é Sumário\n\n`;
    md += `Estes arquivos existem no CPE mas foram criados a partir de sumários (WebFetch), não do conteúdo verbatim:\n\n`;
    for (const r of incomplete) {
      md += `- **${r.id}** → \`${r.cpePath}\`\n`;
      if (r.upstreamUrl) md += `  Upstream: ${r.upstreamUrl}\n`;
    }
    md += '\n';
  }

  md += `---\n`;
  md += `*Gerado por \`cpe update\`. Substituição é sempre manual — este engine apenas reporta.*\n`;

  writeFileSync(join(ROOT, 'UPDATE_REPORT.md'), md, 'utf8');
}

// ── Print helpers ──────────────────────────────────────────────────────────

function printSection(title, items, verbose) {
  if (!items.length) return;
  console.log(`  ${title} (${items.length}):`);
  for (const r of items) {
    const target = r.suggestedPath || r.cpePath || '(a criar)';
    console.log(`    ↑ [${r.type?.padEnd(8)}] ${r.id}`);
    if (verbose) {
      console.log(`        upstream: ${r.upstreamUrl || '—'}`);
      console.log(`        target:   ${target}`);
      if (r.note) console.log(`        nota:     ${r.note}`);
    }
  }
  console.log();
}
