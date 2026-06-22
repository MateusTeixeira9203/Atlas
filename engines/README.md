# engines/ — Motores de automação

Dois motores, ambos em **Clean Architecture** (`domain/` · `application/` ·
`adapters/`) e ambos sob a regra de ouro: **geram relatórios, nunca aplicam
mudanças automaticamente**.

| Motor | Papel | Fase |
|---|---|---|
| [`update/`](update/README.md) | Monitora cada fonte, diffa contra o que foi integrado, relata novidades/remoções/incompatibilidades | 10 |
| [`research/`](research/README.md) | Vasculha o ecossistema Claude Code por novos repos, skills, MCPs, prompts, workflows | 9 |

Esqueleto nesta fase. O código segue domínio sem dependências, casos de uso
orquestrando portas, e adaptadores injetáveis (Git, ClaudeCli, FileSystem,
ReportRenderer) — testáveis sem rede nem filesystem real.
