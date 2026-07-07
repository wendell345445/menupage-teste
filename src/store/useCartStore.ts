import { useSyncExternalStore } from 'react'

interface CartAdditional {
  id?: string
  name?: string
  price?: number
  groupId?: string
  groupName?: string
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

function normalizeAdditionalSignature(additional: CartAdditional) {
  return [
    additional.groupId ?? '',
    additional.id ?? '',
    additional.name ?? '',
    additional.price ?? 0,
  ].join(':')
}

function getCartItemSignature(item: CartItem) {
  return [
    item.productId,
    item.unitPrice,
    ...item.additionals.map(normalizeAdditionalSignature).sort(),
  ].join('|')
}

state = {
  storeSlug: null,
  items: [],
  setStore: (slug: string) => {
    if (state.storeSlug !== slug) setState({ storeSlug: slug })
  },
  addItem: (item: CartItem) => {
    const incomingSignature = getCartItemSignature(item)
    const existing = state.items.find(
      (cartItem) => getCartItemSignature(cartItem) === incomingSignature
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
