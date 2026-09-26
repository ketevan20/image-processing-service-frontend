import {
  TransformationSteps,
  TransformPayload,
  WatermarkPosition,
  ImageFormat,
  CompressLevel,
} from '@/types/transform'
import React from 'react'

type TransformationPanelProps = {
  active: TransformationSteps
  pending: TransformPayload
  onChange: <K extends keyof TransformPayload>(key: K, value: TransformPayload[K]) => void
  onApply: () => void
  applying: boolean
  hasPendingChanges: boolean
  applyError: string | null
}

const WATERMARK_POSITIONS: WatermarkPosition[] = [
  'top-left', 'top-right', 'center', 'bottom-left', 'bottom-right',
]

const COMPRESS_LEVELS: CompressLevel[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

const TransformationPanel = ({
  active,
  pending,
  onChange,
  onApply,
  applying,
  hasPendingChanges,
  applyError,
}: TransformationPanelProps) => {
  const inputClass =
    'w-full bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25'

  const Switch = ({ isOn, onClick }: { isOn: boolean; onClick: () => void }) => (
    <span
      onClick={onClick}
      className='relative w-9 h-5 transition-colors shrink-0 cursor-pointer'
      style={{ backgroundColor: isOn ? active.color : 'rgba(255,255,255,0.12)' }}
    >
      <span
        className='absolute top-0.5 w-4 h-4 bg-[#080707] transition-all'
        style={{ left: isOn ? '18px' : '2px' }}
      />
    </span>
  )

  const OptionButton = ({
    label,
    isOn,
    onClick,
  }: {
    label: string
    isOn: boolean
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      className='px-3 py-2 text-xs border transition-colors'
      style={{
        borderColor: isOn ? active.color : 'rgba(255,255,255,0.1)',
        backgroundColor: isOn ? `${active.color}1a` : 'transparent',
        color: isOn ? active.color : 'rgba(255,255,255,0.6)',
      }}
    >
      {label}
    </button>
  )

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className='flex items-center justify-between px-3 py-3'>
      <span className='text-sm text-white/80'>{label}</span>
      {children}
    </div>
  )

  const renderControls = () => {
    switch (active.key) {
      case 'resize': {
        const resize = pending.resize
        const updateResize = (field: 'width' | 'height', raw: string) => {
          if (raw === '') {
            const next = { ...resize }
            delete next[field]
            const isEmpty = Object.keys(next).length === 0
            onChange('resize', isEmpty ? undefined : (next as any))
            return
          }
          const value = Number(raw)
          if (Number.isNaN(value)) return
          onChange('resize', { ...resize, [field]: value } as any)
        }

        return (
          <div className='flex flex-col gap-3 px-2 py-1'>
            <div className='flex gap-2'>
              <div className='flex-1'>
                <label className='text-[11px] text-white/40 mb-1 block'>Width</label>
                <input
                  type='number'
                  value={resize?.width ?? ''}
                  onChange={(e) => updateResize('width', e.target.value)}
                  placeholder='auto'
                  className={inputClass}
                />
              </div>
              <div className='flex-1'>
                <label className='text-[11px] text-white/40 mb-1 block'>Height</label>
                <input
                  type='number'
                  value={resize?.height ?? ''}
                  onChange={(e) => updateResize('height', e.target.value)}
                  placeholder='auto'
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )
      }

      case 'crop': {
        const crop = pending.crop
        const updateCrop = (field: 'x' | 'y' | 'width' | 'height', raw: string) => {
          if (raw === '') {
            const next = { ...crop }
            delete next[field]
            const isEmpty = Object.keys(next).length === 0
            onChange('crop', isEmpty ? undefined : (next as any))
            return
          }
          const value = Number(raw)
          if (Number.isNaN(value)) return
          onChange('crop', { ...crop, [field]: value } as any)
        }

        return (
          <div className='flex flex-col gap-3 px-2 py-1'>
            <div className='flex gap-2'>
              <div className='flex-1'>
                <label className='text-[11px] text-white/40 mb-1 block'>X</label>
                <input type='number' value={crop?.x ?? ''} onChange={(e) => updateCrop('x', e.target.value)} placeholder='0' className={inputClass} />
              </div>
              <div className='flex-1'>
                <label className='text-[11px] text-white/40 mb-1 block'>Y</label>
                <input type='number' value={crop?.y ?? ''} onChange={(e) => updateCrop('y', e.target.value)} placeholder='0' className={inputClass} />
              </div>
            </div>
            <div className='flex gap-2'>
              <div className='flex-1'>
                <label className='text-[11px] text-white/40 mb-1 block'>Width</label>
                <input type='number' value={crop?.width ?? ''} onChange={(e) => updateCrop('width', e.target.value)} placeholder='auto' className={inputClass} />
              </div>
              <div className='flex-1'>
                <label className='text-[11px] text-white/40 mb-1 block'>Height</label>
                <input type='number' value={crop?.height ?? ''} onChange={(e) => updateCrop('height', e.target.value)} placeholder='auto' className={inputClass} />
              </div>
            </div>
          </div>
        )
      }

      case 'rotate':
        return (
          <div className='flex flex-col gap-3 px-2 py-1'>
            <div className='grid grid-cols-4 gap-2'>
              {[0, 90, 180, 270].map((deg) => (
                <OptionButton key={deg} label={`${deg}°`} isOn={pending.rotate === deg} onClick={() => onChange('rotate', deg)} />
              ))}
            </div>
            <div>
              <label className='text-[11px] text-white/40 mb-1 block'>Custom angle</label>
              <input
                type='number'
                value={pending.rotate ?? ''}
                onChange={(e) => {
                  if (e.target.value === '') {
                    onChange('rotate', undefined)
                    return
                  }
                  const val = Number(e.target.value)
                  if (Number.isNaN(val)) return
                  onChange('rotate', val)
                }}
                placeholder='0°'
                className={inputClass}
              />
            </div>
          </div>
        )

      case 'flip-mirror':
        return (
          <div className='flex flex-col px-1'>
            <Row label='Flip vertical'>
              <Switch isOn={!!pending.flip} onClick={() => onChange('flip', !pending.flip)} />
            </Row>
            <Row label='Mirror horizontal'>
              <Switch isOn={!!pending.mirror} onClick={() => onChange('mirror', !pending.mirror)} />
            </Row>
          </div>
        )

      case 'watermark': {
        const watermark = pending.watermark
        const updateWatermark = (field: 'text' | 'fontSize', raw: string) => {
          if (raw === '') {
            const next = { ...watermark }
            delete next[field]
            // 'text' is the only truly required field for a watermark to mean anything —
            // if it's gone, drop the whole watermark object.
            const isEmpty = !next.text
            onChange('watermark', isEmpty ? undefined : (next as any))
            return
          }
          if (field === 'fontSize') {
            const value = Number(raw)
            if (Number.isNaN(value)) return
            onChange('watermark', { text: watermark?.text ?? '', position: watermark?.position, fontSize: value })
            return
          }
          onChange('watermark', { text: raw, position: watermark?.position, fontSize: watermark?.fontSize })
        }
        const setPosition = (pos: WatermarkPosition) =>
          onChange('watermark', { text: watermark?.text ?? '', position: pos, fontSize: watermark?.fontSize })

        return (
          <div className='flex flex-col gap-4 px-2 py-1'>
            <div>
              <label className='text-[11px] text-white/40 mb-1 block'>Text</label>
              <input
                type='text'
                value={watermark?.text ?? ''}
                onChange={(e) => updateWatermark('text', e.target.value)}
                placeholder='© your brand'
                className={inputClass}
              />
            </div>

            <div>
              <label className='text-[11px] text-white/40 mb-2 block'>Position</label>
              <div className='grid grid-rows-3 gap-1.5 w-26'>
                <div className='flex justify-between'>
                  <PositionDot pos='top-left' current={watermark?.position} onSelect={setPosition} color={active.color} />
                  <PositionDot pos='top-right' current={watermark?.position} onSelect={setPosition} color={active.color} />
                </div>
                <div className='flex justify-center'>
                  <PositionDot pos='center' current={watermark?.position} onSelect={setPosition} color={active.color} />
                </div>
                <div className='flex justify-between'>
                  <PositionDot pos='bottom-left' current={watermark?.position} onSelect={setPosition} color={active.color} />
                  <PositionDot pos='bottom-right' current={watermark?.position} onSelect={setPosition} color={active.color} />
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between'>
                <label className='text-[11px] text-white/40'>Font size</label>
                <span className='text-xs font-mono' style={{ color: active.color }}>
                  {watermark?.fontSize ?? '—'}px
                </span>
              </div>
              <input
                type='range'
                min={8}
                max={96}
                value={watermark?.fontSize ?? 24}
                onChange={(e) => updateWatermark('fontSize', e.target.value)}
                className='w-full accent-current'
                style={{ color: active.color }}
              />
            </div>
          </div>
        )
      }

      case 'filters': {
        const filters = pending.filters ?? {}
        return (
          <div className='flex flex-col px-1'>
            {([{ key: 'grayscale', label: 'Grayscale' }, { key: 'sepia', label: 'Sepia' }] as const).map((opt) => (
              <Row key={opt.key} label={opt.label}>
                <Switch isOn={!!filters[opt.key]} onClick={() => onChange('filters', { ...filters, [opt.key]: !filters[opt.key] })} />
              </Row>
            ))}
          </div>
        )
      }

      case 'compress':
        return (
          <div className='flex flex-col gap-2 px-2 py-1'>
            <div className='flex items-center justify-between'>
              <label className='text-[11px] text-white/40'>Quality</label>
              <span className='text-xs font-mono' style={{ color: active.color }}>{pending.compress ?? '—'}%</span>
            </div>
            <div className='grid grid-cols-5 gap-1.5'>
              {COMPRESS_LEVELS.map((level) => (
                <OptionButton key={level} label={String(level)} isOn={pending.compress === level} onClick={() => onChange('compress', level)} />
              ))}
            </div>
          </div>
        )

      case 'format':
        return (
          <div className='flex flex-col gap-2 px-2 py-1'>
            <div className='grid grid-cols-3 gap-2'>
              {(['jpeg', 'png', 'webp'] as ImageFormat[]).map((f) => (
                <OptionButton key={f} label={f.toUpperCase()} isOn={pending.format === f} onClick={() => onChange('format', f)} />
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // flip-mirror is a UI step that maps to separate flip and mirror payload fields.
  const activePayloadKey = active.key === 'flip-mirror'
    ? undefined
    : active.key as keyof TransformPayload

  return (
    <div className='w-full lg:w-80 flex flex-col justify-between shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 py-2 px-4 sm:px-6 lg:px-10'>
      <div>
        <div className='flex items-center justify-between px-2 py-3'>
          <div className='flex items-center gap-2'>
            <span className='w-1.5 h-1.5' style={{ backgroundColor: active.color }} />
            <p className='text-xs uppercase tracking-widest text-white/50'>{active.label}</p>
          </div>

          {activePayloadKey && pending[activePayloadKey] !== undefined && (
            <button
              onClick={() => onChange(activePayloadKey, undefined)}
              className='text-[11px] text-white/40 hover:text-white/70 transition-colors'
            >
              Clear
            </button>
          )}
        </div>

        {renderControls()}
      </div>

      <div className='flex flex-col gap-2 mt-4 lg:mt-0'>
        {applyError && <p className='text-xs text-red-400 px-2'>{applyError}</p>}
        <button
          onClick={onApply}
          disabled={!hasPendingChanges || applying}
          className='w-full py-3 text-sm font-medium tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
          style={{ backgroundColor: active.color, color: '#080707' }}
        >
          {applying ? 'Applying…' : 'Apply Changes'}
        </button>
      </div>
    </div>
  )
}

const PositionDot = ({
  pos, current, onSelect, color,
}: { pos: WatermarkPosition; current?: WatermarkPosition; onSelect: (pos: WatermarkPosition) => void; color: string }) => {
  const isActive = current === pos
  return (
    <button
      onClick={() => onSelect(pos)}
      className='w-8 h-8 border flex items-center justify-center transition-colors'
      style={{ borderColor: isActive ? color : 'rgba(255,255,255,0.1)', backgroundColor: isActive ? `${color}1a` : 'transparent' }}
    >
      <span className='w-1.5 h-1.5' style={{ backgroundColor: isActive ? color : 'rgba(255,255,255,0.25)' }} />
    </button>
  )
}

export default TransformationPanel