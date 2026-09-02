import { Skeleton } from '@/components/Skeleton'
import './RecipeCardSkeleton.css'

export function RecipeCardSkeleton() {
  return (
    <div className="card recipe-card-skeleton" aria-hidden="true">
      <Skeleton className="recipe-card-skeleton-photo" />
      <div className="card-body">
        <Skeleton className="recipe-card-skeleton-title" />
        <Skeleton className="recipe-card-skeleton-line" />
      </div>
    </div>
  )
}
