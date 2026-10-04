import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router'
import { AuthProvider, useAuth } from '@/providers/AuthProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import { AuthModal } from '@/features/auth/components/AuthModal'
import { RecipeWizardPage } from './RecipeWizardPage'

function renderPage(initialPath = '/nova-receita') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  localStorage.setItem('pratto-token', 'tok123')
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/nova-receita" element={<RecipeWizardPage />} />
            <Route path="/receitas/:id/editar" element={<RecipeWizardPage />} />
            <Route path="/receitas/:id" element={<div>detail page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

function goNext() {
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
}

function fillBasics() {
  fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Bolo' } })
  fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Um bolo qualquer' } })
}

function fillIngredient(name = 'Cenoura', quantity = '3') {
  fireEvent.change(screen.getByLabelText('Ingrediente'), { target: { value: name } })
  fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: quantity } })
}

function fillStep(instruction = 'Bata tudo.') {
  fireEvent.change(screen.getByLabelText('Instrução'), { target: { value: instruction } })
}

function createAndPublishFetch() {
  return vi.fn((url: string, init?: { method?: string; body?: string }) => {
    if (init?.method === 'POST' && url.endsWith('/recipes')) {
      return Promise.resolve({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ id: 'r1', title: 'Bolo', status: 'draft' }),
      })
    }
    if (init?.method === 'POST' && url.includes('/recipes/r1/publish')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 'r1', title: 'Bolo', status: 'pending_review' }),
      })
    }
    return Promise.reject(new Error(`unexpected request: ${url}`))
  })
}

