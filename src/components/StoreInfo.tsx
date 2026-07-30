import { useEffect, useState } from "react";
import { resolveImageUrl } from "@/shared/lib/imageUrl";
import { MenuShimmer } from "./MenuShimmer";

const FALLBACK_MINIMUM_ORDER = 20;
const PUBLIC_FALLBACK_LOGO =
  "/burger-or-hamburger-logo-vintage-vector-Graphics-27222106-1.jpg";
const LOGO_SKELETON_MIN_MS = 800;

const DEFAULT_OPENING_HOURS = [
  { day: "Segunda-feira", hours: "18:00 às 23:30" },
  { day: "Terça-feira", hours: "18:00 às 23:30" },
  { day: "Quarta-feira", hours: "18:00 às 23:30" },
  { day: "Quinta-feira", hours: "18:00 às 23:30" },
  { day: "Sexta-feira", hours: "18:00 às 00:00" },
  { day: "Sábado", hours: "18:00 às 00:00" },
  { day: "Domingo", hours: "18:00 às 23:00" },
];

interface Props {
  name: string;
  logo?: string | null;
  primaryColor?: string | null;
  address?: string;
  isOpen: boolean;
  nextOpenLabel?: string | null;
  minimumOrder?: number | string | null;
  tableNumber?: number | null;
  isLoading?: boolean;
  hasCover?: boolean;
}

function fmtBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function normalizeMinimumOrder(value?: number | string | null) {
  if (value == null) return null;

  const numberValue =
    typeof value === "number" ? value : Number(String(value).replace(",", "."));
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null;
}

function getTodayOpeningHourIndex() {
  const weekDay = new Date().getDay();
  return weekDay === 0 ? 6 : weekDay - 1;
}

function getLogoImageUrl(url: string): string {
  const resolved = resolveImageUrl(url) ?? url;

  if (!resolved.includes("cloudinary.com")) return resolved;

  return resolved.replace("/upload/", "/upload/f_auto,w_180/");
}

function LogoShimmerSkeleton({
  roundedClass = "rounded-full",
}: {
  roundedClass?: string;
}) {
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
          background:
            "linear-gradient(90deg, #eeeeee 0%, #f8f8f8 42%, #eeeeee 84%)",
          backgroundSize: "240% 100%",
          animation: "menu-logo-shimmer 1.25s ease-in-out infinite",
        }}
      />
    </>
  );
}

