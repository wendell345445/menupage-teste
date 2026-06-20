import { mockMenuData } from '@/mocks/menu.mock'

export interface ProductVariation {
  id: string
  name: string
  price: number
  isActive: boolean
}

export interface ProductAddonLink {
  addon: {
    id: string
    name: string
    isActive: boolean
  }
}

export interface Product {
  id: string
  name: string
  description?: string | null
  imageUrl?: string | null
  basePrice: number | null
  promoPrice?: number | null
  variations: ProductVariation[]
  addons: ProductAddonLink[]

  /** Campos opcionais que podem vir do backend para alimentar "Destaques do Dia". */
  isFeatured?: boolean
  featured?: boolean
  isHighlight?: boolean
  highlight?: boolean
}

export interface MenuCategory {
  id: string
  name: string
  isActive: boolean
  products: Product[]
}

export interface MenuStore {
  name: string
  description?: string
  logo?: string | null
  primaryColor?: string | null
  secondaryColor?: string | null
  address?: string
  storeStatus: 'open' | 'closed' | 'suspended'
  nextOpenLabel?: string | null
  facebookPixelId?: string | null

  /** Variações possíveis de pedido mínimo aceitas pela tela. */
  minimumOrder?: number | string | null
  minimumOrderValue?: number | string | null
  minOrder?: number | string | null
  minOrderValue?: number | string | null
  orderMinimum?: number | string | null
  orderMinimumValue?: number | string | null
  deliveryMinimum?: number | string | null
  minDeliveryOrder?: number | string | null
  minimumDeliveryOrder?: number | string | null

  /** Usado no rodapé da sidebar. Pode ser substituído pela versão real do backend/app. */
  systemVersion?: string | null
}

export interface MenuData {
  store: MenuStore
  categories: MenuCategory[]
}

/**
 * Adapter front-end para o cardápio.
 *
 * Hoje retorna mock local para o projeto buildar/deployar sem backend.
 * Para ligar ao backend, substitua o corpo desta função por um fetch,
 * mantendo o retorno no formato `MenuData`.
 *
 * Exemplo futuro:
 *
 * const response = await fetch(`${import.meta.env.VITE_API_URL}/menus/${slug}`)
 * if (!response.ok) throw new Error('Não foi possível carregar o cardápio')
 * return response.json() as Promise<MenuData>
 */
export async function getMenuData(_slug: string | null): Promise<MenuData> {
  return mockMenuData
}
