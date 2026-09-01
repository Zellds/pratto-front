type IconProps = {
  size?: number
}

const commonProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function HomeIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  )
}

export function ExploreIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </svg>
  )
}

export function CategoriesIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
    </svg>
  )
}

export function SavedIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
      <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4.2L5 20V5a1 1 0 0 1 1-1z" />
    </svg>
  )
}

export function MyRecipesIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
      <path d="M6.5 13.5A3.5 3.5 0 0 1 6 6.6a3.4 3.4 0 0 1 6-1.7 3.4 3.4 0 0 1 6 1.7 3.5 3.5 0 0 1-.5 6.9" />
      <path d="M6.5 13.5h11V18h-11z" />
      <path d="M6.5 20.5h11" />
    </svg>
  )
}

export function PantryIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
      <rect x="5" y="2.5" width="14" height="19" rx="2.2" />
      <line x1="5" y1="10" x2="19" y2="10" />
      <line x1="8.2" y1="6" x2="8.2" y2="8" />
      <line x1="8.2" y1="13" x2="8.2" y2="16" />
    </svg>
  )
}

export function ShoppingListIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
      <path d="M3 7h18l-1.7 11.2a2 2 0 0 1-2 1.8H6.7a2 2 0 0 1-2-1.8z" />
      <path d="M8.5 7V5.5a3.5 3.5 0 0 1 7 0V7" />
      <path d="m9.7 13 1.8 1.8 3.3-3.3" />
    </svg>
  )
}

export function WeeklyMenuIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="3" x2="8" y2="6.5" />
      <line x1="16" y1="3" x2="16" y2="6.5" />
      <line x1="9" y1="14" x2="15" y2="14" />
      <line x1="9" y1="17.5" x2="13" y2="17.5" />
    </svg>
  )
}

export function ChefsIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.8 19.5a6.2 6.2 0 0 1 12.4 0" />
      <path d="M16.5 5.2a3.2 3.2 0 0 1 0 5.9" />
      <path d="M18 14.2a6.2 6.2 0 0 1 3.2 5.3" />
    </svg>
  )
}

export function RankingIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
      <path d="M7 4h10v6a5 5 0 0 1-10 0z" />
      <path d="M7 5.5H4.5V8a3 3 0 0 0 3 3" />
      <path d="M17 5.5h2.5V8a3 3 0 0 1-3 3" />
      <path d="M12 15v3" />
      <path d="M8.5 20.5h7" />
      <path d="M9.5 18h5v2.5h-5z" />
    </svg>
  )
}

export function CollapseIcon({ size = 15 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...commonProps}
      strokeWidth={2.2}
      aria-hidden="true"
    >
      <path d="m14.5 5-7 7 7 7" />
    </svg>
  )
}

export function SearchIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export function NotificationIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
      <path d="M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5z" />
      <path d="M10.3 19a2 2 0 0 0 3.4 0" />
    </svg>
  )
}

export function PlusIcon({ size = 17 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...commonProps}
      strokeWidth={2}
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function ThemeIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5a8.5 8.5 0 0 0 0 17z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FlagBrazilIcon({ size = 18 }: IconProps) {
  const height = Math.round((size * 14) / 20)
  return (
    <svg width={size} height={height} viewBox="0 0 20 14" aria-hidden="true">
      <rect width="20" height="14" rx="2" fill="#2e7d32" />
      <polygon points="10,2 18,7 10,12 2,7" fill="#fdd835" />
      <circle cx="10" cy="7" r="3" fill="#1565c0" />
    </svg>
  )
}

export function FlagUnitedStatesIcon({ size = 18 }: IconProps) {
  const height = Math.round((size * 14) / 20)
  return (
    <svg width={size} height={height} viewBox="0 0 20 14" aria-hidden="true">
      <rect width="20" height="14" rx="2" fill="#b22234" />
      <rect y="2" width="20" height="1.4" fill="#ffffff" />
      <rect y="4.8" width="20" height="1.4" fill="#ffffff" />
      <rect y="7.6" width="20" height="1.4" fill="#ffffff" />
      <rect y="10.4" width="20" height="1.4" fill="#ffffff" />
      <rect width="9" height="7.5" rx="1" fill="#3c3b6e" />
    </svg>
  )
}
