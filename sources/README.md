# sources/ — Rastreabilidade

Este módulo **não é carregado pelo Claude Code**. Ele garante a filosofia do Atlas:
estudar os upstreams, não copiá-los, e preservar autoria, licença e proveniência.

## Conteúdo

| Arquivo / pasta | Papel |
|---|---|
| `manifest.yaml` | Registro das fontes upstream (declaração de intenção) |
| `<source-id>/integrated.yaml` | Recursos extraídos de cada fonte, com metadados (fonte da verdade) |
| `<source-id>/decisions/` | Relatórios de dedup justificados |

## Pipeline (Fase 2)

```
Source → Análise → Classificação → Extração → Normalização → Integração → Documentação → Rastreabilidade
```

## Regras

- Nunca copiar um repositório inteiro; extrair recursos selecionados.
- Toda eliminação de redundância é comparada, relatada e justificada — nunca automática.
- `manifest.yaml` declara intenção; `integrated.yaml` registra fatos verificados.
- O `CREDITS.md` da raiz é **gerado** a partir destes arquivos.

Ver [docs/architecture.md](../docs/architecture.md), seção 4.
