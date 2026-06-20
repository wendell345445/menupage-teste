import { resolveImageUrl } from '@/shared/lib/imageUrl'

const PUBLIC_FALLBACK_LOGO = '/burger-or-hamburger-logo-vintage-vector-Graphics-27222106-1.jpg'

function getLogoImageUrl(url: string): string {
  const resolved = resolveImageUrl(url) ?? url

  if (!resolved.includes('cloudinary.com')) return resolved

  return resolved.replace('/upload/', '/upload/f_auto,w_120/')
}

interface Props {
  storeName: string
  logo?: string | null
  primaryColor?: string | null
  showCompactIdentity?: boolean
  onMenuClick?: () => void
  onShareClick?: () => void
}

export function StoreHeader({
  storeName,
  logo,
  showCompactIdentity = false,
  onMenuClick,
  onShareClick,
}: Props) {
  const displayLogo = logo || PUBLIC_FALLBACK_LOGO
  const logoUrl = getLogoImageUrl(displayLogo)

  return (
    <>
      <style>
        {`
          @keyframes menuHeaderMessageSlide {
            0% {
              opacity: 0;
              filter: blur(5px);
              transform: translateX(38px) scale(0.98);
            }

            10%, 48% {
              opacity: 1;
              filter: blur(0);
              transform: translateX(0) scale(1);
            }

            58%, 100% {
              opacity: 0;
              filter: blur(5px);
              transform: translateX(-38px) scale(0.98);
            }
          }

          .menu-header-message-text {
            text-shadow:
              0 1px 1px rgba(15, 23, 42, 0.08),
              0 0 14px rgba(255, 255, 255, 0.34);
            -webkit-font-smoothing: antialiased;
          }

          .menu-header-rotating-message {
            opacity: 0;
            animation: menuHeaderMessageSlide 6.4s cubic-bezier(0.22, 1, 0.36, 1) infinite;
            will-change: opacity, transform, filter;
          }

          .menu-header-rotating-message-one {
            animation-delay: 0s;
          }

          .menu-header-rotating-message-two {
            animation-delay: 3.2s;
          }
        `}
      </style>

      <section
        className="fixed left-1/2 top-0 z-[90] h-[49px] w-full max-w-[768px] -translate-x-1/2 overflow-visible bg-[#2563EB] shadow-none"
        aria-label={`Cabeçalho de ${storeName}`}
      >
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={onMenuClick}
          className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white transition-transform active:scale-95 sm:left-4"
        >
          {/* Menu hamburguer estilizado (linhas escalonadas) — SVG idêntico ao MenuPanda */}
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M16 7H3a1 1 0 0 1 0-2h13a1 1 0 0 1 0 2zm6 5a1 1 0 0 0-1-1H3a1 1 0 0 0 0 2h18a1 1 0 0 0 1-1zm-9 6a1 1 0 0 0-1-1H3a1 1 0 0 0 0 2h9a1 1 0 0 0 1-1z"
              fill="currentColor"
            />
          </svg>
        </button>

        <div className="absolute inset-y-0 left-[58px] right-[58px] flex min-w-0 items-center justify-center sm:left-[66px] sm:right-[66px]">
          {showCompactIdentity ? (
            <div className="flex min-w-0 max-w-full items-center justify-center gap-2 rounded-full px-1 py-[2px] transition-all duration-200">
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[12px] border-0 bg-white p-0 shadow-none">
                <img
                  src={logoUrl}
                  alt={storeName}
                  className="block h-full w-full object-cover object-center"
                  loading="eager"
                />
              </div>

              <h1 className="min-w-0 max-w-[160px] truncate py-[2px] text-center [font-family:'Sen',Helvetica] text-[13px] font-bold leading-[1.2] tracking-[-0.24px] text-white sm:max-w-[260px] sm:text-[14px]">
                {storeName}
              </h1>
            </div>
          ) : (
            <div className="relative flex h-full w-full max-w-[240px] items-center justify-center overflow-hidden text-center sm:max-w-[320px]">
              <div className="menu-header-rotating-message menu-header-rotating-message-one absolute inset-0 flex items-center justify-center">
                <span className="menu-header-message-text max-w-full truncate px-2 py-[4px] [font-family:'Sen',Helvetica] text-[13px] font-semibold leading-none tracking-[-0.15px] text-white sm:text-[14px]">
                  Loja aberta
                </span>
              </div>

              <div className="menu-header-rotating-message menu-header-rotating-message-two absolute inset-0 flex items-center justify-center">
                <span className="menu-header-message-text max-w-full truncate px-2 py-[4px] [font-family:'Sen',Helvetica] text-[13px] font-semibold leading-none tracking-[-0.15px] text-white sm:text-[14px]">
                  Faça seu pedido
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="Compartilhar"
          onClick={onShareClick}
          className="absolute right-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-white transition-transform active:scale-95 sm:right-5"
        >
          {/* Share clássico (3 nós conectados) — SVG idêntico ao MenuPanda */}
          <svg className="h-[20px] w-[20px]" viewBox="0 0 512 512" fill="none" aria-hidden="true">
            <path
              d="M406 332c-29.641 0-55.761 14.581-72.167 36.755L191.99 296.124c2.355-8.027 4.01-16.346 4.01-25.124 0-11.906-2.441-23.225-6.658-33.636l148.445-89.328C354.307 167.424 378.589 180 406 180c49.629 0 90-40.371 90-90S455.629 0 406 0s-90 40.371-90 90c0 11.437 2.355 22.286 6.262 32.358l-148.887 89.59C156.869 193.136 132.937 181 106 181c-49.629 0-90 40.371-90 90s40.371 90 90 90c30.13 0 56.691-15.009 73.035-37.806l141.376 72.395C317.807 403.995 316 412.75 316 422c0 49.629 40.371 90 90 90s90-40.371 90-90-40.371-90-90-90z"
              fill="currentColor"
            />
          </svg>
        </button>
      </section>

      <div aria-hidden="true" className="h-[49px]" />
    </>
  )
}
