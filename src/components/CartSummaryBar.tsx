import { ShoppingBag } from 'lucide-react'

interface Props {
  quantity: number
  total: number
  onClick: () => void
  /** Altura da navegação inferior para manter a barra colada logo acima dela. */
  bottomOffset?: number
}

function fmt(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function CartSummaryBar({ quantity, total, onClick, bottomOffset = 56 }: Props) {
  if (quantity <= 0) return null

  return (
    <aside
      className="fixed left-1/2 z-[51] w-full max-w-[768px] -translate-x-1/2"
      style={{ bottom: `${bottomOffset}px` }}
      aria-label="Resumo da sacola"
    >
      <button
        type="button"
        onClick={onClick}
        className="relative flex h-[54px] w-full items-center justify-between bg-[var(--menu-primary)] px-4 text-white shadow-[0_-5px_18px_rgba(47,39,23,0.12)] transition-[filter,transform] active:scale-[0.995] active:brightness-[0.97]"
        aria-label={`${quantity} ${quantity === 1 ? 'item' : 'itens'} na sacola. Ver sacola. Total ${fmt(total)}`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-start" aria-hidden="true">
          <ShoppingBag className="h-[23px] w-[23px] text-white" strokeWidth={2} />
        </span>

        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[14px] font-bold leading-none tracking-[0.1px] text-white">
          Ver sacola
        </span>

        <strong className="shrink-0 whitespace-nowrap text-right text-[14px] font-bold leading-none tracking-[-0.15px] text-white">
          {fmt(total)}
        </strong>
      </button>
    </aside>
  )
}
