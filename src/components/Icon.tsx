export function Icon({
  name,
}: {
  name: 'mountain' | 'path' | 'grid' | 'pin' | 'view' | 'instagram'
}) {
  const commonProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
  }

  const paths = {
    mountain: (
      <>
        <path {...commonProps} d="M3.5 17.5 9.2 8.5l3.2 4.4 2-3.1 6.1 7.7H3.5Z" />
        <path {...commonProps} d="m8.1 10.2 1.1-1.7 1.2 1.7" />
      </>
    ),
    path: (
      <>
        <path {...commonProps} d="M6 4.5c4 0 5 2 5 4.2 0 3.7-3 4-3 7.8" />
        <path {...commonProps} d="M8 16.5c0 1.7 1.5 3 4 3s4-1.1 4-3" />
        <circle {...commonProps} cx="6.5" cy="4.5" r="1.5" />
      </>
    ),
    grid: (
      <>
        <rect {...commonProps} x="3.5" y="3.5" width="6" height="6" rx="1.2" />
        <rect {...commonProps} x="14.5" y="3.5" width="6" height="6" rx="1.2" />
        <rect {...commonProps} x="3.5" y="14.5" width="6" height="6" rx="1.2" />
        <rect {...commonProps} x="14.5" y="14.5" width="6" height="6" rx="1.2" />
      </>
    ),
    pin: (
      <>
        <path {...commonProps} d="M12 20s6-5.4 6-10a6 6 0 1 0-12 0c0 4.6 6 10 6 10Z" />
        <circle {...commonProps} cx="12" cy="10" r="2.2" />
      </>
    ),
    view: (
      <>
        <path {...commonProps} d="M3.5 16.5 8.2 11l3 3.2 2.1-2.7 4.2 5H3.5Z" />
        <path {...commonProps} d="M15.5 7.5h5v5" />
        <path {...commonProps} d="m20.5 7.5-6.2 6.2" />
      </>
    ),
    instagram: (
      <>
        <rect {...commonProps} x="4.5" y="4.5" width="15" height="15" rx="4.2" />
        <circle {...commonProps} cx="12" cy="12" r="3.3" />
        <circle {...commonProps} cx="17" cy="7.8" r="0.8" fill="currentColor" stroke="none" />
      </>
    ),
  }

  return (
    <span className="icon-badge" aria-hidden="true">
      <svg viewBox="0 0 24 24">{paths[name]}</svg>
    </span>
  )
}
