import { createBrowserRouter } from 'react-router'
import { Layout } from '../layouts/Layout'
import { StubPage } from '../components/StubPage'
import { DashboardPage } from '../features/recipes/pages/DashboardPage/DashboardPage'
import { RecipeListPage } from '../features/recipes/pages/RecipeListPage/RecipeListPage'
import { RecipeDetailPage } from '../features/recipes/pages/RecipeDetailPage/RecipeDetailPage'
import { RecipeFormPage } from '../features/recipes/pages/RecipeFormPage/RecipeFormPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'receitas', element: <RecipeListPage /> },
      { path: 'receitas/:id', element: <RecipeDetailPage /> },
      { path: 'receitas/:id/editar', element: <RecipeFormPage /> },
      { path: 'nova-receita', element: <RecipeFormPage /> },
      { path: 'categorias', element: <StubPage titleKey="pages.categories" /> },
      { path: 'salvos', element: <StubPage titleKey="pages.saved" /> },
      { path: 'minhas-receitas', element: <StubPage titleKey="pages.my_recipes" /> },
      { path: 'lista-de-compras', element: <StubPage titleKey="pages.shopping_list" /> },
      { path: 'despensa', element: <StubPage titleKey="pages.pantry" /> },
      { path: 'cardapio', element: <StubPage titleKey="pages.weekly_menu" /> },
      { path: 'chat', element: <StubPage titleKey="pages.chat" /> },
      { path: 'chefs', element: <StubPage titleKey="pages.chefs" /> },
      { path: 'ranking', element: <StubPage titleKey="pages.ranking" /> },
      { path: 'perfil/:username', element: <StubPage titleKey="pages.profile" /> },
      { path: 'configuracoes', element: <StubPage titleKey="pages.settings" /> },
      { path: 'livro/:username', element: <StubPage titleKey="pages.recipe_book" /> },
    ],
  },
])
