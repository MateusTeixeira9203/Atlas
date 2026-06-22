# Claude Professional Environment (CPE)

Distribuição pessoal do ambiente de desenvolvimento para **Claude Code** —
skills, agentes, comandos, workflows e inteligência de design, curados de várias
comunidades, reutilizáveis em qualquer projeto e instaláveis em qualquer máquina.

> O CPE **complementa** o Claude Code; nunca o modifica. É um repositório que
> **é** um marketplace oficial do Claude Code.

## Status

🚧 Em construção, desenvolvido por fases (uma de cada vez, com aprovação).

- ✅ **Fase 1 — Arquitetura**: ver [docs/architecture.md](docs/architecture.md).
- ⏭️ Próxima: Fase 2 — Integração (pipeline Sources).

## Estrutura

| Diretório | Papel |
|---|---|
| `plugins/` | Conteúdo que o Claude Code carrega (plugins `cpe-*`) |
| `sources/` | Proveniência e rastreabilidade dos upstreams |
| `engines/` | Update Engine e Research Engine |
| `scripts/` | CLI `cpe` (install/uninstall/update/doctor) |
| `config/` | `config.yaml`, `watchlist.yaml` |
| `docs/` | Documentação (PT-BR), uma por módulo |
| `templates/` · `examples/` | Modelos e exemplos |

## Instalação (alvo — implementada na Fase 8)

```bash
git clone <repo> cpe
cd cpe
./install.sh        # ou: install.ps1 no Windows
```

O instalador detecta o SO, faz backup, registra o marketplace e instala os
plugins via o CLI oficial `claude plugin`. Reversível e sem sobrescrever nada.

## Créditos

Cada recurso integrado preserva autoria, licença e link de origem. Ver
[CREDITS.md](CREDITS.md).
