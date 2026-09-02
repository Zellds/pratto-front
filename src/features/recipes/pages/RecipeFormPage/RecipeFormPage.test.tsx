import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router'
import { AuthProvider } from '@/providers/AuthProvider'
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
})
