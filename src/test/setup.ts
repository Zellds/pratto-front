import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import i18n from '../app/i18n'

await i18n.changeLanguage('pt-BR')

afterEach(() => {
  cleanup()
})
