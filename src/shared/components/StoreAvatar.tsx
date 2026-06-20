interface StoreAvatarProps {
  name: string
  logoUrl?: string | null
  fallbackBg?: string | null
  size?: number
  className?: string
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function StoreAvatar({
  name,
  logoUrl,
  fallbackBg,
  size = 74,
  className = '',
}: StoreAvatarProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-menu-primary text-lg font-extrabold text-white ${className}`}
      style={{
        width: size,
        height: size,
        background: logoUrl ? undefined : fallbackBg ?? 'var(--menu-primary)',
      }}
      aria-label={`Logo de ${name}`}
    >
      {logoUrl ? (
        <img src={logoUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  )
}
