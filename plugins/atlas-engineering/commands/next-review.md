---
name: next-review
description: Code review especializado para Next.js App Router — verifica Server/Client boundary, Server Actions, Route Handlers, data fetching e segurança.
cpe:
  source: cpe-personal
  integrated_at: 2026-06-22
  adaptation: Atlas-authored — checklist de review para Next.js 14+
---

# /next-review

Review especializado de código Next.js App Router. Execute sobre o arquivo ou diretório especificado.

## Como Invocar

```
/next-review                    # revisa arquivos modificados (git diff)
/next-review app/               # revisa toda a pasta app/
/next-review app/api/           # revisa apenas Route Handlers
/next-review lib/actions/       # revisa apenas Server Actions
```

## Checklist de Review

### 1. Server vs Client Boundary

- [ ] `"use client"` só onde há hooks, eventos ou APIs de browser
- [ ] `"use client"` empurrado o mais para baixo na árvore possível
- [ ] Nenhum fetch de dados, acesso a DB ou segredo em Client Components
- [ ] Providers e wrappers de contexto marcados como `"use client"`, não o layout inteiro
- [ ] Funções não passadas como props de Server → Client (erros de serialização)
- [ ] Dados passados de Server para Client são serializáveis (sem `Date`, `Map`, `Set`)

### 2. Server Actions

- [ ] `auth()` ou verificação de sessão como **primeira instrução** (antes de qualquer outra coisa)
- [ ] `schema.safeParse()` com `flatten().fieldErrors` antes de acessar dados
- [ ] `redirect()` e `notFound()` **fora** de `try/catch`
- [ ] `revalidatePath` ou `revalidateTag` após mutations
- [ ] `try/catch` apenas em torno de operações de DB/API externa
- [ ] Tipo de retorno explícito e consistente (`Promise<ActionState>`)
- [ ] Nenhum dado sensível retornado ao cliente

### 3. Route Handlers

- [ ] Auth verificada antes de processar qualquer body/params
- [ ] Body do request parseado com `try/catch` antes de usar
- [ ] Inputs validados com Zod antes de consultas ao banco
- [ ] Webhooks: assinatura verificada antes de processar evento
- [ ] Responses com status codes corretos (401, 403, 404, 422, 500)
- [ ] Nenhum segredo em variáveis `NEXT_PUBLIC_`
- [ ] CORS configurado se necessário (não exposto por padrão)

### 4. Data Fetching

- [ ] Dados paralelos com `Promise.all` (sem waterfall desnecessário)
- [ ] `cache()` do React para deduplicar queries na mesma render pass
- [ ] `revalidate` adequado para cada tipo de dado (estático vs dinâmico)
- [ ] Queries diretas ao banco em Server Components (sem round-trip HTTP desnecessário)
- [ ] `fetch` com `{ cache: 'no-store' }` para dados sempre frescos
- [ ] Sem `useEffect` + `fetch` em Client Components (usar RSC ou React Query)

### 5. Middleware

- [ ] `updateSession()` chamado para renovar token Supabase
- [ ] `matcher` explícito (não captura assets estáticos)
- [ ] Auth check antes de redirect para rotas protegidas
- [ ] Sem operações pesadas ou calls de DB no middleware (lento, edge runtime)

### 6. Error Handling

- [ ] `error.tsx` presente para rotas críticas (Client Component com `reset` prop)
- [ ] `not-found.tsx` presente para rotas com lookup de recursos
- [ ] `notFound()` chamado quando recurso não existe (fora de try/catch)
- [ ] Erros de DB logados no servidor, mensagem genérica retornada ao usuário
- [ ] `Sentry.captureException(error)` em error boundaries

### 7. Tipagem e Zod

- [ ] `z.infer<typeof schema>` para tipos derivados (sem duplicação)
- [ ] `z.coerce.number()` e `z.coerce.boolean()` para dados de `FormData`
- [ ] `safeParse` em vez de `parse` em Server Actions/Route Handlers
- [ ] Env vars validadas com Zod em `env.ts`

### 8. Performance

- [ ] Imagens com `next/image` (não `<img>` nativo)
- [ ] Fontes com `next/font` (não import direto)
- [ ] Links com `next/link` (não `<a>` nativo para navegação interna)
- [ ] `dynamic()` com `{ ssr: false }` para componentes que precisam de SSR desabilitado
- [ ] Suspense boundaries em torno de Server Components que fazem await

## Veredicto

Emita o veredicto com:

**BLOCK** — problema de segurança (auth ausente, segredo exposto, validação ausente em mutation)  
**WARN** — problema de qualidade (anti-padrão, performance, tipagem fraca)  
**APPROVE** — sem problemas críticos encontrados

Formato de saída:
```
## Next.js Review

### BLOCK (n)
- [arquivo:linha] Descrição do problema e como corrigir

### WARN (n)
- [arquivo:linha] Descrição do problema e sugestão

### Veredicto: BLOCK | WARN | APPROVE
```
