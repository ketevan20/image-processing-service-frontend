import { transformationSteps } from '@/hooks/useTransform'
import { isStepSet } from '@/lib/api/isStepSet'
import { TransformationSteps, TransformPayload, TransformStep } from '@/types/transform'

type Props = {
  active: TransformationSteps
  setActive: (step: TransformationSteps) => void
  pending: TransformPayload
}

const TrnasformationsList = ({ active, setActive, pending }: Props) => {
  return (
    <aside className='w-full lg:w-55 shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 lg:py-2'>
      <nav className='flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible scrollbar-none'>
        {transformationSteps.map((step) => {
          const isActive = step.key === active.key
          const hasValue = isStepSet(step.key, pending)
          return (
            <button
              key={step.key}
              onClick={() => setActive(step)}
              className={`relative group flex items-center gap-2 lg:gap-0 lg:justify-between shrink-0 px-4 py-2.5 lg:px-10 lg:py-3.5 text-left transition-colors border-b-2 lg:border-b-0 lg:border-l-2 whitespace-nowrap ${
                isActive ? 'bg-white/6 border-b-2 lg:border-l-2' : 'border-transparent hover:bg-white/3'
              }`}
              style={isActive ? { borderColor: step.color, backgroundColor: `${step.color}1a` } : undefined}
            >
              <span className='font-mono text-[11px] tracking-[0.15em]' style={{ color: isActive ? step.color : 'rgba(255,255,255,0.7)' }}>
                <span style={{ color: isActive ? step.color : 'rgba(255,255,255,0.3)' }}>{step.num}</span>
                {'  '}
                <span className='hidden sm:inline'>{step.label.toUpperCase()}</span>
              </span>
              {hasValue && (
                <span className='absolute max-md:top-0 max-md:left-[50%] max-md:translate-x-[-50%] lg:right-4 w-1.25 h-1.25 shrink-0' style={{ background: isActive ? step.color : 'rgba(255,255,255,0.4)' }} />
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default TrnasformationsList