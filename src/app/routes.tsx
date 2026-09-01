import { createBrowserRouter } from 'react-router'
import { Layout } from './Layout'
import { StubPage } from './StubPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, element: <StubPage titleKey="pages.dashboard" /> },
      { path: 'receitas', element: <StubPage titleKey="pages.recipes" /> },
      { path: 'receitas/:id', element: <StubPage titleKey="pages.recipe_detail" /> },
      { path: 'nova-receita', element: <StubPage titleKey="pages.new_recipe" /> },
      { path: 'lista-de-compras', element: <StubPage titleKey="pages.shopping_list" /> },
      { path: 'despensa', element: <StubPage titleKey="pages.pantry" /> },
      { path: 'cardapio', element: <StubPage titleKey="pages.weekly_menu" /> },
      { path: 'chat', element: <StubPage titleKey="pages.chat" /> },
      { path: 'perfil/:username', element: <StubPage titleKey="pages.profile" /> },
      { path: 'livro/:username', element: <StubPage titleKey="pages.recipe_book" /> },
    ],
  },
])
