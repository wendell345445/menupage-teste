CORREÇÃO CONSOLIDADA - TELA DE PRODUTO

1. Copie/substitua os arquivos deste ZIP dentro do seu projeto.
2. Confirme que index.html está na raiz do projeto.
3. Confirme que src/index.css existe.
4. Rode:

   taskkill /F /IM node.exe
   npm install
   npm run dev

5. Teste:

   http://localhost:5173/
   http://localhost:5173/produto/pizza-grande-portuguesa

6. Para build:

   npm run build

Observação: não use import '.index.css'. O correto no src/main.tsx é:

   import './index.css'
