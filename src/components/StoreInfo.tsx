import { useEffect, useState } from 'react'
import { resolveImageUrl } from '@/shared/lib/imageUrl'

const FALLBACK_MINIMUM_ORDER = 20
const PUBLIC_FALLBACK_LOGO = '/burger-or-hamburger-logo-vintage-vector-Graphics-27222106-1.jpg'
const LOGO_SKELETON_MIN_MS = 800

interface Props {
  name: string
  logo?: string | null
  primaryColor?: string | null
  address?: string
  isOpen: boolean
  nextOpenLabel?: string | null
  minimumOrder?: number | string | null
  tableNumber?: number | null
}

function fmtBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function normalizeMinimumOrder(value?: number | string | null) {
  if (value == null) return null

  const numberValue = typeof value === 'number' ? value : Number(String(value).replace(',', '.'))
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null
}

function getLogoImageUrl(url: string): string {
  const resolved = resolveImageUrl(url) ?? url

  if (!resolved.includes('cloudinary.com')) return resolved

  return resolved.replace('/upload/', '/upload/f_auto,w_180/')
}


function LogoShimmerSkeleton({ roundedClass = 'rounded-[22px]' }: { roundedClass?: string }) {
  return (
    <>
      <style>{`
        @keyframes menu-logo-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
      <div
        className={`absolute inset-0 ${roundedClass}`}
        aria-hidden="true"
        style={{
          background: 'linear-gradient(90deg, #eeeeee 0%, #f8f8f8 42%, #eeeeee 84%)',
          backgroundSize: '240% 100%',
          animation: 'menu-logo-shimmer 1.25s ease-in-out infinite',
        }}
      />
    </>
  )
}

export function StoreInfo({
  name,
  logo,
  address,
  isOpen,
  nextOpenLabel,
  minimumOrder,
  tableNumber,
}: Props) {
  // Fallback visual: se a API ainda não enviar pedido mínimo, mantém o bloco aparecendo.
  const minimumOrderValue = normalizeMinimumOrder(minimumOrder) ?? FALLBACK_MINIMUM_ORDER
  const displayLogo = logo || PUBLIC_FALLBACK_LOGO
  const logoUrl = getLogoImageUrl(displayLogo)
  const [isLogoLoaded, setIsLogoLoaded] = useState(false)
  const [canHideLogoSkeleton, setCanHideLogoSkeleton] = useState(false)

  useEffect(() => {
    setIsLogoLoaded(false)
    setCanHideLogoSkeleton(false)

    const timer = window.setTimeout(() => {
      setCanHideLogoSkeleton(true)
    }, LOGO_SKELETON_MIN_MS)

    return () => window.clearTimeout(timer)
  }, [logoUrl])

  const showLogoSkeleton = !isLogoLoaded || !canHideLogoSkeleton
  const showLogoImage = isLogoLoaded && canHideLogoSkeleton

  return (
    <section
      className="relative w-full"
      aria-label="Informações do estabelecimento"
    >
      <div className="flex w-full items-start gap-3.5 sm:gap-4">
        <div className="relative shrink-0">
          <div className="relative h-[74px] w-[74px] overflow-hidden rounded-[22px] border-0 bg-white p-0 shadow-none sm:h-[78px] sm:w-[78px]">
            {showLogoSkeleton && <LogoShimmerSkeleton />}

            <img
              src={logoUrl}
              alt={name}
              className={`block h-full w-full object-cover object-center transition-opacity duration-300 ${
                showLogoImage ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => setIsLogoLoaded(true)}
            />

            <span
              className="pointer-events-none absolute inset-0 z-20 rounded-[22px] border border-[#DDDDDD]"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 pt-[1px]">
          <h1 className="min-w-0 truncate py-[2px] text-[18px] font-bold leading-[1.18] tracking-[-0.38px] text-[#574f4f] sm:text-[20px]">
            {name}
          </h1>

          {address && (
            <div className="mt-[5px] flex items-start gap-[7px]">
              {/* Mapa-com-pin (FontAwesome map-marker-alt v4) — mesmo SVG do MenuPanda */}
              <svg
                className="mt-[3px] h-[12px] w-[12px] shrink-0 text-menu-text"
                viewBox="0 0 512 512"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M400 0c-61.76 0-112 50.24-112 112 0 57.472 89.856 159.264 100.096 170.688 3.04 3.36 7.36 5.312 11.904 5.312s8.864-1.952 11.904-5.312C422.144 271.264 512 169.472 512 112 512 50.24 461.76 0 400 0zm0 160c-26.496 0-48-21.504-48-48s21.504-48 48-48 48 21.504 48 48-21.504 48-48 48zM10.048 187.968A16.048 16.048 0 0 0 0 202.848V496c0 5.312 2.656 10.272 7.04 13.248C9.728 511.04 12.832 512 16 512c2.016 0 4.032-.384 5.952-1.152L160 455.616V128L10.048 187.968z"
                  fill="currentColor"
                />
                <path
                  d="M435.712 304.064C426.624 314.176 413.6 320 400 320c-13.6 0-26.624-5.824-35.712-15.936-3.264-3.616-7.456-8.384-12.288-14.048V512l149.952-59.968c6.08-2.4 10.048-8.32 10.048-14.848V201.952c-26.208 44.384-61.248 85.344-76.288 102.112zM266.08 157.632 192 128v327.616l128 51.2v-256.96c-20.448-27.552-41.792-60.736-53.92-92.224z"
                  fill="currentColor"
                />
              </svg>
              <p className="min-w-0 max-w-[450px] whitespace-pre-line text-[11px] font-normal leading-[1.38] tracking-[-0.28px] text-menu-text sm:text-xs">
                {address}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-[11px] flex w-full flex-nowrap items-center gap-x-2.5 gap-y-1 overflow-hidden">
        {minimumOrderValue != null && (
          <>
            <div className="flex min-w-0 shrink-0 items-center gap-[5px]" aria-label={`Pedido mínimo ${fmtBRL(minimumOrderValue)}`}>
              <span
                className="relative -top-[1px] h-[11px] w-[11px] shrink-0 bg-[#574f4f]"
                aria-hidden="true"
                style={{
                  WebkitMaskImage: 'url(/iconmoney.svg)',
                  maskImage: 'url(/iconmoney.svg)',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                }}
              />
              <span className="whitespace-nowrap text-[11px] font-semibold leading-[1.35] tracking-[-0.22px] text-[#574f4f] sm:text-xs">
                Pedido mínimo {fmtBRL(minimumOrderValue)}
              </span>
            </div>

            <span className="h-[13px] w-px shrink-0 bg-menu-divider" aria-hidden="true" />
          </>
        )}

        <div
          className="flex min-w-0 shrink-0 items-center gap-[5px]"
          aria-label={isOpen ? 'Restaurante aberto agora' : 'Restaurante fechado'}
        >
          <span
            className="relative flex h-[9px] w-[9px] shrink-0 items-center justify-center"
            aria-hidden="true"
          >
            {isOpen && (
              <span className="absolute h-[9px] w-[9px] rounded-full bg-[#39a00a]/20 animate-ping" />
            )}
            <span
              className={`relative h-[6px] w-[6px] rounded-full ${
                isOpen
                  ? 'bg-[#39a00a] shadow-[0_0_0_3px_rgba(57,160,10,0.12)]'
                  : 'bg-gray-400 shadow-[0_0_0_3px_rgba(160,160,160,0.12)]'
              }`}
            />
          </span>

          <span
            className={`whitespace-nowrap text-[11px] font-semibold leading-[1.35] tracking-[-0.22px] sm:text-xs ${
              isOpen ? 'text-[#137a13]' : 'text-gray-500'
            }`}
          >
            {isOpen ? 'Aberto agora' : nextOpenLabel ? `Fechado · abrimos ${nextOpenLabel}` : 'Fechado'}
          </span>
        </div>

        {tableNumber != null && (
          <>
            <span className="h-[13px] w-px bg-menu-divider" aria-hidden="true" />
            <span className="whitespace-nowrap rounded-full bg-blue-100 px-1.5 py-0.5 text-[11px] font-semibold leading-[1.2] text-blue-700 sm:text-xs">
              🍽️ Mesa {tableNumber}
            </span>
          </>
        )}
      </div>

      <div className="mt-[9px] h-px w-full bg-gradient-to-r from-menu-divider via-[rgba(64,57,57,0.05)] to-transparent" />
    </section>
  )
}
