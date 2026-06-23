# Brain — o roteador do Atlas

> O brain é a **porta da frente** do Atlas. Você conversa em linguagem natural;
> ele decide quem trabalha. Esta pasta define a **filosofia** do roteamento —
> a implementação (skill/command) vem em sprint posterior.

---

## O que o brain é

Um **roteador fino e nativo**. Ele não executa tarefas, não escreve código, não
pesquisa. Ele **classifica a intenção** e ativa o conjunto certo de personas,
skills e engines — usando o que o Claude Code já faz sozinho (skills se
auto-ativam por descrição; subagents são as personas).

## O que o brain NÃO é

- **Não** é um maestro reinventado em markdown.
- **Não** é uma camada de orquestração paralela ao Claude Code.
- **Não** decide por você — quando há trade-offs, ele apresenta e recomenda;
  a decisão final é sua.

Reinventar orquestração que o ambiente já oferece seria o erro nº 1 do projeto.
O brain é deliberadamente magro.

---

## O fluxo (5 passos)

```
1. Você fala em linguagem natural
2. brain classifica a intenção → persona(s) + skill(s) + engine(s)
3. carrega a memória relevante (pessoal + projeto atual)
4. trabalha
5. destila o que importa para memory/
```

---

## Exemplos de roteamento

| Você diz | brain ativa |
|---|---|
| "Quero debater o capítulo 3 de Antifrágil" | persona `leitor/debatedor` + engine `reading` + `memory/readings/` |
| "Que ramo de negócio faz sentido pra mim?" | personas `ceo` + `estrategista` + engine `research` + `memory/projects/` |
| "Vamos construir o MVP" | `architect` → `planner` → skills de código → `code-reviewer` |
| "Tenho pensado que disciplina é superestimada" | persona `mentor/pensador` + engine `research` + `memory/discussions/` |

Mesmo sistema, mesma memória — do pensamento ao código rodando.

---

## Princípio de design

> Sempre que o Claude Code já fizer algo nativamente, o brain **usa**, não
> recria. Cada linha do brain precisa se justificar; na dúvida, ela não existe.
