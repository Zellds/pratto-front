import './RecipeHero.css'

type RecipeHeroProps = {
  title: string
  coverUrl: string | null
}

export function RecipeHero({ title, coverUrl }: RecipeHeroProps) {
  return (
    <header className="recipe-hero">
      {coverUrl ? (
        <img className="recipe-hero-image" src={coverUrl} alt="" />
      ) : (
        <div className="recipe-hero-placeholder" aria-hidden="true" />
      )}
      <div className="recipe-hero-scrim" aria-hidden="true" />
      <h1 className="recipe-hero-title">{title}</h1>
    </header>
  )
}
