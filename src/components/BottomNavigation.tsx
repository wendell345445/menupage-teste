import { ShoppingBag } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const THEME_COLOR = 'var(--menu-primary)'
const INACTIVE_COLOR = '#747474'
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
        className="relative flex h-full w-full items-end justify-around border-t border-[#f1f1f1] bg-white px-1"
        style={{
          paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
        }}
      >
        <NavItem
          label="Início"
          icon={<SvgMaskIcon src={HOME_ICON_SRC} active={isHome} />}
          active={isHome}
          onClick={() => navigate('/')}
        />

        <NavItem
          label="Carrinho"
          icon={
            <ShoppingBag
              className="h-[21px] w-[21px]"
              color={INACTIVE_COLOR}
              strokeWidth={1.9}
            />
          }
          active={false}
          onClick={onCartClick}
          badge={cartQuantity > 0 ? cartQuantity : undefined}
        />

        <NavItem
          label={tableMode ? 'Comanda' : 'Pedidos'}
          icon={<SvgMaskIcon src={ORDERS_ICON_SRC} active={isOrders} />}
          active={isOrders}
          onClick={() => navigate(ordersPath)}
        />
      </div>
    </nav>
  )
}

interface SvgMaskIconProps {
  src: string
  active: boolean
}

function SvgMaskIcon({ src, active }: SvgMaskIconProps) {
  return (
    <span
      aria-hidden="true"
      className="block h-[22px] w-[22px] transition-colors duration-200"
      style={{
        backgroundColor: active ? THEME_COLOR : INACTIVE_COLOR,
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
      className="relative flex h-[58px] w-20 flex-col items-center justify-center gap-1 transition-transform duration-200 active:scale-95"
    >
      {active && (
        <span className="absolute left-1/2 top-0 h-[2px] w-8 -translate-x-1/2 bg-[var(--menu-primary)]" />
      )}

      <div
        className="relative"
        style={{ color: active ? THEME_COLOR : INACTIVE_COLOR }}
      >
        {icon}
        {badge != null && badge > 0 && (
          <span className="absolute -right-[7px] -top-[6px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[var(--menu-primary)] px-[3px] text-[9px] font-bold text-white">
            {badge}
          </span>
        )}
      </div>

      <span
        className="text-[10px] font-semibold tracking-[0.1px] transition-colors duration-200"
        style={{ color: active ? THEME_COLOR : INACTIVE_COLOR }}
      >
        {label}
      </span>
    </button>
  )
}
