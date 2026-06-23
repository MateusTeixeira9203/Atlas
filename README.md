# Atlas

> Um par intelectual e arquiteto pessoal, construído sobre o Claude Code.
> Com quem se discute ideias, se debate livros, se planeja negócio e se constrói
> software — sempre com referências reais, e com memória que dura.

Atlas não é um assistente que só executa. É um sistema que pensa junto: questiona,
discorda quando há argumento, busca fontes verificáveis e acompanha do **pensamento
→ idealização → arquitetura → implementação**. Vive 100% no GitHub e evolui commit
a commit.

Construído por **Mateus Teixeira**.

---

## As duas metades

```
        VOCÊ  (conversa em linguagem natural)
                      │
                  brain  (roteador fino, nativo)
            ┌─────────┴──────────┐
      atlas-mind            engenharia
   (par intelectual)      (atlas-engineering / -design / -workflows)
   pensar · ler ·          arquitetura · review ·
   debater · negócio       testes · build
            └─────────┬──────────┘
              fundação compartilhada
        pesquisa · leitura · memória · conselho
```

- **Metade intelectual** (`atlas-mind`) — personas para discutir ideias, debater
  livros (PDF → notas destiladas) e pensar negócio, com disciplina de referências.
- **Metade de engenharia** (`atlas-engineering`, `atlas-design`, `atlas-workflows`,
  `atlas-core`) — skills, agents e comandos de código, design e workflow.

## Como funciona

O `brain` é só um roteador fino — não reinventa orquestração que o Claude Code já
faz nativamente. Cada turno segue 5 passos:

```
1. Você fala            2. brain ativa persona + skills
3. carrega memória      4. trabalha       5. destila p/ memory/
```

## Capacidades em destaque

| O que | Como invocar |
|---|---|
| Debater uma ideia/decisão | conversa normal → `thinking-partner` |
| Debater um livro (PDF) | mande o PDF → `reading-companion` |
| Pensar negócio com mercado real | pergunte → `business-strategist` |
| Decisão com vários ângulos | **"convoca o conselho"** → `council` (3 estágios: prós/contras/viabilidade) |
| Auditar design de um projeto | `/design-review`, `/polish`, agentes `ux-reviewer` / `ui-architect` |

## Memória — o cérebro que dura

Markdown versionado em git, escopado em duas camadas:

- **Pessoal (global)** — `memory/`: quem você é, livros, decisões, princípios.
  Carregada em todo projeto.
- **De projeto (local)** — vive dentro de cada projeto. Não vaza para os outros.

Cada conversa deixa rastro estruturado. Em meses, `memory/` vira um corpus do seu
próprio jeito de pensar — a base para, um dia, um modelo pessoal.

## Estrutura

```
identity/        manifesto e princípios do Atlas
core/            como ele raciocina, comunica e executa
brain/           filosofia do roteador
memory/          memória pessoal versionada
plugins/
  atlas-mind/        personas + skills intelectuais (+ council)
  atlas-engineering/ atlas-design/ atlas-workflows/ atlas-core/
sources/         proveniência de cada recurso curado
scripts/         CLI de validação (cpe.mjs — doctor, report, status)
```

## Usar no Claude Code

Atlas é uma **distribuição do Claude Code** — roda onde o Claude Code roda
(VS Code + extensão, ou o CLI). Registre o marketplace uma vez:

```bash
# no app: /plugin → add marketplace → caminho local deste repo
# ou via CLI:
node scripts/cpe.mjs install --apply
```

Depois, em qualquer projeto (ex.: odonto.ia), o Atlas está disponível.

### CLI de manutenção

```bash
node scripts/cpe.mjs doctor    # valida proveniência e estrutura
node scripts/cpe.mjs report    # regenera CREDITS.md / INTEGRATION_REPORT.md
node scripts/cpe.mjs status    # estado das fontes integradas
```

> Nota: a CLI mantém o nome de arquivo `cpe.mjs` e o frontmatter `cpe:` como
> plumbing interno (renomear traria churn sem valor). A identidade do projeto é
> Atlas; o motor por baixo segue funcionando.

## Filosofia

Qualidade antes de velocidade. Remover complexidade antes de adicionar abstração.
Referências reais antes de palpite. Atlas é feito para continuar elegante daqui a
cinco anos. Leia o [manifesto](identity/manifesto.md) e a
[arquitetura](docs/atlas-architecture.md).

## Créditos

Atlas cura recursos de projetos open source preservando autoria, licença e
rastreabilidade. Ver [CREDITS.md](CREDITS.md).
