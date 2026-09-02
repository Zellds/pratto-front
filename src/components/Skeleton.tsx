import './Skeleton.css'

type SkeletonProps = {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={`skeleton${className ? ` ${className}` : ''}`} aria-hidden="true" />
}
