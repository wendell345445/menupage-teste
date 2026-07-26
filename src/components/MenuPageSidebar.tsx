import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const MENU_PANDA_LOGO = "/menu-panda-logo.png";
const SYSTEM_VERSION = "v1.0.0";

const DEFAULT_OPENING_HOURS = [
  { day: "Segunda-feira", hours: "18:00 às 23:30" },
  { day: "Terça-feira", hours: "18:00 às 23:30" },
  { day: "Quarta-feira", hours: "18:00 às 23:30" },
  { day: "Quinta-feira", hours: "18:00 às 23:30" },
  { day: "Sexta-feira", hours: "18:00 às 00:00" },
  { day: "Sábado", hours: "18:00 às 00:00" },
  { day: "Domingo", hours: "18:00 às 23:00" },
];

type SidebarCategory = {
  id: string;
  name: string;
};

interface MenuPageSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeName: string;
  logo?: string | null;
  isOpen: boolean;
  address?: string | null;
  minimumOrder?: number | null;
  categories: SidebarCategory[];
  activeCategoryId: string | null;
  hasFeaturedProducts: boolean;
  cartQuantity: number;
  tableMode?: boolean;
  onGoHome: () => void;
  onGoHighlights: () => void;
  onCategorySelect: (categoryId: string) => void;
  onCartClick: () => void;
  onOrdersClick: () => void;
}

function getTodayOpeningHourIndex() {
  const weekDay = new Date().getDay();
  return weekDay === 0 ? 6 : weekDay - 1;
}

export function MenuPageSidebar({
  open,
  onOpenChange,
  address,
}: MenuPageSidebarProps) {
  const todayOpeningHourIndex = getTodayOpeningHourIndex();
  const displayAddress =
    address?.trim() ||
    "Av. Afonso Pena, 1377 - Centro, Belo Horizonte - MG, 30130-004";
  const mapsPreviewUrl = `https://www.google.com/maps?q=${encodeURIComponent(displayAddress)}&output=embed`;
  const mapsLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="z-[150] w-[305px] max-w-[86vw] gap-0 border-r border-black/10 bg-white p-0 font-sen text-[#2e2828] shadow-[18px_0_45px_rgba(0,0,0,0.18)]"
        style={{ left: "max(0px, calc((100vw - 768px) / 2))" }}
        aria-label="Informações do estabelecimento"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="relative flex min-h-[68px] items-center border-b border-black/5 px-5 py-4">
            <SheetTitle className="text-[17px] font-bold tracking-[-0.25px] text-[#2E2828]">
              Perfil loja
            </SheetTitle>

            <button
              type="button"
              aria-label="Recolher perfil da loja"
              onClick={() => onOpenChange(false)}
              className="absolute right-[-20px] top-[70px] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-transparent transition-transform duration-200 focus:outline-none focus-visible:outline-none focus-visible:ring-0 active:-translate-y-1/2 active:scale-95"
            >
              <img
                src="/icons-sidebar/side-bar.svg"
                alt=""
                aria-hidden="true"
                className="h-[40px] w-[40px] object-contain"
                style={{
                  filter:
                    "drop-shadow(1px 0 0 #fff) drop-shadow(-1px 0 0 #fff) drop-shadow(0 1px 0 #fff) drop-shadow(0 -1px 0 #fff)",
                }}
                draggable={false}
              />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <section aria-labelledby="sidebar-opening-hours-title">
              <h2
                id="sidebar-opening-hours-title"
                className="text-[14px] font-bold tracking-[-0.2px] text-[#343030]"
              >
                Horário de atendimento
              </h2>

              <div className="mt-3 space-y-[9px]">
                {DEFAULT_OPENING_HOURS.map((item, index) => {
                  const isToday = index === todayOpeningHourIndex;

                  return (
                    <div
                      key={item.day}
                      className="flex items-center justify-between gap-3"
                    >
                      <span
                        className={[
                          "truncate text-[12px] leading-[1.35]",
                          isToday
                            ? "font-bold text-[#393434]"
                            : "font-medium text-[#6F6868]",
                        ].join(" ")}
                      >
                        {item.day}
                      </span>

                      <span
                        className={[
                          "shrink-0 whitespace-nowrap text-[11px] leading-[1.35]",
                          isToday
                            ? "font-bold text-[#393434]"
                            : "font-medium text-[#6F6868]",
                        ].join(" ")}
                      >
                        {item.hours}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="my-5 h-px w-full bg-[#EEEEEE]" aria-hidden="true" />

            <section aria-labelledby="sidebar-payments-title">
              <h2
                id="sidebar-payments-title"
                className="text-[14px] font-bold tracking-[-0.2px] text-[#343030]"
              >
                Formas de pagamento
              </h2>

              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3">
                <PaymentMethod label="Pix" iconSrc="/icons-sidebar/pix.svg" />
                <PaymentMethod
                  label="Dinheiro"
                  iconSrc="/icons-sidebar/money.svg"
                />
                <PaymentMethod
                  label="Crédito"
                  iconSrc="/icons-sidebar/credit-card.svg"
                />
                <PaymentMethod
                  label="Débito"
                  iconSrc="/icons-sidebar/debitcard.svg"
                />
              </div>
            </section>

            <div className="my-5 h-px w-full bg-[#EEEEEE]" aria-hidden="true" />

            <section aria-labelledby="sidebar-address-title">
              <h2
                id="sidebar-address-title"
                className="text-[14px] font-bold tracking-[-0.2px] text-[#343030]"
              >
                Endereço
              </h2>

              <div className="relative mt-3 overflow-hidden rounded-[12px] border border-[#E8E8E8] bg-[#F3F3F3]">
                <iframe
                  title={`Mapa de ${displayAddress}`}
                  src={mapsPreviewUrl}
                  className="pointer-events-none block h-[132px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                <a
                  href={mapsLinkUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Abrir ${displayAddress} no Google Maps`}
                  className="absolute inset-0 transition-colors hover:bg-black/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black/20"
                />
              </div>

              <p className="mt-3 whitespace-pre-line text-[12px] font-medium leading-[1.55] tracking-[-0.1px] text-[#6F6868]">
                {displayAddress}
              </p>
            </section>
          </div>

          <div className="mt-auto border-t border-black/5 px-5 pb-5 pt-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9c9292]">
              Desenvolvido por
            </p>

            <img
              src={MENU_PANDA_LOGO}
              alt="Menu Panda"
              className="mx-auto mt-2 h-auto max-h-[34px] w-[116px] object-contain"
              loading="eager"
              draggable={false}
            />

            <p className="mt-2 text-[10px] font-semibold text-[#9c9292]">
              Versão {SYSTEM_VERSION}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface PaymentMethodProps {
  label: string;
  iconSrc: string;
}

function PaymentMethod({ label, iconSrc }: PaymentMethodProps) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <img
        src={iconSrc}
        alt=""
        aria-hidden="true"
        className="h-5 w-5 shrink-0 object-contain"
        loading="eager"
        draggable={false}
      />

      <span className="truncate text-[12px] font-semibold tracking-[-0.12px] text-[#625B5B]">
        {label}
      </span>
    </div>
  );
}
