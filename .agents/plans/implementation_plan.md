# IFPlan Dashboard — Redesign + Correção de Navegação

Redesign arrojado da tela de Dashboard inspirado em apps premium (Spotify/iFood/Netflix) com foco no contexto da produção leiteira, além de correção do bug de loop de navegação ao editar/simular e voltar.

---

## Diagnóstico

### Fase 1 — Design do Dashboard

O dashboard atual é uma lista simples com um FAB verde. Faltam:
- **Identidade visual** do contexto (leite, fazenda, agro-tech)
- **Header com saudação/contexto** para engajar o usuário
- **Cards de resumo** (total de simulações, última simulação, etc.)
- **Card de simulação** atualizado com tema dinâmico (dark/light)
- **Empty state** mais atraente com CTA claro
- O `Card.tsx` usa o `theme` estático (lightTheme hardcoded) — não reage ao dark mode

### Fase 2 — Bug de Navegação (Loop de Backs)

**Raiz do problema:**  
Na tela de simulação (`simulation/index.tsx`), o listener `beforeRemove` intercepta a navegação de volta **sempre que `isEditing=true` OU `isDirty=true`**. Quando vem de `/result/[id]` via `router.push('/simulation?id=xxx')`, o stack fica:

```
dashboard → result/[id] → simulation (editing)
```

Ao salvar, o código faz `router.replace('/result/${id}')` — substitui simulation no stack, mas a lógica de `beforeRemove` ainda pode disparar dependendo do estado do `isDirty`. O loop ocorre porque:

1. `handleEdit` em result usa `router.push('/simulation?id=xxx')` → adiciona ao stack
2. Ao salvar em simulation: `router.replace('/result/${id}')` → correto em teoria
3. Ao voltar no result sem salvar: result tem botão "Editar" que faz push novamente  
4. Se o usuário pressionar back do hardware/gesto repetidamente, o beforeRemove bloqueia e mostra modal → usuário clica "Sair" → navigation.dispatch → que pode disparar novamente em certos cenários de edge case do Expo Router

**Solução:** Usar `router.replace` em vez de `router.push` no `handleEdit` do result screen, e garantir que `isSavingRef.current = true` é definitivo antes do replace.

---

## Plano de Implementação

---

### Fase 1 — Dashboard Redesign

#### [MODIFY] [dashboard/index.tsx](file:///Users/josileudo/Documents/projects/react-native/IFPlan-React/src/app/dashboard/index.tsx)

Redesign completo com:
- **Header premium**: saudação personalizada por hora do dia ("Bom dia, Produtor 🌄"), ícone do app, indicador do modo dark/light
- **Banner de resumo**: cards horizontais compactos mostrando `Total de Simulações` e `Última Atualização`
- **Search bar** estilizada (já existe, manter funcionalidade, melhorar visual)
- **FlatList de cards** com `ListHeaderComponent` para os cards de resumo
- **Empty state** com ícone ilustrativo grande e botão CTA direto (sem precisar do FAB)
- **FAB animado** com ripple e sombra verde vibrante (já existe `AnimatedButton`)
- Remover o link de "Política de Privacidade" do header (desnecessário no topo)
- Usar `useTheme()` em todo lugar (nenhuma cor hardcoded)

**Estrutura visual proposta:**
```
┌─────────────────────────────────┐
│  🌾 IFPlan         [avatar/dark]│  ← Header
│  Bom dia, Produtor 🌄           │
├─────────────────────────────────┤
│ [📊 3 Simulações] [📅 Hoje]    │  ← Stats cards horizontais
├─────────────────────────────────┤
│ 🔍 Buscar simulação...          │  ← Search
├─────────────────────────────────┤
│ ┌──────────────────────────┐   │
│ │ 🏷 Fazenda Santa Clara   │   │  ← Card de simulação (redesenhado)
│ │ desc | 28 abr 2026   [🗑]│   │
│ └──────────────────────────┘   │
│                  ...            │
│  🔒 Política de Privacidade →   │  ← ListFooterComponent (sutil)
│                    [  +  ] FAB  │  ← FAB verde
└─────────────────────────────────┘
```

A **Política de Privacidade** é renderizada como `ListFooterComponent` da FlatList: um link sutil com ícone de cadeado, alinhado ao centro, na cor `text.placeholder`, bem discreto mas acessível.

#### [MODIFY] [Card.tsx](file:///Users/josileudo/Documents/projects/react-native/IFPlan-React/src/components/Card.tsx)

- Substituir `theme` estático por `useTheme()` para suporte a dark mode
- Adicionar ícone de pré-visualização (ex: ícone de leite/gráfico) à esquerda do card
- Adicionar indicador de data mais visual (chip colorido)
- Melhorar o botão de exclusão (já existe, mas vai ter estilo dinâmico)
- Adicionar seta de navegação (chevron-right) à direita

---

### Fase 2 — Correção de Navegação

#### [MODIFY] [result/[id].tsx](file:///Users/josileudo/Documents/projects/react-native/IFPlan-React/src/app/result/%5Bid%5D.tsx)

**Mudança:** `handleEdit` de `router.push` → `router.replace`

```diff
- const handleEdit = () => {
-   router.push(`/simulation?id=${id}`);
- };
+ const handleEdit = () => {
+   router.replace(`/simulation?id=${id}`);
+ };
```

Isso elimina a camada extra no stack. O fluxo passa a ser:
```
dashboard → result/[id] ↔ simulation (replace, sem empilhar)
```
Ao salvar em simulation, `router.replace('/result/${id}')` volta para result corretamente (1 back para dashboard).

#### [MODIFY] [simulation/index.tsx](file:///Users/josileudo/Documents/projects/react-native/IFPlan-React/src/app/simulation/index.tsx)

**Mudança 1:** Garantir que o `isSavingRef.current = true` seja setado **antes** de qualquer operação async/setState, e que o modal de saída não apareça ao fazer replace após salvar.

**Mudança 2:** Ajuste na condição do `beforeRemove`:
```diff
- if (isSavingRef.current || (!isDirty && !isEditing)) {
+ if (isSavingRef.current) {
    return;
  }
+ // Ao editar, permite sair se não houve mudanças no form
+ if (!isDirty) {
+   return;
+ }
```

Isso corrige o caso onde o usuário chega em modo edição mas não alterou nada — o `beforeRemove` não deve bloquear a navegação nesse caso.

---

## Verificação

### Automated
- Recompilar o app (`yarn android` já está rodando)
- Verificar que o app abre sem erros de TypeScript

### Manual / Fluxos a testar
1. **Dashboard vazio** → aparece empty state com CTA
2. **Criar simulação** → volta ao dashboard com novo card
3. **Abrir resultado** → editar → salvar → voltar ao dashboard (1 back) ✅
4. **Abrir resultado** → editar → descartar → voltar ao resultado ✅
5. **Dark mode** → cards e header reagem corretamente
6. **Busca** → filtra cards em tempo real
7. **Excluir** card → confirmação → card some da lista

---

## Open Questions

> [!NOTE]
> **Saudação personalizada** — o app não tem login/nome de usuário. A saudação ficará genérica como "Bom dia, Produtor 🌄". Isso está alinhado com a proposta?
