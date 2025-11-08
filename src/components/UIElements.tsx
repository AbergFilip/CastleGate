import React from 'react'
import { StarFilledIcon, StarOutlineIcon, ChevronDownIcon, ShieldSIcon } from './Icons'

interface RatingProps {
  rating: number
  totalReviews?: number
  showNumbers?: boolean
}

export const Rating = ({ rating, totalReviews, showNumbers = true }: RatingProps) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star}>
            {star <= fullStars ? (
              <StarFilledIcon width={20} height={20} />
            ) : star === fullStars + 1 && hasHalfStar ? (
              <StarFilledIcon width={20} height={20} />
            ) : (
              <StarOutlineIcon width={20} height={20} />
            )}
          </div>
        ))}
      </div>
      {showNumbers && (
        <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#2A2A2A' }}>
          {rating.toFixed(1)} {totalReviews && `(${totalReviews})`}
        </span>
      )}
    </div>
  )
}

interface ProgressBarProps {
  progress: number // 0-100
  small?: boolean
  showLabel?: boolean
  label?: string
  min?: number
  max?: number
  current?: number
}

export const ProgressBar = ({ 
  progress, 
  small = false, 
  showLabel = false, 
  label,
  min,
  max,
  current
}: ProgressBarProps) => {
  const width = small ? '120px' : '100%'
  const height = small ? '8px' : '24px'
  const barHeight = small ? '8px' : '24px'
  
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', width: '100%' }}>
      {min !== undefined && (
        <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#2A2A2A', minWidth: '50px' }}>
          {current !== undefined ? current.toLocaleString('sv-SE') : min.toLocaleString('sv-SE')}
        </span>
      )}
      <div 
        style={{
          position: 'relative',
          width: width,
          height: barHeight,
          backgroundColor: small ? '#E5E5E5' : '#FFFFFF',
          borderRadius: '4px',
          border: small ? 'none' : '1px solid #E5E5E5',
          overflow: 'hidden',
          flex: 1
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#146D7B',
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }}
        >
          {showLabel && label && (
            <span 
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                fontFamily: 'Roboto, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                color: '#FFFFFF',
                whiteSpace: 'nowrap'
              }}
            >
              {label}
            </span>
          )}
        </div>
      </div>
      {max !== undefined && (
        <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#2A2A2A', minWidth: '50px', textAlign: 'right' }}>
          {max.toLocaleString('sv-SE')}
        </span>
      )}
    </div>
  )
}

interface ToggleSwitchProps {
  checked: boolean
  onChange?: (checked: boolean) => void
}

export const ToggleSwitch = ({ checked, onChange }: ToggleSwitchProps) => {
  return (
    <button
      onClick={() => onChange && onChange(!checked)}
      style={{
        position: 'relative',
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: checked ? '#146D7B' : '#E5E5E5',
        cursor: 'pointer',
        padding: 0,
        transition: 'background-color 0.3s ease'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          transition: 'left 0.3s ease',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      />
    </button>
  )
}

interface DropdownProps {
  label: string
  options: string[]
  value?: string
  onChange?: (value: string) => void
}

export const Dropdown = ({ label, options, value, onChange }: DropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E5E5',
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: 'Roboto, sans-serif',
          fontSize: '16px',
          color: '#2A2A2A'
        }}
      >
        <span>{value || label}</span>
        <ChevronDownIcon width={16} height={16} />
      </button>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E5E5',
            borderRadius: '8px',
            boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.16)',
            zIndex: 100,
            overflow: 'hidden'
          }}
        >
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                onChange && onChange(option)
                setIsOpen(false)
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                backgroundColor: value === option ? '#F0F9FA' : '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Roboto, sans-serif',
                fontSize: '16px',
                color: '#2A2A2A'
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface SliderProps {
  min: number
  max: number
  value: number
  onChange?: (value: number) => void
}

export const Slider = ({ min, max, value, onChange }: SliderProps) => {
  const percentage = ((value - min) / (max - min)) * 100
  
  return (
    <div style={{ position: 'relative', width: '100%', padding: '8px 0' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '4px',
          backgroundColor: '#E5E5E5',
          borderRadius: '2px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: '#146D7B',
            borderRadius: '2px'
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${percentage}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#146D7B',
            cursor: 'pointer',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
          }}
          onMouseDown={(e) => {
            const handleMouseMove = (e: MouseEvent) => {
              const rect = (e.currentTarget as HTMLElement).parentElement?.getBoundingClientRect()
              if (rect) {
                const newPercentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
                const newValue = min + (newPercentage / 100) * (max - min)
                onChange && onChange(Math.round(newValue))
              }
            }
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove)
              document.removeEventListener('mouseup', handleMouseUp)
            }
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
          }}
        />
      </div>
    </div>
  )
}

interface AwardShieldsProps {
  levels: Array<{ level: number; active: boolean; fillOpacity?: number }>
}

export const AwardShields = ({ levels }: AwardShieldsProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', overflowX: 'auto' }}>
      {levels.map((level, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '60px' }}>
          <ShieldSIcon 
            width={60} 
            height={65} 
            color={level.active ? '#146D7B' : '#ACACAC'} 
            fillOpacity={level.fillOpacity || 0}
          />
          <span 
            style={{ 
              fontFamily: 'HK Grotesk Pro, Roboto, sans-serif',
              fontSize: '14px',
              fontWeight: level.active ? 700 : 400,
              color: level.active ? '#2A2A2A' : '#ACACAC',
              textAlign: 'center'
            }}
          >
            Nivå {level.level}
          </span>
        </div>
      ))}
    </div>
  )
}

