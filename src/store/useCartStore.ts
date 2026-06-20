import { useSyncExternalStore } from 'react'

interface CartAdditional {
  id?: string
  name?: string
  price?: number
}

interface CartItem {
  productId: string
  productName: string
  imageUrl?: string | null
  additionals: CartAdditional[]
  quantity: number
  unitPrice: number
}

interface CartState {
  storeSlug: string | null
  items: CartItem[]
  setStore: (slug: string) => void
  addItem: (item: CartItem) => void
  subtotal: () => number
}

let state: CartState
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function setState(partial: Partial<CartState>) {
  state = { ...state, ...partial }
  emit()
}

state = {
  storeSlug: null,
  items: [],
  setStore: (slug: string) => {
    if (state.storeSlug !== slug) setState({ storeSlug: slug })
  },
  addItem: (item: CartItem) => {
    const existing = state.items.find(
      (cartItem) =>
        cartItem.productId === item.productId &&
        cartItem.unitPrice === item.unitPrice &&
        cartItem.additionals.length === item.additionals.length
    )

    if (existing) {
      setState({
        items: state.items.map((cartItem) =>
          cartItem === existing
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        ),
      })
      return
    }

    setState({ items: [...state.items, item] })
  },
  subtotal: () => state.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useCartStore<T>(selector: (state: CartState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state)
  )
}
