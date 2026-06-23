// research-engine.mjs — CPE Research Engine
// Detecta atualizações upstream comparando commits pinados com o HEAD atual.
// Gera relatório em ~/.cpe-state/ e stdout. NUNCA aplica mudanças.
//
// Rate limits GitHub API:
//   Unauthenticado: 60 req/hora
//   Com GITHUB_TOKEN: 5000 req/hora
//
// Uso:
//   cpe research               → verifica todas as fontes
//   cpe research karpathy      → verifica apenas uma fonte
//   cpe research --json        → output JSON para scripts

import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join }                                  from 'node:path';
import { homedir }                               from 'node:os';
import { ROOT, STATE_DIR, loadManifest, loadIntegrated } from './integrate.mjs';

const GITHUB_API = 'https://api.github.com';

// ── GitHub API ─────────────────────────────────────────────────────────────

function githubHeaders() {
  const h = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'cpe-research-engine/0.9.0',
  };
  if (process.env.GITHUB_TOKEN) h['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function githubGet(path) {
  const url = `${GITHUB_API}${path}`;
  const res  = await fetch(url, { headers: githubHeaders() });

  if (res.status === 403) {
    const reset = res.headers.get('x-ratelimit-reset');
    const resetTime = reset ? new Date(Number(reset) * 1000).toISOString() : 'desconhecido';
    throw new RateLimitError(`GitHub API rate limit atingido. Reset em: ${resetTime}`);
  }
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`);

  return res.json();
}

async function getLatestCommit(owner, repo) {
  const data = await githubGet(`/repos/${owner}/${repo}/commits?per_page=1`);
  if (!Array.isArray(data) || !data[0]) throw new Error(`Sem commits em ${owner}/${repo}`);
  return {
    sha:  data[0].sha,
    date: data[0].commit?.committer?.date || data[0].commit?.author?.date,
    msg:  data[0].commit?.message?.split('\n')[0] || '',
  };
}

async function getChangedFiles(owner, repo, base, head) {
  try {
    const data = await githubGet(`/repos/${owner}/${repo}/compare/${base}...${head}`);
    return {
      aheadBy: data.ahead_by || 0,
      files: (data.files || []).map(f => f.filename),
    };
  } catch {
    // compare can fail for very old base commits or deleted branches
    return { aheadBy: -1, files: [] };
  }
}

class RateLimitError extends Error {}

// ── Source parsing ──────────────────────────────────────────────────────────

function parseRepo(repositoryUrl) {
  // https://github.com/owner/repo → { owner, repo }
  const m = repositoryUrl?.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, '') };
}

// ── Impact mapping ─────────────────────────────────────────────────────────

function findAffectedResources(changedFiles, sourceId, subpath = '') {
  const integrated = loadIntegrated(sourceId);
  if (!integrated?.resources) return [];

  const affected = [];
  const prefix = subpath ? subpath.replace(/\/$/, '') + '/' : '';

  for (const r of integrated.resources) {
    if (!r.original_path) continue;
    const origPath = r.original_path.trim();

    for (const changedFile of changedFiles) {
      // Normalize: strip subpath prefix if present
      const normalFile = prefix && changedFile.startsWith(prefix)
        ? changedFile.slice(prefix.length)
        : changedFile;

      // Match: original_path starts with or equals the changed file path
      if (normalFile === origPath ||
          origPath.startsWith(normalFile.replace(/[^/]+$/, '')) ||
          normalFile.startsWith(origPath.replace(/[^/]+$/, ''))) {
        affected.push({
          id: r.id,
          status: r.status,
          cpe_path: r.cpe_path || '(sem cpe_path)',
          original_path: origPath,
          changed_file: changedFile,
        });
        break;
      }
    }
  }

  return affected;
}

// ── Main ───────────────────────────────────────────────────────────────────

export async function cmdResearch({ sourceFilter = null, json = false, verbose = false } = {}) {
  const today    = new Date().toISOString().split('T')[0];
  const manifest = loadManifest();
  const sources  = manifest.sources || [];

  const filtered = sourceFilter
    ? sources.filter(s => s.id === sourceFilter)
    : sources;

  if (sourceFilter && !filtered.length) {
    console.error(`ERRO: fonte '${sourceFilter}' não encontrada no manifest.`);
    process.exit(1);
  }

  if (!json) {
    console.log(`\n=== CPE Research Engine — ${today} ===`);
    const tokenNote = process.env.GITHUB_TOKEN ? '(autenticado)' : '(sem GITHUB_TOKEN — limite 60 req/hora)';
    console.log(`GitHub API ${tokenNote}\n`);
  }

  const results  = [];
  let   hasDelay = !process.env.GITHUB_TOKEN;
  let   reqCount = 0;

  for (const src of filtered) {
    const parsed = parseRepo(src.repository);
    if (!parsed) {
      results.push({ id: src.id, error: 'URL de repositório inválida', skipped: true });
      if (!json) console.log(`  ⚠ ${src.id}: URL de repositório inválida`);
      continue;
    }

    const { owner, repo } = parsed;

    try {
      // Rate limit: add small delay for unauthenticated requests
      if (hasDelay && reqCount > 0) await sleep(1200); // ~50 req/minute max
      reqCount++;

      const latest = await getLatestCommit(owner, repo);
      reqCount++;

      const pinned = src.pinned_commit;
      const upToDate = latest.sha === pinned || latest.sha.startsWith(pinned) || pinned.startsWith(latest.sha);

      let changed = { aheadBy: 0, files: [] };

      if (!upToDate) {
        if (hasDelay) await sleep(1200);
        changed = await getChangedFiles(owner, repo, pinned.substring(0, 8), latest.sha.substring(0, 8));
        reqCount++;
      }

      const affected = upToDate ? [] : findAffectedResources(changed.files, src.id, src.subpath);

      const result = {
        id:         src.id,
        name:       src.name,
        pinned:     pinned.substring(0, 8),
        latest:     latest.sha.substring(0, 8),
        latestDate: latest.date,
        latestMsg:  latest.msg,
        upToDate,
        aheadBy:    changed.aheadBy,
        changedFiles: changed.files,
        affectedResources: affected,
        license:    src.license,
      };

      results.push(result);

      if (!json) printSourceResult(result, verbose);

    } catch (err) {
      if (err instanceof RateLimitError) {
        if (!json) console.log(`\n  ✗ Rate limit: ${err.message}`);
        if (!json) console.log('  Dica: defina GITHUB_TOKEN para 5000 req/hora\n');
        results.push({ id: src.id, error: err.message, rateLimited: true });
        break; // Stop processing if rate limited
      }
      results.push({ id: src.id, error: err.message });
      if (!json) console.log(`  ✗ ${src.id}: ${err.message}`);
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────

  if (!json) printSummary(results);

  // ── Persist to state dir ──────────────────────────────────────────────────

  if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });

  const reportPath  = join(STATE_DIR, `research-${today}.json`);
  const latestPath  = join(STATE_DIR, 'research-latest.json');
  const reportData  = { generated: new Date().toISOString(), sources: results };

  writeFileSync(reportPath,  JSON.stringify(reportData, null, 2), 'utf8');
  writeFileSync(latestPath,  JSON.stringify(reportData, null, 2), 'utf8');

  if (!json) console.log(`  Relatório salvo: ${reportPath}\n`);
  if (json)  console.log(JSON.stringify(reportData, null, 2));

  return results;
}

// ── Printing ───────────────────────────────────────────────────────────────

function printSourceResult(r, verbose) {
  if (r.skipped || r.error) {
    console.log(`  ⚠ ${r.id}: ${r.error || 'erro desconhecido'}`);
    return;
  }

  if (r.upToDate) {
    console.log(`  ✔ ${r.id.padEnd(22)} pinned=${r.pinned}  up to date`);
    return;
  }

  const ahead = r.aheadBy > 0 ? `${r.aheadBy} commits à frente` : 'commits à frente (quantidade desconhecida)';
  console.log(`  ↑ ${r.id.padEnd(22)} pinned=${r.pinned}  latest=${r.latest}  ${ahead}`);
  console.log(`    Último commit: "${r.latestMsg?.substring(0, 80)}" (${r.latestDate?.split('T')[0] || '?'})`);

  if (r.changedFiles.length) {
    const shown = verbose ? r.changedFiles : r.changedFiles.slice(0, 5);
    console.log(`    Arquivos alterados (${r.changedFiles.length}): ${shown.join(', ')}${!verbose && r.changedFiles.length > 5 ? '...' : ''}`);
  }

  if (r.affectedResources.length) {
    console.log(`    Recursos CPE potencialmente afetados (${r.affectedResources.length}):`);
    for (const a of r.affectedResources) {
      const stub = a.status === 'stub' ? ' [stub]' : '';
      console.log(`      ~ ${a.id}${stub} → ${a.cpe_path}`);
    }
  } else if (r.changedFiles.length) {
    console.log(`    Nenhum recurso CPE mapeado para os arquivos alterados.`);
  }
  console.log();
}

function printSummary(results) {
  const updates  = results.filter(r => !r.upToDate && !r.error && !r.skipped);
  const upToDate = results.filter(r => r.upToDate);
  const errors   = results.filter(r => r.error);

  console.log('─'.repeat(60));
  console.log(`  Resumo: ${upToDate.length} atualizados  ${updates.length} com updates disponíveis  ${errors.length} erros`);

  if (updates.length) {
    console.log('\n  Updates disponíveis:');
    for (const u of updates) {
      const count = u.affectedResources.length;
      console.log(`    ${u.id}: ${u.aheadBy > 0 ? u.aheadBy + ' commits' : 'N commits'}  (${count} recurso(s) CPE possivelmente afetado(s))`);
    }
    console.log('\n  Nota: Updates detectados são informativos. Use cpe doctor para validar.');
    console.log('  Para atualizar: edite o pinned_commit em sources/manifest.yaml e re-integre manualmente.');
  }
  console.log();
}

// ── Utils ──────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
