import { createBrowserRouter } from 'react-router'
import { Layout } from './Layout'
import { StubPage } from './StubPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, element: <StubPage title="Dashboard" /> },
      { path: 'receitas', element: <StubPage title="Receitas" /> },
      { path: 'receitas/:id', element: <StubPage title="Detalhe da receita" /> },
      { path: 'nova-receita', element: <StubPage title="Nova receita" /> },
      { path: 'lista-de-compras', element: <StubPage title="Lista de compras" /> },
      { path: 'despensa', element: <StubPage title="Despensa" /> },
      { path: 'cardapio', element: <StubPage title="Cardápio semanal" /> },
      { path: 'chat', element: <StubPage title="Chat IA" /> },
      { path: 'perfil/:username', element: <StubPage title="Perfil" /> },
      { path: 'livro/:username', element: <StubPage title="Livro de receitas" /> },
    ],
  },
])
