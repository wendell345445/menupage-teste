import { ShoppingBag } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const THEME_BLUE = '#2563EB'
const HOME_ICON_SRC = '/home%202.svg'
const ORDERS_ICON_SRC = '/pedidos.svg'

interface Props {
  cartQuantity: number
  onCartClick: () => void
  /** Quando true, troca a aba "Pedidos" por "Comanda" (link /comanda). */
  tableMode?: boolean
}

export function BottomNavigation({ cartQuantity, onCartClick, tableMode = false }: Props) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isHome = pathname === '/'
  const ordersPath = tableMode ? '/comanda' : '/meus-pedidos'
  const isOrders = pathname.startsWith(ordersPath)

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[768px] -translate-x-1/2"
      style={{ height: 'calc(76px + env(safe-area-inset-bottom))' }}
      aria-label="Navegação inferior"
    >
      <div
        className="relative flex h-full w-full items-end justify-around rounded-t-[28px] px-1"
        style={{
          paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
          background: 'linear-gradient(180deg,rgba(255,255,255,0.75) 0%,rgba(255,255,255,0.97) 30%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 -1px 0 rgba(0,0,0,0.06), 0 -8px 40px rgba(0,0,0,0.08)',
        }}
      >
        <span
          className="absolute left-0 top-0 h-px w-full"
          style={{
            background:
              'linear-gradient(90deg, transparent 5%, rgba(37,99,235,0.22) 40%, rgba(37,99,235,0.22) 60%, transparent 95%)',
          }}
        />

        <NavItem
          label="Início"
          icon={<SvgMaskIcon src={HOME_ICON_SRC} />}
          active={isHome}
          onClick={() => navigate('/')}
        />

        <NavItem
          label="Carrinho"
          icon={<ShoppingBag className="h-[21px] w-[21px] text-[#2563EB]" strokeWidth={1.9} />}
          active={false}
          onClick={onCartClick}
          badge={cartQuantity > 0 ? cartQuantity : undefined}
        />

        <NavItem
          label={tableMode ? 'Comanda' : 'Pedidos'}
          icon={<SvgMaskIcon src={ORDERS_ICON_SRC} />}
          active={isOrders}
          onClick={() => navigate(ordersPath)}
        />
      </div>
    </nav>
  )
}

interface SvgMaskIconProps {
  src: string
}

function SvgMaskIcon({ src }: SvgMaskIconProps) {
  return (
    <span
      aria-hidden="true"
      className="block h-[22px] w-[22px] transition-opacity duration-200"
      style={{
        backgroundColor: THEME_BLUE,
        opacity: 1,
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  )
}

interface NavItemProps {
  label: string
  icon: React.ReactNode
  active: boolean
  onClick: () => void
  badge?: number
}

function NavItem({ label, icon, active, onClick, badge }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className="relative flex h-[58px] w-20 flex-col items-center justify-center gap-1 rounded-[20px] transition-all duration-200 active:scale-95"
      style={
        active
          ? {
              background: 'linear-gradient(160deg, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0.14) 100%)',
              boxShadow: '0 2px 16px rgba(37,99,235,0.10), inset 0 1px 0 rgba(255,255,255,0.8)',
            }
          : undefined
      }
    >
      {active && (
        <span
          className="absolute left-1/2 top-0 h-[3.5px] w-9 -translate-x-1/2 rounded-b-full bg-[#2563EB]"
          style={{ boxShadow: '0 1px 6px rgba(37,99,235,0.22)' }}
        />
      )}

      <div className="relative text-[#2563EB]">
        {icon}
        {badge != null && badge > 0 && (
          <span
            className="absolute -right-[7px] -top-[6px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#2563EB] px-[3px] text-[9px] font-bold text-white"
            style={{ boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}
          >
            {badge}
          </span>
        )}
      </div>

      <span className="text-[10px] font-semibold tracking-[0.1px] text-[#2563EB]">
        {label}
      </span>
    </button>
  )
}