export function StoreInfo({
  name,
  logo,
  address,
  isOpen,
  nextOpenLabel,
  minimumOrder,
  tableNumber,
  isLoading = false,
  hasCover = false,
}: Props) {
  // Fallback visual: se a API ainda não enviar pedido mínimo, mantém o bloco aparecendo.
  const minimumOrderValue =
    normalizeMinimumOrder(minimumOrder) ?? FALLBACK_MINIMUM_ORDER;
  const displayLogo = logo || PUBLIC_FALLBACK_LOGO;
  const logoUrl = getLogoImageUrl(displayLogo);
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);
  const [canHideLogoSkeleton, setCanHideLogoSkeleton] = useState(false);
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);

  useEffect(() => {
    setIsLogoLoaded(false);
    setCanHideLogoSkeleton(false);

    const timer = window.setTimeout(() => {
      setCanHideLogoSkeleton(true);
    }, LOGO_SKELETON_MIN_MS);

    return () => window.clearTimeout(timer);
  }, [logoUrl]);

  useEffect(() => {
    if (!isHoursModalOpen || typeof document === "undefined") return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsHoursModalOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isHoursModalOpen]);

  const showLogoSkeleton = isLoading || !isLogoLoaded || !canHideLogoSkeleton;
  const showLogoImage = !isLoading && isLogoLoaded && canHideLogoSkeleton;
  const todayOpeningHourIndex = getTodayOpeningHourIndex();

  function handleShareClick() {
    if (typeof window === "undefined") return;

    const shareUrl = window.location.href;
    const shareTitle = name;
    const shareText = address ? `${name} - ${address}` : name;

    if (navigator.share) {
      void navigator
        .share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
        .catch(() => undefined);
      return;
    }

    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(shareUrl).catch(() => undefined);
    }
  }

  function handleInfoClick() {
    setIsHoursModalOpen(true);
  }

  return (
    <section
      className={`relative w-full ${hasCover ? "pt-4 sm:pt-5" : "pt-5"}`}
      aria-label="Informações do estabelecimento"
    >
      {hasCover ? (
        <div
          className="pointer-events-none absolute left-[-1rem] right-[-1rem] top-0 h-[2px] bg-[var(--menu-primary)] sm:left-[-1.5rem] sm:right-[-1.5rem] md:left-[-2rem] md:right-[-2rem]"
          aria-hidden="true"
        />
      ) : null}

      <div className="flex w-full items-start gap-3.5 sm:gap-4">
        <div className={`relative shrink-0 ${hasCover ? "-mt-[36px] sm:-mt-[41px]" : ""}`}>
          <div className={`relative h-[80px] w-[80px] overflow-hidden rounded-full bg-white p-0 sm:h-[84px] sm:w-[84px] ${hasCover ? "border-[3px] border-white shadow-none" : "border-0 shadow-none"}`}>
            {showLogoSkeleton && <LogoShimmerSkeleton />}

            <img
              src={logoUrl}
              alt={name}
              className={`block h-full w-full object-cover object-center transition-opacity duration-300 ${
                showLogoImage ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={() => setIsLogoLoaded(true)}
            />

            <span
              className="pointer-events-none absolute inset-0 z-20 rounded-full border border-[#DDDDDD]"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className={`min-w-0 flex-1 pt-[1px] ${hasCover ? "-mt-[8px]" : ""}`}>
          <div className="flex min-w-0 items-start justify-between gap-2.5">
            <div className="min-w-0 flex-1">
              {isLoading ? (
                <MenuShimmer className="h-[21px] w-[68%] max-w-[230px] rounded-full" />
              ) : (
                <h1 className="min-w-0 truncate py-[2px] text-[18px] font-bold leading-[1.18] tracking-[-0.38px] text-[#574f4f] sm:text-[20px]">
                  {name}
                </h1>
              )}

              {isLoading ? (
                <div className="mt-[7px] flex items-center gap-[7px]">
                  <MenuShimmer className="h-[12px] w-[12px] shrink-0 rounded-[4px]" />
                  <MenuShimmer className="h-[11px] w-[82%] max-w-[290px] rounded-full" />
                </div>
              ) : (
                address && (
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
                )
              )}
            </div>

            {isLoading ? (
              <div
                className="flex shrink-0 flex-col items-center gap-2.5 pt-[2px]"
                aria-hidden="true"
              >
                <MenuShimmer className="h-[18px] w-[18px] rounded-[5px]" />
                <MenuShimmer className="h-[18px] w-[18px] rounded-[5px]" />
              </div>
            ) : (
              <div
                className="flex shrink-0 translate-y-[4px] flex-col items-center gap-2.5 pt-[2px]"
                aria-label="Ações do restaurante"
              >
                <button
                  type="button"
                  onClick={handleShareClick}
                  className="flex h-[22px] w-[22px] items-center justify-center text-[#574f4f] transition-transform hover:text-[var(--menu-primary)] active:scale-95"
                  aria-label="Compartilhar cardápio"
                >
                  <svg
                    className="h-[18px] w-[18px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="18"
                      cy="5"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle
                      cx="6"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle
                      cx="18"
                      cy="19"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M8.6 10.6 15.4 6.4M8.6 13.4l6.8 4.2"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleInfoClick}
                  className="flex h-[22px] w-[22px] items-center justify-center text-[#574f4f] transition-transform hover:text-[var(--menu-primary)] active:scale-95"
                  aria-label="Ver informações do restaurante"
                >
                  <svg
                    className="h-[19px] w-[19px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M12 10.5v5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 7.6h.01"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-[11px] flex w-full flex-nowrap items-center gap-x-2.5 gap-y-1 overflow-hidden">
        {isLoading ? (
          <>
            <div
              className="flex min-w-0 shrink-0 items-center gap-[5px]"
              aria-hidden="true"
            >
              <MenuShimmer className="h-[11px] w-[11px] shrink-0 rounded-[3px]" />
              <MenuShimmer className="h-[12px] w-[118px] rounded-full" />
            </div>

            <span
              className="h-[13px] w-px shrink-0 bg-menu-divider"
              aria-hidden="true"
            />

            <div
              className="flex min-w-0 shrink-0 items-center gap-[5px]"
              aria-hidden="true"
            >
              <MenuShimmer className="h-[9px] w-[9px] shrink-0 rounded-full" />
              <MenuShimmer className="h-[12px] w-[84px] rounded-full" />
            </div>
          </>
        ) : (
          <>
            {minimumOrderValue != null && (
              <>
                <div
                  className="flex min-w-0 shrink-0 items-center gap-[5px]"
                  aria-label={`Pedido mínimo ${fmtBRL(minimumOrderValue)}`}
                >
                  <span
                    className="relative -top-[1px] h-[11px] w-[11px] shrink-0 bg-[#574f4f]"
                    aria-hidden="true"
                    style={{
                      WebkitMaskImage: "url(/iconmoney.svg)",
                      maskImage: "url(/iconmoney.svg)",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskPosition: "center",
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                    }}
                  />
                  <span className="whitespace-nowrap text-[11px] font-semibold leading-[1.35] tracking-[-0.22px] text-[#574f4f] sm:text-xs">
                    Pedido mínimo {fmtBRL(minimumOrderValue)}
                  </span>
                </div>

                <span
                  className="h-[13px] w-px shrink-0 bg-menu-divider"
                  aria-hidden="true"
                />
              </>
            )}

            <div
              className="flex min-w-0 shrink-0 items-center gap-[5px]"
              aria-label={
                isOpen ? "Restaurante aberto agora" : "Restaurante fechado"
              }
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
                      ? "bg-[#39a00a] shadow-[0_0_0_3px_rgba(57,160,10,0.12)]"
                      : "bg-gray-400 shadow-[0_0_0_3px_rgba(160,160,160,0.12)]"
                  }`}
                />
              </span>

              <span
                className={`whitespace-nowrap text-[11px] font-semibold leading-[1.35] tracking-[-0.22px] sm:text-xs ${
                  isOpen ? "text-[#137a13]" : "text-gray-500"
                }`}
              >
                {isOpen
                  ? "Aberto agora"
                  : nextOpenLabel
                    ? `Fechado · abrimos ${nextOpenLabel}`
                    : "Fechado"}
              </span>
            </div>

            {tableNumber != null && (
              <>
                <span
                  className="h-[13px] w-px bg-menu-divider"
                  aria-hidden="true"
                />
                <span className="whitespace-nowrap rounded-full bg-blue-100 px-1.5 py-0.5 text-[11px] font-semibold leading-[1.2] text-blue-700 sm:text-xs">
                  🍽️ Mesa {tableNumber}
                </span>
              </>
            )}
          </>
        )}
      </div>

      <div className="mt-[9px] h-px w-full bg-gradient-to-r from-menu-divider via-[rgba(64,57,57,0.05)] to-transparent" />

      {isHoursModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[3px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="store-hours-title"
          onClick={() => setIsHoursModalOpen(false)}
        >
          <style>{`
            @keyframes store-hours-modal-in {
              0% { opacity: 0; transform: translateY(14px) scale(.985); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          <div
            className="relative z-[10000] w-full max-w-[430px] overflow-hidden rounded-[30px] bg-white shadow-[0_28px_90px_rgba(0,0,0,0.26)]"
            style={{ animation: "store-hours-modal-in 180ms ease-out both" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-5 pb-4 pt-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2
                    id="store-hours-title"
                    className="text-[20px] font-extrabold leading-[1.08] tracking-[-0.55px] text-[#2F2A2A]"
                  >
                    Horários de funcionamento
                  </h2>

                  <p className="mt-1.5 max-w-[300px] text-[13px] font-medium leading-[1.38] tracking-[-0.18px] text-[#7A7373]">
                    Confira os dias e horários disponíveis para pedidos.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsHoursModalOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-[#574f4f] transition-colors hover:bg-[#EEEEEE] hover:text-[var(--menu-primary)] active:scale-95"
                  aria-label="Fechar horários"
                >
                  <svg
                    className="h-[17px] w-[17px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 6l12 12M18 6 6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-3 pb-3">
              <div className="overflow-hidden rounded-[24px] border border-[#EFEFEF] bg-[#FCFCFC]">
                {DEFAULT_OPENING_HOURS.map((item, index) => {
                  const isToday = index === todayOpeningHourIndex;

                  return (
                    <div
                      key={item.day}
                      className={`relative flex items-center justify-between gap-3 px-4 py-[13px] ${
                        index === DEFAULT_OPENING_HOURS.length - 1
                          ? ""
                          : "border-b border-[#F0F0F0]"
                      }`}
                    >
                      {isToday && (
                        <span
                          className="pointer-events-none absolute inset-0 bg-[var(--menu-primary)] opacity-[0.055]"
                          aria-hidden="true"
                        />
                      )}

                      <div className="relative z-10 flex min-w-0 items-center gap-2.5">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            isToday
                              ? "bg-[var(--menu-primary)]"
                              : "bg-[#D8D8D8]"
                          }`}
                          aria-hidden="true"
                        />

                        <span className="truncate text-[14px] font-bold leading-none tracking-[-0.22px] text-[#373030]">
                          {item.day}
                        </span>

                        {isToday && (
                          <span className="shrink-0 rounded-full border border-[var(--menu-primary)] px-2 py-[2px] text-[10px] font-extrabold leading-none text-[var(--menu-primary)]">
                            Hoje
                          </span>
                        )}
                      </div>

                      <span className="relative z-10 whitespace-nowrap text-[13px] font-semibold leading-none tracking-[-0.18px] text-[#615A5A]">
                        {item.hours}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 rounded-[18px] bg-[#F7F7F7] px-4 py-3">
                <p className="text-center text-[12px] font-medium leading-[1.4] tracking-[-0.16px] text-[#7A7373]">
                  Os horários podem mudar em feriados ou datas especiais.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
