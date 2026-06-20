# MenuPage Frontend Preview

Projeto **somente front-end** para visualizar, ajustar e publicar a tela pública de cardápio `MenuPage` sem depender de backend.

## Estado atual

- React + Vite + TypeScript + Tailwind
- shadcn/ui já instalado como componentes locais
- Dados mockados em `src/mocks/menu.mock.ts`
- Adapter de backend isolado em `src/services/menu.service.ts`
- Build testado com `npm run build`
- Pronto para deploy na Vercel como SPA

## Rodar localmente

```bash
npm install
npm run dev
```

Para visualizar no celular na mesma rede:

```bash
npm run dev -- --host 0.0.0.0
```

## Build de produção

```bash
npm run build
npm run preview
```

## Deploy na Vercel

Configuração:

```txt
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

O arquivo `vercel.json` já contém rewrite para SPA, então rotas como `/r/bar-uendell3-250`, `/mesa/mesa-12` e `/produto/abc` não quebram ao atualizar a página.

## Onde alterar o visual

Tela principal:

```txt
src/pages/MenuPage.tsx
```

Componentes visuais:

```txt
src/components/StoreHeader.tsx
src/components/StoreInfo.tsx
src/components/SearchBar.tsx
src/components/CategoryChips.tsx
src/components/ProductCard.tsx
src/components/CartSummaryBar.tsx
src/components/BottomNavigation.tsx
src/components/MenuPageSidebar.tsx
```

## Como o dev deve integrar o backend depois

Não precisa mexer na tela para começar. O ponto correto de integração é:

```txt
src/services/menu.service.ts
```

Hoje ele retorna:

```ts
return mockMenuData
```

Quando o backend estiver pronto, troque a implementação de `getMenuData` por um `fetch`, mantendo o contrato:

```ts
export async function getMenuData(slug: string | null): Promise<MenuData>
```

Exemplo:

```ts
export async function getMenuData(slug: string | null): Promise<MenuData> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/menus/${slug}`)

  if (!response.ok) {
    throw new Error('Não foi possível carregar o cardápio')
  }

  return response.json() as Promise<MenuData>
}
```

O tipo esperado pelo front está documentado no próprio arquivo:

```txt
src/services/menu.service.ts
```

## Mocks que podem ser substituídos depois

```txt
src/mocks/menu.mock.ts
src/store/useCartStore.ts
src/hooks/useTableMode.ts
src/hooks/useStoreSlug.ts
```

Esses arquivos existem para o preview front-end funcionar sem banco, API, autenticação ou pedidos reais.


## Correção de instalação npm

Este pacote usa o registro público do npm via `.npmrc`. Se o `npm install` falhar por cache antigo ou arquivo travado no Windows, feche o VS Code/Cursor e qualquer terminal rodando o projeto, apague `node_modules` e rode `npm install` novamente.
