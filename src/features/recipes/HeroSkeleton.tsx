import { Skeleton } from '../../shared/ui/Skeleton'
import './HeroSkeleton.css'

export function HeroSkeleton() {
  return (
    <div className="hero sec" aria-hidden="true">
      <Skeleton className="hero-skeleton-photo" />
      <div className="hero-body">
        <Skeleton className="hero-skeleton-tag" />
        <Skeleton className="hero-skeleton-title" />
        <Skeleton className="hero-skeleton-line" />
        <Skeleton className="hero-skeleton-line hero-skeleton-line-short" />
      </div>
    </div>
  )
}
