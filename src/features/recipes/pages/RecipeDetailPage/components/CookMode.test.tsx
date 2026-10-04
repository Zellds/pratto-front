import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import type { ReactElement } from 'react'
import { AuthProvider } from '@/providers/AuthProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import type { Recipe } from '../../../types'
import { CookMode } from './CookMode'

const RECIPE: Recipe = {
  id: '1',
  ownerId: 'o1',
  ownerUsername: 'gabriel',
  ownerDisplayName: 'Gabriel Medeiros',
  title: 'Bolo de cenoura',
  description: 'Bolo simples e rápido',
  portions: 8,
  prepTimeMinutes: 105,
  status: 'published',
  coverMediaId: null,
  coverThumbnailUrl: null,
  coverDisplayUrl: null,
  rejectionReason: null,
  averageRating: 4.5,
  ratingsCount: 12,
  ingredients: [
    {
      ingredientId: 'i1',
      ingredientName: 'Cenoura',
      quantity: 3,
      unit: 'unidade',
      position: 0,
      isOptional: false,
    },
    {
      ingredientId: 'i2',
      ingredientName: 'Óleo',
      quantity: 200,
      unit: 'ml',
      position: 1,
      isOptional: false,
    },
    {
      ingredientId: 'i3',
      ingredientName: 'Leite',
      quantity: 100,
      unit: 'ml',
      position: 2,
      isOptional: true,
    },
  ],
  steps: [
    { position: 1, instruction: 'Misture com o açúcar e a farinha.' },
    { position: 0, instruction: 'Bata tudo no liquidificador.' },
    { position: 2, instruction: 'Asse por 40 minutos.' },
  ],
}

function wrap(ui: ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <MemoryRouter>{ui}</MemoryRouter>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}

function renderCookMode(overrides: Partial<Parameters<typeof CookMode>[0]> = {}) {
  const props = {
    recipe: RECIPE,
    portions: 8,
    onPortionsChange: vi.fn(),
    onExit: vi.fn(),
    ...overrides,
  }
  const view = render(wrap(<CookMode {...props} />))
  return { ...view, props }
}

describe('CookMode', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('starts on the first step, with the previous button disabled', () => {
    renderCookMode()

    expect(screen.getByText('Passo 1 de 3')).toBeInTheDocument()
    expect(screen.getByText('Bata tudo no liquidificador.')).toBeInTheDocument()
    expect(screen.queryByText('Misture com o açúcar e a farinha.')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Passo anterior' })).toBeDisabled()
  })

  it('moves forward with "Próximo passo" and back with "Passo anterior"', async () => {
    const user = userEvent.setup()
    renderCookMode()

    await user.click(screen.getByRole('button', { name: 'Próximo passo' }))
    expect(screen.getByText('Passo 2 de 3')).toBeInTheDocument()
    expect(screen.getByText('Misture com o açúcar e a farinha.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Passo anterior' }))
    expect(screen.getByText('Passo 1 de 3')).toBeInTheDocument()
    expect(screen.getByText('Bata tudo no liquidificador.')).toBeInTheDocument()
  })

  it('jumps to a step from the progress segments and offers "Concluir" on the last step', async () => {
    const user = userEvent.setup()
    renderCookMode()

    await user.click(screen.getByRole('button', { name: 'Ir para o passo 3' }))

    expect(screen.getByText('Passo 3 de 3')).toBeInTheDocument()
    expect(screen.getByText('Asse por 40 minutos.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Concluir' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Próximo passo' })).not.toBeInTheDocument()
  })

  it('counts gathered ingredients as they are ticked and unticked', async () => {
    const user = userEvent.setup()
    renderCookMode()
    expect(screen.getByText('0 de 3 separados')).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: /^Cenoura/ }))
    expect(screen.getByText('1 de 3 separados')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /^Cenoura/ })).toBeChecked()

    await user.click(screen.getByRole('checkbox', { name: /^Cenoura/ }))
    expect(screen.getByText('0 de 3 separados')).toBeInTheDocument()
  })

  it('reports a portions change and rescales the checklist quantities', async () => {
    const user = userEvent.setup()
    const { props, rerender } = renderCookMode()
    expect(screen.getByText('3 unidade')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Aumentar porções' }))
    expect(props.onPortionsChange).toHaveBeenCalledWith(9)

    rerender(wrap(<CookMode {...props} portions={16} />))
    expect(screen.getByText('6 unidade')).toBeInTheDocument()
    expect(screen.getByText('400 ml')).toBeInTheDocument()
  })

  it('shows the finish panel after "Concluir" and lets the cook leave from either place', async () => {
    const user = userEvent.setup()
    const { props } = renderCookMode()

    await user.click(screen.getByRole('button', { name: 'Ir para o passo 3' }))
    await user.click(screen.getByRole('button', { name: 'Concluir' }))

    expect(screen.getByRole('heading', { name: 'Bom apetite!' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Avaliar com 5 estrelas' })).toBeInTheDocument()
    expect(screen.queryByText('Asse por 40 minutos.')).not.toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /^Cenoura/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Voltar à receita' }))
    await user.click(screen.getByRole('button', { name: 'Sair do modo cozinha' }))
    expect(props.onExit).toHaveBeenCalledTimes(2)
  })

  it('shows the optional chip only on the optional ingredient', () => {
    renderCookMode()

    const items = screen.getAllByRole('listitem')
    const withChip = items.filter((item) => within(item).queryByText('opcional'))

    expect(withChip).toHaveLength(1)
    expect(withChip[0]).toHaveTextContent('Leite')
  })

  it('moves focus to the finish heading when the cook finishes', async () => {
    const user = userEvent.setup()
    renderCookMode()

    await user.click(screen.getByRole('button', { name: 'Ir para o passo 3' }))
    await user.click(screen.getByRole('button', { name: 'Concluir' }))

    expect(screen.getByRole('heading', { name: 'Bom apetite!' })).toHaveFocus()
  })

  it('renders nothing when the recipe has no steps', () => {
    renderCookMode({ recipe: { ...RECIPE, steps: [] } })

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.queryByText(/^Passo \d/)).not.toBeInTheDocument()
  })
})
