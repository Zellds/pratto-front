import type { ReactElement } from 'react'
import {
  HomeIcon,
  ExploreIcon,
  CategoriesIcon,
  SavedIcon,
  MyRecipesIcon,
  PantryIcon,
  ShoppingListIcon,
  WeeklyMenuIcon,
  ChefsIcon,
  RankingIcon,
} from '../shared/ui/icons'

export type NavItem = {
  to: string
  labelKey: string
  Icon: (props: { size?: number }) => ReactElement
}

export const MAIN_ITEMS: NavItem[] = [
  { to: '/', labelKey: 'nav.home', Icon: HomeIcon },
  { to: '/receitas', labelKey: 'nav.explore', Icon: ExploreIcon },
  { to: '/categorias', labelKey: 'nav.categories', Icon: CategoriesIcon },
  { to: '/salvos', labelKey: 'nav.saved', Icon: SavedIcon },
]

export const KITCHEN_ITEMS: NavItem[] = [
  { to: '/minhas-receitas', labelKey: 'nav.my_recipes', Icon: MyRecipesIcon },
  { to: '/despensa', labelKey: 'nav.pantry', Icon: PantryIcon },
  { to: '/lista-de-compras', labelKey: 'nav.shopping_list', Icon: ShoppingListIcon },
  { to: '/cardapio', labelKey: 'nav.weekly_menu', Icon: WeeklyMenuIcon },
]

export const COMMUNITY_ITEMS: NavItem[] = [
  { to: '/chefs', labelKey: 'nav.chefs', Icon: ChefsIcon },
  { to: '/ranking', labelKey: 'nav.ranking', Icon: RankingIcon },
]

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