describe('RecipeWizardPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('starts on the basics step, with the other steps not yet shown', () => {
    vi.stubGlobal('fetch', vi.fn())

    renderPage()

    expect(screen.getByLabelText('Título')).toHaveValue('')
    expect(screen.getByRole('button', { name: /Básico/ })).toHaveAttribute('aria-current', 'step')
    expect(screen.queryByLabelText('Ingrediente')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Instrução')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Voltar' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Publicar' })).not.toBeInTheDocument()
  })

  it('does not advance from the basics step while required fields are empty', () => {
    vi.stubGlobal('fetch', vi.fn())
    renderPage()

    goNext()

    expect(screen.getByText('Título é obrigatório.')).toBeInTheDocument()
    expect(screen.getByLabelText('Título')).toBeInTheDocument()
  })

  it('advances to ingredients and keeps what was typed when going back', () => {
    vi.stubGlobal('fetch', vi.fn())
    renderPage()

    fillBasics()
    goNext()

    expect(screen.getByRole('button', { name: /Ingredientes/ })).toHaveAttribute(
      'aria-current',
      'step',
    )
    expect(screen.getAllByLabelText('Ingrediente')).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }))

    expect(screen.getByLabelText('Título')).toHaveValue('Bolo')
    expect(screen.getByLabelText('Descrição')).toHaveValue('Um bolo qualquer')
  })

  it('adds and removes ingredient rows', () => {
    vi.stubGlobal('fetch', vi.fn())
    renderPage()
    fillBasics()
    goNext()

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar ingrediente' }))
    expect(screen.getAllByLabelText('Ingrediente')).toHaveLength(2)

    fireEvent.click(screen.getAllByRole('button', { name: 'Remover ingrediente' })[0])
    expect(screen.getAllByLabelText('Ingrediente')).toHaveLength(1)
  })

  it('blocks leaving the ingredients step with an incomplete ingredient', () => {
    vi.stubGlobal('fetch', vi.fn())
    renderPage()
    fillBasics()
    goNext()

    fireEvent.change(screen.getByLabelText('Ingrediente'), { target: { value: 'Cenoura' } })
    goNext()

    expect(
      screen.getByText('Preencha o nome e a quantidade de todos os ingredientes.'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Ingrediente')).toBeInTheDocument()
  })

  it('blocks leaving the ingredients step with no ingredients at all', () => {
    vi.stubGlobal('fetch', vi.fn())
    renderPage()
    fillBasics()
    goNext()

    fireEvent.click(screen.getByRole('button', { name: 'Remover ingrediente' }))
    goNext()

    expect(screen.getByText('Adicione pelo menos 1 ingrediente.')).toBeInTheDocument()
  })

  it('swaps "Continuar" for a brand-new "Publicar" button on the last step, so the advancing click cannot submit the form', () => {
    vi.stubGlobal('fetch', vi.fn())
    renderPage()

    fillBasics()
    goNext()
    fillIngredient()
    const nextButton = screen.getByRole('button', { name: 'Continuar' })
    fireEvent.click(nextButton)

    // If React reused the same <button> (flipping type="button" to "submit"), the browser
    // would still be dispatching the advancing click and would submit the form right away.
    expect(screen.getByRole('button', { name: 'Publicar' })).not.toBe(nextButton)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('lets the cook jump to another step by clicking its tab', () => {
    vi.stubGlobal('fetch', vi.fn())
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /Preparo/ }))

    expect(screen.getByLabelText('Instrução')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Publicar' })).toBeInTheDocument()
  })

  it('shows a live summary of the recipe being written', () => {
    vi.stubGlobal('fetch', vi.fn())
    renderPage()

    fillBasics()
    goNext()
    fillIngredient()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Opcional' }))

    const summary = screen.getByRole('complementary', { name: 'Resumo' })
    expect(summary).toHaveTextContent('Bolo')
    expect(summary).toHaveTextContent(/1 ingrediente(?!s)/)
    expect(summary).toHaveTextContent('1 opcional')
    expect(summary).toHaveTextContent('0 passos')
  })

  it('creates, publishes with the typed ingredients and steps, and navigates to the detail page', async () => {
    const mockFetch = createAndPublishFetch()
    vi.stubGlobal('fetch', mockFetch)
    renderPage()

    fillBasics()
    fireEvent.change(screen.getByLabelText('Porções'), { target: { value: '4' } })
    fireEvent.change(screen.getByLabelText('Tempo de preparo (minutos)'), {
      target: { value: '30' },
    })
    goNext()
    fillIngredient()
    goNext()
    fillStep()
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    await waitFor(() => expect(screen.getByText('detail page')).toBeInTheDocument())
    expect(mockFetch).toHaveBeenCalledTimes(2)
    const createCall = mockFetch.mock.calls.find(([url]) => url.endsWith('/recipes'))!
    const body = JSON.parse(createCall[1]!.body!)
    expect(body).toMatchObject({
      title: 'Bolo',
      description: 'Um bolo qualquer',
      portions: 4,
      prep_time_minutes: 30,
    })
    expect(body.ingredients).toEqual([
      { ingredient_name: 'Cenoura', quantity: 3, unit: 'unidade', position: 0, is_optional: false },
    ])
    expect(body.steps).toEqual([{ position: 0, instruction: 'Bata tudo.' }])
  })

  it('sends is_optional when an ingredient is marked optional', async () => {
    const mockFetch = createAndPublishFetch()
    vi.stubGlobal('fetch', mockFetch)
    renderPage()

    fillBasics()
    goNext()
    fillIngredient('Leite', '1')
    fireEvent.click(screen.getByRole('checkbox', { name: 'Opcional' }))
    goNext()
    fillStep()
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    const createCall = mockFetch.mock.calls.find(([url]) => url.endsWith('/recipes'))!
    expect(JSON.parse(createCall[1]!.body!).ingredients[0].is_optional).toBe(true)
  })

  it('does not publish while a step is left blank', () => {
    const mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
    renderPage()

    fillBasics()
    goNext()
    fillIngredient()
    goNext()
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(screen.getByText('Preencha a instrução de todos os passos.')).toBeInTheDocument()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('sends the cook back to the first incomplete step when publishing', () => {
    const mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /Preparo/ }))
    fillStep()
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(screen.getByText('Título é obrigatório.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Básico/ })).toHaveAttribute('aria-current', 'step')
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('loads the existing recipe when editing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            id: 'r1',
            title: 'Bolo existente',
            description: 'Já cadastrado',
            portions: 6,
            prepTimeMinutes: 45,
            ingredients: [{ ingredientId: 'i1', quantity: 2, unit: 'unidade', position: 0 }],
            steps: [{ position: 0, instruction: 'Um passo salvo.' }],
          }),
      }),
    )

    renderPage('/receitas/r1/editar')

    expect(await screen.findByDisplayValue('Bolo existente')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Preparo/ }))
    expect(screen.getByDisplayValue('Um passo salvo.')).toBeInTheDocument()
  })

  it('shows a loading state before the edited recipe loads', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))

    renderPage('/receitas/r1/editar')

    expect(screen.queryByLabelText('Título')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Continuar' })).not.toBeInTheDocument()
  })

  it('shows an error state when the edited recipe fails to load', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Server error' }),
      }),
    )

    renderPage('/receitas/r1/editar')

    expect(
      await screen.findByText('Não foi possível carregar a receita para edição.'),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('Título')).not.toBeInTheDocument()
  })

  it('saves an edit without retyping ingredients, sending ingredient_id for the untouched row', async () => {
    const mockFetch = vi.fn((url: string, init?: { method?: string; body?: string }) => {
      if ((init?.method === undefined || init?.method === 'GET') && url.endsWith('/recipes/r1')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              id: 'r1',
              title: 'Bolo existente',
              description: 'Já cadastrado',
              portions: 6,
              prepTimeMinutes: 45,
              ingredients: [{ ingredientId: 'i1', quantity: 2, unit: 'unidade', position: 0 }],
              steps: [{ position: 0, instruction: 'Um passo salvo.' }],
            }),
        })
      }
      if (init?.method === 'PATCH' && url.endsWith('/recipes/r1')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ id: 'r1', title: 'Bolo editado', status: 'draft' }),
        })
      }
      if (init?.method === 'POST' && url.includes('/recipes/r1/publish')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({ id: 'r1', title: 'Bolo editado', status: 'pending_review' }),
        })
      }
      return Promise.reject(new Error(`unexpected request: ${url}`))
    })
    vi.stubGlobal('fetch', mockFetch)

    renderPage('/receitas/r1/editar')

    await screen.findByDisplayValue('Bolo existente')
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Bolo editado' } })
    fireEvent.click(screen.getByRole('button', { name: /Preparo/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    await waitFor(() => expect(screen.getByText('detail page')).toBeInTheDocument())
    const patchCall = mockFetch.mock.calls.find(
      ([, init]) => (init as { method?: string } | undefined)?.method === 'PATCH',
    )!
    const body = JSON.parse((patchCall[1] as { body: string }).body)
    expect(body.title).toBe('Bolo editado')
    expect(body.ingredients).toEqual([
      { ingredient_id: 'i1', quantity: 2, unit: 'unidade', position: 0 },
    ])
  })

  it('shows the saved ingredient name when editing, without sending it in the payload', async () => {
    const mockFetch = vi.fn((url: string, init?: { method?: string; body?: string }) => {
      if ((init?.method === undefined || init?.method === 'GET') && url.endsWith('/recipes/r1')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              id: 'r1',
              title: 'Bolo existente',
              description: 'Já cadastrado',
              portions: 6,
              prepTimeMinutes: 45,
              ingredients: [
                {
                  ingredientId: 'i1',
                  ingredientName: 'Cenoura',
                  quantity: 2,
                  unit: 'unidade',
                  position: 0,
                  isOptional: false,
                },
              ],
              steps: [{ position: 0, instruction: 'Um passo salvo.' }],
            }),
        })
      }
      if (init?.method === 'PATCH' && url.endsWith('/recipes/r1')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ id: 'r1', title: 'Bolo existente', status: 'draft' }),
        })
      }
      if (init?.method === 'POST' && url.includes('/recipes/r1/publish')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({ id: 'r1', title: 'Bolo existente', status: 'pending_review' }),
        })
      }
      return Promise.reject(new Error(`unexpected request: ${url}`))
    })
    vi.stubGlobal('fetch', mockFetch)

    renderPage('/receitas/r1/editar')

    await screen.findByDisplayValue('Bolo existente')
    fireEvent.click(screen.getByRole('button', { name: /Ingredientes/ }))
    expect(screen.getByDisplayValue('Cenoura')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Preparo/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    await waitFor(() => expect(screen.getByText('detail page')).toBeInTheDocument())
    const patchCall = mockFetch.mock.calls.find(
      ([, init]) => (init as { method?: string } | undefined)?.method === 'PATCH',
    )!
    const body = JSON.parse((patchCall[1] as { body: string }).body)
    expect(body.ingredients).toEqual([
      { ingredient_id: 'i1', quantity: 2, unit: 'unidade', position: 0, is_optional: false },
    ])
  })

  it('opens the login modal on publish when logged out, and resumes publishing with the fresh token', async () => {
    const mockFetch = vi.fn(
      (url: string, init?: { method?: string; headers?: Record<string, string> }) => {
        if (url.includes('/login')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ token: 'fresh-login-token' }),
          })
        }
        if (init?.method === 'POST' && url.endsWith('/recipes')) {
          return Promise.resolve({
            ok: true,
            status: 201,
            json: () => Promise.resolve({ id: 'r1', title: 'Bolo', status: 'draft' }),
          })
        }
        if (init?.method === 'POST' && url.includes('/recipes/r1/publish')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ id: 'r1', title: 'Bolo', status: 'pending_review' }),
          })
        }
        return Promise.reject(new Error(`unexpected request: ${url}`))
      },
    )
    vi.stubGlobal('fetch', mockFetch)

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

    function Wrapper() {
      const { isAuthModalOpen, closeAuthModal } = useAuth()
      return (
        <>
          <RecipeWizardPage />
          <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
        </>
      )
    }

    render(
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <MemoryRouter initialEntries={['/nova-receita']}>
              <Routes>
                <Route path="/nova-receita" element={<Wrapper />} />
                <Route path="/receitas/:id" element={<div>detail page</div>} />
              </Routes>
            </MemoryRouter>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>,
    )

    fillBasics()
    goNext()
    fillIngredient()
    goNext()
    fillStep()
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(mockFetch).not.toHaveBeenCalled()

    fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: 'gabriel' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => expect(screen.getByText('detail page')).toBeInTheDocument())

    const createCall = mockFetch.mock.calls.find(([url]) => (url as string).endsWith('/recipes'))!
    expect(createCall[1]!.headers!.Authorization).toBe('Bearer fresh-login-token')
  })
})
