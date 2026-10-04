import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import i18n from '../config/i18n'

await i18n.changeLanguage('pt-BR')

window.scrollTo = vi.fn()

afterEach(() => {
  cleanup()
  void i18n.changeLanguage('pt-BR')
})
