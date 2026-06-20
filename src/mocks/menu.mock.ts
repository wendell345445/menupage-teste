import type { MenuData } from '@/services/menu.service'

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=500&q=80`

/**
 * Dados fake para preview front-end.
 *
 * O projeto não depende de backend para rodar/buildar na Vercel.
 * Quando o backend estiver pronto, substitua o adapter em
 * `src/services/menu.service.ts` mantendo o mesmo contrato `MenuData`.
 */
export const mockMenuData: MenuData = {
  store: {
    name: 'Menu Panda Burger',
    description: 'Cardápio digital de demonstração para editar a aparência real da MenuPage.',
    logo: null,
    primaryColor: '#2563EB',
    secondaryColor: '#1D4ED8',
    address: 'Rua das Palmeiras, 120 - Centro\nSalinas - MG',
    storeStatus: 'open',
    nextOpenLabel: null,
    facebookPixelId: null,
    minimumOrder: 20,
    systemVersion: 'v1.0.0-front',
  },
  categories: [
    {
      id: 'burgers',
      name: 'Burgers Artesanais',
      isActive: true,
      products: [
        {
          id: 'classic-burger',
          name: 'Classic Burger',
          description: 'Pão brioche, blend bovino, queijo cheddar, alface, tomate e molho especial.',
          imageUrl: img('photo-1568901346375-23c9450c58cd'),
          basePrice: 29.9,
          promoPrice: null,
          variations: [],
          addons: [],
          isFeatured: true,
        },
        {
          id: 'double-bacon',
          name: 'Double Bacon',
          description: 'Dois blends, bacon crocante, cheddar duplo e maionese da casa.',
          imageUrl: img('photo-1550547660-d9450f859349'),
          basePrice: 39.9,
          promoPrice: 34.9,
          variations: [],
          addons: [],
          isFeatured: true,
        },
        {
          id: 'smash-house',
          name: 'Smash House',
          description: 'Smash burger com cebola caramelizada, queijo prato e molho levemente defumado.',
          imageUrl: img('photo-1594212699903-ec8a3eca50f5'),
          basePrice: 24.9,
          promoPrice: null,
          variations: [],
          addons: [
            { addon: { id: 'extra-cheese', name: 'Queijo extra', isActive: true } },
          ],
          isFeatured: true,
        },
        {
          id: 'cheddar-blue',
          name: 'Cheddar Blue',
          description: 'Blend suculento, cheddar cremoso, cebola crispy e molho barbecue artesanal.',
          imageUrl: img('photo-1551782450-a2132b4ba21d'),
          basePrice: 32.9,
          promoPrice: 29.9,
          variations: [],
          addons: [],
          isFeatured: true,
        },
        {
          id: 'crispy-chicken',
          name: 'Crispy Chicken',
          description: 'Frango crocante, queijo, alface americana e maionese temperada da casa.',
          imageUrl: img('photo-1571091718767-18b5b1457add'),
          basePrice: 27.9,
          promoPrice: null,
          variations: [],
          addons: [],
          isFeatured: true,
        },
        {
          id: 'batata-loaded',
          name: 'Batata Loaded',
          description: 'Batata frita crocante com cheddar, bacon, molho especial e finalização da casa.',
          imageUrl: img('photo-1573080496219-bb080dd4f877'),
          basePrice: 22.9,
          promoPrice: 19.9,
          variations: [],
          addons: [],
          isFeatured: true,
        },
      ],
    },
    {
      id: 'pizzas',
      name: 'Pizzas',
      isActive: true,
      products: [
        {
          id: 'pizza-calabresa',
          name: 'Pizza Calabresa',
          description: 'Calabresa fatiada, cebola, muçarela, molho de tomate e orégano.',
          imageUrl: img('photo-1565299624946-b28f40a0ae38'),
          basePrice: null,
          promoPrice: null,
          variations: [
            { id: 'p', name: 'Pequena', price: 39.9, isActive: true },
            { id: 'g', name: 'Grande', price: 59.9, isActive: true },
          ],
          addons: [],
          isFeatured: true,
        },
        {
          id: 'pizza-frango',
          name: 'Pizza Frango com Catupiry',
          description: 'Frango desfiado, catupiry, milho, muçarela e orégano.',
          imageUrl: img('photo-1513104890138-7c749659a591'),
          basePrice: null,
          promoPrice: null,
          variations: [
            { id: 'p', name: 'Pequena', price: 42.9, isActive: true },
            { id: 'g', name: 'Grande', price: 64.9, isActive: true },
          ],
          addons: [],
        },
        {
          id: 'pizza-margherita',
          name: 'Pizza Margherita',
          description: 'Molho artesanal, muçarela, tomate, manjericão fresco e azeite especial.',
          imageUrl: img('photo-1548369937-47519962c11a'),
          basePrice: null,
          promoPrice: null,
          variations: [
            { id: 'p', name: 'Pequena', price: 37.9, isActive: true },
            { id: 'g', name: 'Grande', price: 57.9, isActive: true },
          ],
          addons: [],
          isFeatured: true,
        },
      ],
    },
    {
      id: 'bebidas',
      name: 'Bebidas',
      isActive: true,
      products: [
        {
          id: 'coca-lata',
          name: 'Coca-Cola Lata',
          description: 'Refrigerante gelado 350ml.',
          imageUrl: img('photo-1622483767028-3f66f32aef97'),
          basePrice: 6.9,
          promoPrice: null,
          variations: [],
          addons: [],
        },
        {
          id: 'suco-laranja',
          name: 'Suco Natural de Laranja',
          description: 'Suco natural feito na hora, 500ml.',
          imageUrl: img('photo-1621506289937-a8e4df240d0b'),
          basePrice: 9.9,
          promoPrice: null,
          variations: [],
          addons: [],
          isFeatured: true,
        },
        {
          id: 'milkshake-chocolate',
          name: 'Milkshake Chocolate',
          description: 'Milkshake cremoso de chocolate com calda e chantilly.',
          imageUrl: img('photo-1572490122747-3968b75cc699'),
          basePrice: 15.9,
          promoPrice: 13.9,
          variations: [],
          addons: [],
        },
      ],
    },
  ],
}
