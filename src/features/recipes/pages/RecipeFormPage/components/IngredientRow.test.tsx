import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { IngredientRow } from './IngredientRow'

function renderRow(onChange = vi.fn(), onRemove = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return {
    onChange,
    onRemove,
    ...render(
      <QueryClientProvider client={queryClient}>
        <IngredientRow name="" quantity="" unit="unidade" onChange={onChange} onRemove={onRemove} />
      </QueryClientProvider>,
    ),
  }
}

describe('IngredientRow', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls onChange when typing the ingredient name', () => {
    const { onChange } = renderRow()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    fireEvent.change(screen.getByLabelText('Ingrediente'), { target: { value: 'Cenoura' } })

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ name: 'Cenoura' }))
  })

  it('searches ingredients after the name is typed', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ id: 'i1', name: 'Cenoura', status: 'approved' }]),
    })
    vi.stubGlobal('fetch', mockFetch)
    renderRow()

    fireEvent.change(screen.getByLabelText('Ingrediente'), { target: { value: 'Cen' } })

    await waitFor(() => expect(mockFetch).toHaveBeenCalled(), { timeout: 1000 })
    expect(mockFetch.mock.calls[0][0]).toContain('/ingredients?q=Cen')
  })

  it('calls onRemove when the remove button is clicked', () => {
    const { onRemove } = renderRow()

    fireEvent.click(screen.getByRole('button', { name: 'Remover ingrediente' }))

    expect(onRemove).toHaveBeenCalled()
  })

  it('resyncs the autocomplete search when the name prop changes from outside', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    })
    vi.stubGlobal('fetch', mockFetch)
    const onChange = vi.fn()
    const onRemove = vi.fn()
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <IngredientRow
          name="Batata"
          quantity=""
          unit="unidade"
          onChange={onChange}
          onRemove={onRemove}
        />
      </QueryClientProvider>,
    )

    // Simulate React reusing this instance for a different array row (e.g. after
    // removing a row above it in an index-keyed list) — the `name` prop changes
    // from outside, without the user typing anything in this instance.
    rerender(
      <QueryClientProvider client={queryClient}>
        <IngredientRow
          name="Arroz"
          quantity=""
          unit="unidade"
          onChange={onChange}
          onRemove={onRemove}
        />
      </QueryClientProvider>,
    )

    await waitFor(
      () =>
        expect(mockFetch.mock.calls.some((call) => String(call[0]).includes('q=Arroz'))).toBe(true),
      { timeout: 1000 },
    )
  })
})
