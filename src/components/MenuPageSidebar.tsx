import type { ReactNode } from 'react'

import {
  Home,
  Medal,
  ReceiptText,
  ShoppingBag,
  Info,
  Wallet,
  X,
} from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import { resolveImageUrl } from '@/shared/lib/imageUrl'

const PUBLIC_FALLBACK_LOGO = '/burger-or-hamburger-logo-vintage-vector-Graphics-27222106-1.jpg'
const MENU_PANDA_LOGO = '/menu-panda-logo.png'
const SYSTEM_VERSION = 'v1.0.0'

type SidebarCategory = {
  id: string
  name: string
}

interface MenuPageSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  storeName: string
  logo?: string | null
  isOpen: boolean
  minimumOrder?: number | null
  categories: SidebarCategory[]
  activeCategoryId: string | null
  hasFeaturedProducts: boolean
  cartQuantity: number
  tableMode?: boolean
  onGoHome: () => void
  onGoHighlights: () => void
  onCategorySelect: (categoryId: string) => void
  onCartClick: () => void
  onOrdersClick: () => void
}

function getLogoImageUrl(url?: string | null): string {
  const displayUrl = url || PUBLIC_FALLBACK_LOGO
  const resolved = resolveImageUrl(displayUrl) ?? displayUrl

  if (!resolved.includes('cloudinary.com')) return resolved

  return resolved.replace('/upload/', '/upload/f_auto,w_180/')
}

function fmtBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function MenuPageSidebar({
  open,
  onOpenChange,
  storeName,
  logo,
  isOpen,
  minimumOrder,
  activeCategoryId,
  hasFeaturedProducts,
  cartQuantity,
  tableMode = false,
  onGoHome,
  onGoHighlights,
  onCartClick,
  onOrdersClick,
}: MenuPageSidebarProps) {
  const logoUrl = getLogoImageUrl(logo)

  const runAndClose = (callback: () => void) => {
    callback()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="z-[150] w-[305px] max-w-[86vw] gap-0 border-r border-black/10 bg-white p-0 font-sen text-[#2e2828] shadow-[18px_0_45px_rgba(0,0,0,0.18)]"
        style={{ left: 'max(0px, calc((100vw - 768px) / 2))' }}
        aria-label="Menu do cardápio"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="relative overflow-hidden border-b border-black/5 px-5 pb-5 pt-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/[0.045] to-transparent" />

            <div className="relative flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[16px] bg-white">
                  <img
                    src={logoUrl}
                    alt={storeName}
                    className="block h-full w-full object-cover object-center"
                    loading="eager"
                    draggable={false}
                  />
                </div>

                <div className="min-w-0">
                  <SheetTitle className="truncate font-sen text-[14px] font-bold leading-[1.25] tracking-[-0.25px] text-[#2e2828]">
                    {storeName}
                  </SheetTitle>

                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span
                      className={[
                        'inline-flex h-6 items-center gap-1.5 px-0 text-[10px] font-bold',
                        isOpen ? 'text-[#1f9f4a]' : 'text-[#d13f3f]',
                      ].join(' ')}
                    >
                      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                        {isOpen && (
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1f9f4a] opacity-60" />
                        )}
                        <span
                          className={[
                            'relative inline-flex h-2 w-2 rounded-full',
                            isOpen ? 'bg-[#1f9f4a]' : 'bg-[#d13f3f]',
                          ].join(' ')}
                        />
                      </span>
                      {isOpen ? 'Aberto agora' : 'Fechado'}
                    </span>

                    {minimumOrder != null && minimumOrder > 0 && (
                      <span className="inline-flex h-6 items-center gap-1 rounded-full bg-black/[0.04] px-2 text-[10px] font-bold text-[#574f4f]">
                        <Wallet className="h-3 w-3" strokeWidth={2.2} />
                        Mín. {fmtBRL(minimumOrder)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                aria-label="Fechar menu"
                onClick={() => onOpenChange(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform hover:bg-black/90 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:scale-95"
              >
                <X className="h-[17px] w-[17px]" strokeWidth={2.4} />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="space-y-1.5">
              <SidebarAction
                icon={<Home className="h-[18px] w-[18px]" strokeWidth={2.2} />}
                label="Início"
                active={activeCategoryId === null}
                onClick={() => runAndClose(onGoHome)}
              />

              {hasFeaturedProducts && (
                <SidebarAction
                  icon={<Medal className="h-[18px] w-[18px]" strokeWidth={2.2} />}
                  label="Destaques do Dia"
                  active={false}
                  onClick={() => runAndClose(onGoHighlights)}
                />
              )}

              <SidebarAction
                icon={<ShoppingBag className="h-[18px] w-[18px]" strokeWidth={2.2} />}
                label="Carrinho"
                active={false}
                badge={cartQuantity > 0 ? cartQuantity : undefined}
                onClick={() => runAndClose(onCartClick)}
              />

              <SidebarAction
                icon={<ReceiptText className="h-[18px] w-[18px]" strokeWidth={2.2} />}
                label={tableMode ? 'Comanda' : 'Meus pedidos'}
                active={false}
                onClick={() => runAndClose(onOrdersClick)}
              />

              <SidebarAction
                icon={<Info className="h-[18px] w-[18px]" strokeWidth={2.2} />}
                label="Sobre nós"
                active={false}
                onClick={() => onOpenChange(false)}
              />
            </div>

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
  )
}

interface SidebarActionProps {
  icon?: ReactNode
  label: string
  active?: boolean
  badge?: number
  onClick: () => void
}

function SidebarAction({ icon, label, active = false, badge, onClick }: SidebarActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group flex min-h-[43px] w-full items-center justify-between gap-3 rounded-[16px] px-3 text-left transition-all active:scale-[0.99]',
        active
          ? 'bg-black text-white shadow-[0_8px_20px_rgba(0,0,0,0.14)]'
          : 'bg-transparent text-[#574f4f] hover:bg-black/[0.045]',
      ].join(' ')}
    >
      <span className="flex min-w-0 items-center gap-3">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate text-[14px] font-bold tracking-[-0.18px]">{label}</span>
      </span>

      {badge != null && badge > 0 && (
        <span
          className={[
            'flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-black',
            active ? 'bg-white text-black' : 'bg-black text-white',
          ].join(' ')}
        >
          {badge}
        </span>
      )}
    </button>
  )
}
