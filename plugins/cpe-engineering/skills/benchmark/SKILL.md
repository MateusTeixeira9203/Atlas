---
name: benchmark
description: Measure and track performance baselines for web pages, APIs, and build pipelines. Detect regressions before/after PRs, compare stack alternatives, and store results as Git-tracked JSON for team visibility.
cpe:
  source: ecc
  original_path: skills/benchmark/SKILL.md
  original_url: https://github.com/affaan-m/ECC/blob/main/skills/benchmark/SKILL.md
  source_commit: 71d22d0a
  license: MIT
  integrated_at: 2026-06-22
  adaptation: stub — conteúdo normalizado pelo CPE
  status: stub
---

# Benchmark

Measure performance baselines, detect regressions before/after PRs, and compare stack alternatives.

## When to Activate

- Establishing performance baselines for a project
- Checking if a PR introduces regressions
- Comparing two implementation approaches by speed
- Setting up CI performance gates
- Diagnosing slow pages, endpoints, or builds

## Page Performance (Core Web Vitals)

Track: LCP, CLS, INP, FCP, TTFB, resource sizes, network requests, render-blocking resources.

```bash
npx lighthouse https://myapp.com --output json --output-path ./baseline.json
```

## API Performance (k6)

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = { vus: 50, duration: '30s' };

export default function () {
    const res = http.get('https://api.example.com/endpoint');
    check(res, { 'status 200': (r) => r.status === 200 });
    sleep(1);
}
```

Report p50/p95/p99 latency. Alert when p99 exceeds threshold.

## Build Performance

```bash
time npm run build    # cold build
time npm test         # test suite
time docker build .   # image build
```

## Before/After Workflow

```
1. Save baseline:   node benchmark.mjs save --name before-change
2. Make the change
3. Run:             node benchmark.mjs run
4. Compare:         node benchmark.mjs compare before-change
```

Store baselines as JSON under `.cpe/benchmarks/` (Git-tracked). This lets the whole team see regressions in PR reviews.

## Verdict Format

```
metric      before    after     delta    verdict
LCP         2.1s      1.8s      -14%     ✓ BETTER
p99 API     230ms     280ms     +22%     ⚠ WARNING
Build       45s       43s       -4%      ✓ BETTER
```

---
*Stub — conteúdo normalizado pelo CPE. Verificar e substituir pelo SKILL.md original do ECC após rate limit.*
