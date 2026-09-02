import type { RecipeStep } from '../../../types'
import './StepList.css'

type StepListProps = {
  steps: RecipeStep[]
}

export function StepList({ steps }: StepListProps) {
  const sorted = [...steps].sort((a, b) => a.position - b.position)

  return (
    <div className="step-list-board">
      <div className="step-list-clip" aria-hidden="true">
        <span className="step-list-clip-bar" />
        <span className="step-list-clip-rivet step-list-clip-rivet-left" />
        <span className="step-list-clip-rivet step-list-clip-rivet-right" />
      </div>
      <ol className="step-list-paper">
        {sorted.map((step, index) => (
          <li key={step.position} className="step-list-item">
            <span className="step-list-number">{index + 1}.</span> {step.instruction}
          </li>
        ))}
      </ol>
    </div>
  )
}
