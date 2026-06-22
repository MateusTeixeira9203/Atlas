# Update Engine

Monitora **cada fonte separadamente**. Quando há atualização upstream:

- identifica recursos novos, removidos e mudanças incompatíveis;
- compara contra `sources/<id>/integrated.yaml`;
- gera relatório em `${state_dir}/update/reports`;
- **sugere** integração — nunca aplica sozinho.

Também reporta incompatibilidades entre o CPE e novas versões do Claude Code.

## Estrutura (Clean Architecture)

```
update/
├── domain/        ← Source, Resource, Provenance, UpdateDiff
├── application/   ← DetectUpdates, CompareSnapshots
└── adapters/      ← Git, ClaudeCli, FileSystem, ReportRenderer
```

Implementado na Fase 10.
