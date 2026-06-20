import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom'

import { MenuPage } from './pages/MenuPage'
import './index.css'

function PlaceholderPage({ title }: { title: string }) {
  const params = useParams()

  return (
    <div className="flex min-h-dvh items-center justify-center bg-menu-bg px-6 text-center [font-family:'Sen',Helvetica]">
      <div className="max-w-sm rounded-2xl bg-white p-6 shadow-menu-md">
        <h1 className="text-xl font-bold text-menu-text">{title}</h1>
        <p className="mt-2 text-sm text-menu-text-soft">
          Essa rota existe só para o preview não quebrar. O foco do editor é a tela MenuPage.
        </p>
        {params.id && <p className="mt-2 text-xs text-menu-text-soft">ID: {params.id}</p>}
        <Link
          to="/"
          className="mt-5 inline-flex rounded-full bg-menu-primary px-5 py-2 text-sm font-bold text-white"
        >
          Voltar ao cardápio
        </Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/r/:slug" element={<MenuPage />} />
        <Route path="/mesa/:token" element={<MenuPage />} />
        <Route path="/produto/:id" element={<PlaceholderPage title="Detalhe do produto" />} />
        <Route path="/carrinho" element={<PlaceholderPage title="Carrinho" />} />
        <Route path="/meus-pedidos" element={<PlaceholderPage title="Meus pedidos" />} />
        <Route path="/comanda" element={<PlaceholderPage title="Comanda" />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
