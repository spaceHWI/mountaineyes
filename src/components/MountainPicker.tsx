import { useEffect, useRef, useState } from 'react'
import type { Mountain, MountainId } from '../data/feeds'
import type { HealthStatus } from '../hooks/useFeedHealth'
import { localize, type Language } from '../i18n'

type MountainPickerProps = {
  health: Record<MountainId, HealthStatus>
  language: Language
  mountains: Mountain[]
  onChange: (id: MountainId) => void
  value: MountainId
}

const statusDotClass: Record<HealthStatus, string> = {
  checking: 'status-dot checking',
  live: 'status-dot live',
  offline: 'status-dot offline',
}

export function MountainPicker({ health, language, mountains, onChange, value }: MountainPickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const activeMountain = mountains.find((m) => m.id === value) ?? mountains[0]

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div className="mountain-picker" ref={containerRef}>
      <button
        className="mountain-picker-trigger"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={statusDotClass[health[value] ?? 'checking']} />
        <span className="mountain-picker-label">{localize(activeMountain.name, language)}</span>
        <span className={`mountain-picker-arrow ${open ? 'open' : ''}`} aria-hidden="true">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {open && (
        <ul className="mountain-picker-menu" role="listbox">
          {mountains.map((mountain) => {
            const status = health[mountain.id] ?? 'checking'
            const isActive = mountain.id === value

            return (
              <li key={mountain.id} role="option" aria-selected={isActive}>
                <button
                  className={`mountain-picker-option ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onChange(mountain.id)
                    setOpen(false)
                  }}
                  type="button"
                >
                  <span className={statusDotClass[status]} />
                  <span className="mountain-picker-option-name">
                    {localize(mountain.name, language)}
                  </span>
                  <span className="mountain-picker-option-region">
                    {localize(mountain.region, language)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
