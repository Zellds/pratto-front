import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import i18n from '@/config/i18n'
import { RatingStars } from './RatingStars'

describe('RatingStars', () => {
  it('exposes the rating as an accessible image label', () => {
    render(<RatingStars value={4.5} />)

    expect(screen.getByRole('img', { name: 'Nota 4,5 de 5' })).toBeInTheDocument()
  })

  it('renders the lowest and highest values without error', () => {
    render(
      <>
        <RatingStars value={0} />
        <RatingStars value={5} />
      </>,
    )

    expect(screen.getByRole('img', { name: 'Nota 0 de 5' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Nota 5 de 5' })).toBeInTheDocument()
  })

  it('uses a decimal point in English', async () => {
    await i18n.changeLanguage('en')
    render(<RatingStars value={4.5} />)

    expect(screen.getByRole('img', { name: 'Rated 4.5 out of 5' })).toBeInTheDocument()
  })
})
