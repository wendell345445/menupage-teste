import { resolveImageUrl } from "@/shared/lib/imageUrl";

const PUBLIC_FALLBACK_LOGO =
  "/burger-or-hamburger-logo-vintage-vector-Graphics-27222106-1.jpg";

function getLogoImageUrl(url: string): string {
  const resolved = resolveImageUrl(url) ?? url;

  if (!resolved.includes("cloudinary.com")) return resolved;

  return resolved.replace("/upload/", "/upload/f_auto,w_120/");
}

interface Props {
  storeName: string;
  logo?: string | null;
  primaryColor?: string | null;
  showCompactIdentity?: boolean;
  searchOpen?: boolean;
  searchValue?: string;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  onSearchChange?: (value: string) => void;
  onSearchClose?: () => void;
}

export function StoreHeader({
  storeName,
  logo,
  showCompactIdentity = false,
  searchOpen = false,
  searchValue = "",
  onMenuClick,
  onSearchClick,
  onSearchChange,
  onSearchClose,
}: Props) {
  const displayLogo = logo || PUBLIC_FALLBACK_LOGO;
  const logoUrl = getLogoImageUrl(displayLogo);

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
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M16 7H3a1 1 0 0 1 0-2h13a1 1 0 0 1 0 2zm6 5a1 1 0 0 0-1-1H3a1 1 0 0 0 0 2h18a1 1 0 0 0 1-1zm-9 6a1 1 0 0 0-1-1H3a1 1 0 0 0 0 2h9a1 1 0 0 0 1-1z"
              fill="currentColor"
            />
          </svg>
        </button>

        <div className="absolute inset-y-0 left-[62px] right-[62px] flex min-w-0 items-center justify-center sm:left-[72px] sm:right-[72px]">
          {searchOpen ? (
            <div className="flex h-[30px] w-full max-w-[320px] items-center gap-1.5 rounded-full bg-white px-2.5 shadow-[0_6px_18px_rgba(15,23,42,0.10)] ring-1 ring-white/35">
              <svg
                className="h-[15px] w-[15px] shrink-0 text-[#2563EB]"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                value={searchValue}
                onChange={(event) => onSearchChange?.(event.target.value)}
                autoFocus
                placeholder="Pesquisar"
                className="min-w-0 flex-1 bg-transparent [font-family:'Sen',Helvetica] text-[13px] font-semibold text-[#2e2828] outline-none placeholder:text-[#8b8585]"
              />

              <button
                type="button"
                aria-label="Fechar pesquisa"
                onClick={onSearchClose}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#8b8585] transition-colors hover:bg-black/5 hover:text-[#2e2828]"
              >
                <svg
                  className="h-[12px] w-[12px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M18 6 6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ) : showCompactIdentity ? (
            <div className="pointer-events-none flex min-w-0 max-w-full items-center justify-center gap-2 rounded-full px-1 py-[2px] transition-all duration-200">
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
            <div className="pointer-events-none relative flex h-full w-full max-w-[280px] items-center justify-center overflow-hidden text-center sm:max-w-[360px]">
              <div className="menu-header-rotating-message menu-header-rotating-message-one absolute inset-0 flex items-center justify-center">
                <span className="menu-header-message-text max-w-full truncate px-2 py-[4px] [font-family:'Sen',Helvetica] text-[17px] font-semibold leading-none tracking-[-0.2px] text-white sm:text-[18px]">
                  Loja aberta
                </span>
              </div>

              <div className="menu-header-rotating-message menu-header-rotating-message-two absolute inset-0 flex items-center justify-center">
                <span className="menu-header-message-text max-w-full truncate px-2 py-[4px] [font-family:'Sen',Helvetica] text-[17px] font-semibold leading-none tracking-[-0.2px] text-white sm:text-[18px]">
                  Faça seu pedido
                </span>
              </div>
            </div>
          )}
        </div>

        {!searchOpen && (
          <button
            type="button"
            aria-label="Abrir pesquisa"
            onClick={onSearchClick}
            className="absolute right-4 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/30 backdrop-blur-md transition-transform hover:bg-white/25 active:scale-95 sm:right-5"
          >
            <svg
              className="h-[17px] w-[17px]"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </section>

      <div aria-hidden="true" className="h-[49px]" />
    </>
  );
}
