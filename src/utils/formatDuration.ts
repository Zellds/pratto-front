import type { TFunction } from 'i18next'

export function formatDuration(totalMinutes: number, t: TFunction): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) return t('recipes.duration_minutes', { minutes: totalMinutes })
  if (minutes === 0) return t('recipes.duration_hours', { hours })
  return t('recipes.duration_hours_minutes', {
    hours,
    minutes: String(minutes).padStart(2, '0'),
  })
}
