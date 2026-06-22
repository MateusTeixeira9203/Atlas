# Research Engine

Pesquisa continuamente novidades do ecossistema Claude Code, conforme
`config/watchlist.yaml`. Monitora novos repositórios, skills, MCPs, prompts,
workflows, ferramentas e boas práticas.

Gera relatórios em `${state_dir}/research/reports` para revisão humana —
**nunca instala nem altera o ambiente**.

## Estrutura (Clean Architecture)

```
research/
├── domain/        ← Finding, EcosystemTarget, Report
├── application/   ← ScoutEcosystem, RankFindings
└── adapters/      ← GitHubSearch, WebSearch, ReportRenderer
```

Implementado na Fase 9.
