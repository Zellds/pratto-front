import { useState, useEffect, useId } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { searchIngredients } from '@/features/ingredients/api'
import type { MeasurementUnit } from '../../../types'
import './IngredientRow.css'

const UNITS: MeasurementUnit[] = [
  'g',
  'kg',
  'ml',
  'l',
  'unidade',
  'xicara',
  'colher_sopa',
  'colher_cha',
  'pitada',
  'a_gosto',
]

const UNIT_KEY: Record<MeasurementUnit, string> = {
  g: 'recipes.unit_g',
  kg: 'recipes.unit_kg',
  ml: 'recipes.unit_ml',
  l: 'recipes.unit_l',
  unidade: 'recipes.unit_unidade',
  xicara: 'recipes.unit_xicara',
  colher_sopa: 'recipes.unit_colher_sopa',
  colher_cha: 'recipes.unit_colher_cha',
  pitada: 'recipes.unit_pitada',
  a_gosto: 'recipes.unit_a_gosto',
}

export type IngredientRowValue = {
  name: string
  quantity: string
  unit: MeasurementUnit
}

type IngredientRowProps = IngredientRowValue & {
  onChange: (next: IngredientRowValue) => void
  onRemove: () => void
}

export function IngredientRow({ name, quantity, unit, onChange, onRemove }: IngredientRowProps) {
  const { t } = useTranslation()
  const datalistId = useId()
  const [searchTerm, setSearchTerm] = useState(name)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(name)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300)
    return () => clearTimeout(timeout)
  }, [searchTerm])

  const suggestionsQuery = useQuery({
    queryKey: ['ingredients', debouncedSearchTerm],
    queryFn: () => searchIngredients(debouncedSearchTerm),
    enabled: debouncedSearchTerm.trim().length > 0,
  })

  return (
    <div className="ingredient-row">
      <label htmlFor={`${datalistId}-name`}>{t('recipes.ingredient_name_label')}</label>
      <input
        id={`${datalistId}-name`}
        list={datalistId}
        value={name}
        onChange={(event) => {
          setSearchTerm(event.target.value)
          onChange({ name: event.target.value, quantity, unit })
        }}
      />
      <datalist id={datalistId}>
        {suggestionsQuery.data?.map((ingredient) => (
          <option key={ingredient.id} value={ingredient.name} />
        ))}
      </datalist>

      <label htmlFor={`${datalistId}-quantity`}>{t('recipes.quantity_label')}</label>
      <input
        id={`${datalistId}-quantity`}
        type="number"
        min={0.01}
        step={0.01}
        value={quantity}
        onChange={(event) => onChange({ name, quantity: event.target.value, unit })}
      />

      <label htmlFor={`${datalistId}-unit`}>{t('recipes.unit_label')}</label>
      <select
        id={`${datalistId}-unit`}
        value={unit}
        onChange={(event) =>
          onChange({ name, quantity, unit: event.target.value as MeasurementUnit })
        }
      >
        {UNITS.map((unitOption) => (
          <option key={unitOption} value={unitOption}>
            {t(UNIT_KEY[unitOption])}
          </option>
        ))}
      </select>

      <button type="button" onClick={onRemove} aria-label={t('recipes.remove_ingredient_action')}>
        ×
      </button>
    </div>
  )
}
