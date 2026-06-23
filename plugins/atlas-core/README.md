# atlas-core

Plugin base do Atlas. Dependência implícita de todos os demais.

Contém as **convenções** do ambiente, **meta-comandos** do Atlas e a **guarda de
design** — o mecanismo que impede a geração de interfaces genéricas.

| Componente | Conteúdo (a partir das fases 5–6) |
|---|---|
| `commands/` | Meta-comandos do Atlas (status, doctor, índice de skills) |
| `skills/` | Convenções e guarda anti-genérico |
| `agents/` | Agentes de suporte do próprio Atlas |
| `hooks/` | Hooks que reforçam convenções |

Vazio nesta fase (esqueleto). Conteúdo curado nas fases seguintes, com
proveniência registrada em `sources/`.
