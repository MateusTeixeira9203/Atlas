# Arquitetura do Atlas

> Documento de fundação. Define **como** o Atlas funciona e por quê. Decisões de
> arquitetura mudam aqui primeiro — código depois.

O Atlas é uma **evolução do Atlas**, construída com a estratégia **nativo-primeiro**:
reaproveitar o que o Claude Code já oferece, em vez de reinventar orquestração.

---

## 1. Modelo mental

```
Atlas = brain fino (roteador)
      + biblioteca de personas/skills
      + engines transversais (pesquisa, leitura)
      + memória versionada e escopada
```

Tudo nativo do Claude Code, tudo em git no GitHub. O brain **não executa** —
ele decide quem trabalha. É isso que mantém o sistema simples e durável.

---

## 2. Camada → primitivo nativo

| Camada (visão) | Primitivo nativo do Claude Code | Estado |
|---|---|---|
| Personas (cto, architect, mentor, leitor…) | **subagents** (`agents/`) | engenharia pronta; intelectual a criar |
| Skills (código, ideação, debate…) | **skills** (`skills/`) | ~40 de código prontas; intelectuais a criar |
| Engines (research, review, planning…) | **skills/commands** | parcial; `research` e `reading` a implementar |
| Brain (roteador) | **skill/command de entrada** | a criar (fino, sem maestro reinventado) |
| Memória | **arquivos markdown versionados** | a estruturar |
| Identidade | **`identity/`** | criada no Sprint 1 |

O conteúdo continua sendo markdown portável — mas a orquestração é gratuita.

---

## 3. O fluxo de um turno (sempre os mesmos 5 passos)

```
1. Você fala em linguagem natural
2. O brain classifica a intenção → escolhe persona(s) + skill(s) + engine(s)
3. Carrega a memória relevante (pessoal + do projeto atual)
4. Trabalha — pesquisa, lê, debate, projeta, implementa
5. Destila o que importa de volta para memory/ (vira git)
```

O passo 5 é o que dá continuidade e, no futuro, vira o dataset do Atlas.

---

## 4. Subsistemas

### 4.1 Memória — escopada em duas camadas

A memória **nunca** é um balde único. É escopada para evitar mistura entre
projetos e proteger confidencialidade.

```
MEMÓRIA PESSOAL (global)        → vive no repo do Atlas (memory/)
  você, seu jeito de pensar,      → carregada SEMPRE, em todo projeto
  livros, princípios, preferências

MEMÓRIA DO PROJETO (local)      → vive DENTRO de cada projeto
  decisões, contexto, ADRs        → carregada SÓ quando você está nele
  daquele projeto                 → versionada com o git daquele projeto
```

**Regra de ouro:** memória de projeto é **local por padrão**. Só o que é
conhecimento pessoal durável "sobe" para a camada global — e isso é uma
**decisão consciente, nunca automática**. O Atlas pergunta antes de promover.

Resultado: ao abrir o Projeto B, o brain carrega a camada pessoal + a memória
do Projeto B. A memória do Projeto A nem é tocada — está noutro repositório.
Sem vazamento, por design.

**Por que markdown em git, e não banco vetorial:** zero infra, portátil,
versionado (a evolução do Atlas é o `git log`), inspecionável, grátis. Aguenta
centenas de notas. Se o volume exigir busca semântica, adiciona-se um índice
de recuperação por cima — sem jogar nada fora.

### 4.2 Pesquisa — com referências reais

Ferramentas nativas `WebSearch` + `WebFetch`. A disciplina mora na skill:
toda afirmação factual carrega **fonte + URL**; separa o que é fundamentado do
que é inferência; **nunca inventa** referência; resultado salvo em
`memory/references/` para reuso.

### 4.3 Leitura — debate de livros (PDF)

Ferramenta nativa `Read` lê PDF em blocos. Ler ≠ engolir o PDF de uma vez —
ler é **destilar progressivamente** para a memória:

```
PDF → leitura por capítulo → notas (tese, argumentos, citações c/ página)
    → memory/readings/<livro>.md → debate ancorado + cruzamento entre livros
```

**Os PDFs não entram no repositório** (binários grandes, direito autoral). O
arquivo fica local; versiona-se só as notas destiladas.

---

## 5. Evolução do Atlas — aditivo, não demolição

```
identity/        ← quem o Atlas é                          [NOVO]
memory/          ← memória pessoal versionada              [NOVO]
brain/           ← roteador de entrada                     [NOVO]
plugins/
  atlas-mind/    ← personas + skills intelectuais          [NOVO]
  atlas-engineering/ · atlas-design/ · atlas-workflows/          [REAPROVEITA]
engines/
  research/      ← pesquisa real (hoje vazio → implementar)
  reading/       ← ingestão de PDF → notas                 [NOVO]
```

A renomeação `cpe-*` → `atlas-*` é **cosmética e arriscada** (toca a CLI, o
`doctor`, frontmatter e referências). Fica **adiada para um sprint próprio no
final**, quando tudo estiver estável e o `doctor` puder validar a migração.

---

## 6. Visão futura (não bloqueia nada hoje)

A arquitetura nativa-primeiro já aponta para os próximos passos sem retrabalho:

- **Agente autônomo:** as mesmas skills/personas/memória rodam em rotinas
  agendadas (o Atlas pesquisa e traz ideias proativamente) via SDK/cron.
- **Modelo pessoal:** a `memory/` acumulada é um corpus estruturado de como
  você pensa. O caminho realista é **RAG** (já é o Atlas de hoje) + um
  **LoRA leve** num modelo aberto pequeno para o estilo — não treinar do zero.

Por isso a disciplina na estrutura de `memory/` importa **desde o primeiro dia**:
ela é o que torna esse futuro barato e possível.
