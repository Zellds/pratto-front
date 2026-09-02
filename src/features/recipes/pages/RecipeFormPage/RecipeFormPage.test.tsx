import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router'
import { AuthProvider, useAuth } from '@/providers/AuthProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import { AuthModal } from '@/features/auth/components/AuthModal'
import { RecipeFormPage } from './RecipeFormPage'

function renderPage(initialPath = '/nova-receita') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  localStorage.setItem('pratto-token', 'tok123')
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/nova-receita" element={<RecipeFormPage />} />
            <Route path="/receitas/:id/editar" element={<RecipeFormPage />} />
            <Route path="/receitas/:id" element={<div>detail page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('RecipeFormPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('starts in create mode with one empty ingredient and one empty step row', () => {
    vi.stubGlobal('fetch', vi.fn())

    renderPage()

    expect(screen.getByLabelText('Título')).toHaveValue('')
    expect(screen.getAllByLabelText('Ingrediente')).toHaveLength(1)
    expect(screen.getAllByLabelText('Instrução')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Publicar' })).toBeInTheDocument()
  })

  it('adds and removes ingredient and step rows', () => {
    vi.stubGlobal('fetch', vi.fn())
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar ingrediente' }))
    expect(screen.getAllByLabelText('Ingrediente')).toHaveLength(2)

    fireEvent.click(screen.getAllByRole('button', { name: 'Remover ingrediente' })[0])
    expect(screen.getAllByLabelText('Ingrediente')).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar passo' }))
    expect(screen.getAllByLabelText('Instrução')).toHaveLength(2)
  })

  it('shows a validation error and does not submit when there are no ingredients', () => {
    vi.stubGlobal('fetch', vi.fn())
    renderPage()

    fireEvent.click(screen.getAllByRole('button', { name: 'Remover ingrediente' })[0])
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Bolo' } })
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Um bolo qualquer' } })
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(screen.getByText('Adicione pelo menos 1 ingrediente.')).toBeInTheDocument()
  })

  it('creates, publishes with the real ingredients/steps typed, and navigates to the detail page', async () => {
    const mockFetch = vi.fn((url: string, init) => {
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
    vi.stubGlobal('fetch', mockFetch)

    renderPage()

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Bolo' } })
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Um bolo qualquer' } })
    fireEvent.change(screen.getByLabelText('Porções'), { target: { value: '4' } })
    fireEvent.change(screen.getByLabelText('Tempo de preparo (minutos)'), {
      target: { value: '30' },
    })
    fireEvent.change(screen.getByLabelText('Ingrediente'), { target: { value: 'Cenoura' } })
    fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Instrução'), { target: { value: 'Bata tudo.' } })

    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    await waitFor(() => expect(screen.getByText('detail page')).toBeInTheDocument())
    expect(mockFetch).toHaveBeenCalledTimes(2)
    const createCall = mockFetch.mock.calls.find(([url]) => url.endsWith('/recipes'))!
    const body = JSON.parse(createCall[1].body)
    expect(body.ingredients).toEqual([
      { ingredient_name: 'Cenoura', quantity: 3, unit: 'unidade', position: 0 },
    ])
    expect(body.steps).toEqual([{ position: 0, instruction: 'Bata tudo.' }])
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
    expect(screen.getByDisplayValue('Um passo salvo.')).toBeInTheDocument()
  })

  it('shows a loading state before the edited recipe loads, without rendering the form fields', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))

    renderPage('/receitas/r1/editar')

    expect(screen.queryByLabelText('Título')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Publicar' })).not.toBeInTheDocument()
  })

  it('shows an error state when the edited recipe fails to load, without rendering the form fields', async () => {
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
    expect(screen.queryByRole('button', { name: 'Publicar' })).not.toBeInTheDocument()
  })

  it('saves an edit without retyping any ingredient, sending ingredient_id for the untouched row', async () => {
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

    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    await waitFor(() => expect(screen.getByText('detail page')).toBeInTheDocument())
    const patchCall = mockFetch.mock.calls.find(
      ([, init]) => (init as { method?: string } | undefined)?.method === 'PATCH',
    )!
    const body = JSON.parse((patchCall[1] as { body: string }).body)
    expect(body.ingredients).toEqual([
      { ingredient_id: 'i1', quantity: 2, unit: 'unidade', position: 0 },
    ])
  })

  it('saves an edit that retypes one ingredient name, sending ingredient_name only for that row', async () => {
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
                { ingredientId: 'i1', quantity: 2, unit: 'unidade', position: 0 },
                { ingredientId: 'i2', quantity: 1, unit: 'xicara', position: 1 },
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
    const nameInputs = screen.getAllByLabelText('Ingrediente')
    fireEvent.change(nameInputs[0], { target: { value: 'Cenoura ralada' } })

    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    await waitFor(() => expect(screen.getByText('detail page')).toBeInTheDocument())
    const patchCall = mockFetch.mock.calls.find(
      ([, init]) => (init as { method?: string } | undefined)?.method === 'PATCH',
    )!
    const body = JSON.parse((patchCall[1] as { body: string }).body)
    expect(body.ingredients).toEqual([
      { ingredient_name: 'Cenoura ralada', quantity: 2, unit: 'unidade', position: 0 },
      { ingredient_id: 'i2', quantity: 1, unit: 'xicara', position: 1 },
    ])
  })

  it('shows a validation error and does not submit when an ingredient row is missing its quantity', () => {
    vi.stubGlobal('fetch', vi.fn())
    renderPage()

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Bolo' } })
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Um bolo qualquer' } })
    fireEvent.change(screen.getByLabelText('Ingrediente'), { target: { value: 'Cenoura' } })
    fireEvent.change(screen.getByLabelText('Instrução'), { target: { value: 'Bata tudo.' } })

    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(
      screen.getByText('Preencha o nome e a quantidade de todos os ingredientes.'),
    ).toBeInTheDocument()
  })

  it('shows a validation error and does not submit when an ingredient row is missing its name', () => {
    vi.stubGlobal('fetch', vi.fn())
    renderPage()

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Bolo' } })
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Um bolo qualquer' } })
    fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Instrução'), { target: { value: 'Bata tudo.' } })

    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(
      screen.getByText('Preencha o nome e a quantidade de todos os ingredientes.'),
    ).toBeInTheDocument()
  })

  it('shows a validation error and does not submit when a step row is left blank', () => {
    vi.stubGlobal('fetch', vi.fn())
    renderPage()

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Bolo' } })
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Um bolo qualquer' } })
    fireEvent.change(screen.getByLabelText('Ingrediente'), { target: { value: 'Cenoura' } })
    fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: '3' } })

    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(screen.getByText('Preencha a instrução de todos os passos.')).toBeInTheDocument()
  })

  it('opens the login modal on submit when logged out, and resumes publishing with the fresh login token once logged in', async () => {
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
          <RecipeFormPage />
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

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Bolo' } })
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Um bolo qualquer' } })
    fireEvent.change(screen.getByLabelText('Ingrediente'), { target: { value: 'Cenoura' } })
    fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Instrução'), { target: { value: 'Bata tudo.' } })

    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    // Logged out: submit must not fire any request — the login modal opens instead.
    expect(mockFetch).not.toHaveBeenCalled()

    fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: 'gabriel' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => expect(screen.getByText('detail page')).toBeInTheDocument())

    const createCall = mockFetch.mock.calls.find(([url]) => (url as string).endsWith('/recipes'))!
    const [, init] = createCall
    expect(init!.headers!.Authorization).toBe('Bearer fresh-login-token')
  })
})
