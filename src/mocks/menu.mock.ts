import type { MenuData } from "@/services/menu.service";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=500&q=80`;

/**
 * Dados fake para preview front-end.
 *
 * O projeto não depende de backend para rodar/buildar na Vercel.
 * Quando o backend estiver pronto, substitua o adapter em
 * `src/services/menu.service.ts` mantendo o mesmo contrato `MenuData`.
 */
export const mockMenuData: MenuData = {
  store: {
    name: "Menu Panda Burger",
    description:
      "Cardápio digital de demonstração para editar a aparência real da MenuPage.",
    logo: null,
    primaryColor: "#EBA320",
    secondaryColor: "#C98514",
    address: "Rua das Palmeiras, 120 - Centro\nSalinas - MG",
    storeStatus: "open",
    nextOpenLabel: null,
    facebookPixelId: null,
    minimumOrder: 20,
    systemVersion: "v1.0.0-front",
  },
  categories: [
    {
      id: "burgers",
      name: "Burgers Artesanais",
      isActive: true,
      products: [
        {
          id: "classic-burger",
          name: "Classic Burger",
          description:
            "Pão brioche, blend bovino, queijo cheddar, alface, tomate e molho especial.",
          imageUrl: img("photo-1568901346375-23c9450c58cd"),
          basePrice: 29.9,
          promoPrice: null,
          variations: [],
          addons: [],
          isFeatured: true,
        },
        {
          id: "double-bacon",
          name: "Double Bacon",
          description:
            "Dois blends, bacon crocante, cheddar duplo e maionese da casa.",
          imageUrl: img("photo-1550547660-d9450f859349"),
          basePrice: 39.9,
          promoPrice: 34.9,
          variations: [],
          addons: [],
          isFeatured: true,
        },
        {
          id: "smash-house",
          name: "Smash House",
          description:
            "Smash burger com cebola caramelizada, queijo prato e molho levemente defumado.",
          imageUrl: img("photo-1594212699903-ec8a3eca50f5"),
          basePrice: 24.9,
          promoPrice: null,
          variations: [],
          addons: [
            {
              addon: {
                id: "extra-cheese",
                name: "Queijo extra",
                isActive: true,
              },
            },
          ],
          isFeatured: true,
        },
      ],
    },
    {
      id: "pizzas",
      name: "Pizzas",
      isActive: true,
      products: [
        {
          id: "pizza-grande-2-sabores",
          name: "Pizza (Grande) 8 pedaços",
          description:
            "A pizza portuguesa é um clássico brasileiro criado por padeiros de origem lusa, com ingredientes fartos e massa artesanal.",
          imageUrl: "/product-page/pizza-portuguesa.png",
          basePrice: null,
          promoPrice: null,
          variations: [],
          addons: [],
          isFeatured: true,
          optionGroups: [
            {
              id: "sabores-grande",
              title: "Pizzas (Grande)",
              helperText: "Escolha até 2 opções",
              required: true,
              min: 1,
              max: 2,
              selectionType: "checkbox",
              pricingStrategy: "highest",
              options: [
                {
                  id: "a-moda-da-casa",
                  name: "Á Moda da casa",
                  price: 49.99,
                  description:
                    "Molho de tomate, mussarela e ingredientes selecionados. Sabor artesanal para combinar com sua pizza.",
                  imageUrl: "/product-page/adicionais-3.png",
                  isActive: true,
                },
                {
                  id: "frango-catupiry",
                  name: "Frango Catupiry",
                  price: 49.99,
                  description:
                    "Molho de tomate, mussarela e ingredientes selecionados. Sabor artesanal para combinar com sua pizza.",
                  imageUrl: "/product-page/frango-catupiry.png",
                  isActive: true,
                },
                {
                  id: "calabresa",
                  name: "Calabresa",
                  price: 49.99,
                  description:
                    "Molho de tomate, mussarela e ingredientes selecionados. Sabor artesanal para combinar com sua pizza.",
                  imageUrl: "/product-page/adicionais-3.png",
                  isActive: true,
                },
                {
                  id: "portuguesa",
                  name: "Portuguesa",
                  price: 52.99,
                  description:
                    "Presunto, ovos, cebola, ervilha, mussarela e molho de tomate artesanal.",
                  imageUrl: "/product-page/pizza-portuguesa.png",
                  isActive: true,
                },
                {
                  id: "quatro-queijos",
                  name: "Quatro Queijos",
                  price: 54.99,
                  description:
                    "Mussarela, provolone, parmesão e catupiry em uma combinação cremosa.",
                  imageUrl: "/product-page/adicionais-1.png",
                  isActive: true,
                },
                {
                  id: "marguerita",
                  name: "Marguerita",
                  price: 51.99,
                  description:
                    "Mussarela, tomate, manjericão fresco e molho especial da casa.",
                  imageUrl: "/product-page/pizza-portuguesa.png",
                  isActive: true,
                },
                {
                  id: "pepperoni",
                  name: "Pepperoni",
                  price: 56.99,
                  description:
                    "Pepperoni fatiado, mussarela especial e toque levemente picante.",
                  imageUrl: "/product-page/adicionais-3.png",
                  isActive: true,
                },
              ],
            },
            {
              id: "borda-recheada",
              title: "Qual sabor da borda?",
              helperText: "Escolha 1 opção",
              required: true,
              min: 1,
              max: 1,
              selectionType: "radio",
              pricingStrategy: "sum",
              options: [
                {
                  id: "catupiry-borda",
                  name: "Catupiry",
                  price: 9.99,
                  description:
                    "Borda recheada preparada com massa artesanal e recheio cremoso.",
                  isActive: true,
                },
                {
                  id: "cheddar-borda",
                  name: "Cheddar",
                  price: 9.99,
                  description:
                    "Borda recheada preparada com massa artesanal e recheio cremoso.",
                  isActive: true,
                },
                {
                  id: "calabresa-borda",
                  name: "Calabresa",
                  price: 11.99,
                  description:
                    "Borda recheada preparada com massa artesanal e recheio cremoso.",
                  isActive: true,
                },
                {
                  id: "cream-cheese-borda",
                  name: "Cream Cheese",
                  price: 12.99,
                  description:
                    "Borda recheada preparada com massa artesanal e recheio cremoso.",
                  isActive: true,
                },
                {
                  id: "chocolate-borda",
                  name: "Chocolate",
                  price: 13.99,
                  description:
                    "Borda doce recheada com chocolate cremoso para finalizar com contraste especial.",
                  isActive: true,
                },
              ],
            },
            {
              id: "order-bump-bebidas",
              title: "Que tal uma bebida?",
              helperText: "Adicione uma bebida ao pedido",
              required: false,
              min: 0,
              selectionType: "checkbox",
              pricingStrategy: "sum",
              options: [
                {
                  id: "coca-cola-lata",
                  name: "Coca-Cola Lata 350ml",
                  price: 6.9,
                  description: "Bebida gelada para acompanhar o pedido.",
                  imageUrl: "/product-page/bebida-coca-cola.png",
                  isActive: true,
                },
                {
                  id: "guarana-lata",
                  name: "Guaraná Antarctica 350ml",
                  price: 6.9,
                  description: "Bebida gelada para acompanhar o pedido.",
                  imageUrl: "/product-page/bebida-guarana.png",
                  isActive: true,
                },
                {
                  id: "suco-laranja-500ml",
                  name: "Suco de Laranja 500ml",
                  price: 9.9,
                  description: "Suco natural gelado para acompanhar a pizza.",
                  imageUrl: "/product-page/bebida-suco-laranja.png",
                  isActive: true,
                },
                {
                  id: "agua-mineral",
                  name: "Água Mineral 500ml",
                  price: 4.9,
                  description:
                    "Água mineral gelada, opção leve para acompanhar o pedido.",
                  imageUrl: "/product-page/bebida-agua-mineral.png",
                  isActive: true,
                },
              ],
            },
          ],
        },
        {
          id: "pizza-calabresa",
          name: "Pizza Calabresa",
          description:
            "Calabresa fatiada, cebola, muçarela, molho de tomate e orégano.",
          imageUrl: img("photo-1565299624946-b28f40a0ae38"),
          basePrice: null,
          promoPrice: null,
          variations: [
            { id: "p", name: "Pequena", price: 39.9, isActive: true },
            { id: "g", name: "Grande", price: 59.9, isActive: true },
          ],
          addons: [],
        },
        {
          id: "pizza-frango",
          name: "Pizza Frango com Catupiry",
          description: "Frango desfiado, catupiry, milho, muçarela e orégano.",
          imageUrl: "/product-page/frango-catupiry.png",
          basePrice: null,
          promoPrice: null,
          variations: [
            { id: "p", name: "Pequena", price: 42.9, isActive: true },
            { id: "g", name: "Grande", price: 64.9, isActive: true },
          ],
          addons: [],
        },
      ],
    },
    {
      id: "bebidas",
      name: "Bebidas",
      isActive: true,
      products: [
        {
          id: "coca-lata",
          name: "Coca-Cola Lata",
          description: "Refrigerante gelado 350ml.",
          imageUrl: "/product-page/bebida-coca-cola.png",
          basePrice: 6.9,
          promoPrice: null,
          variations: [],
          addons: [],
        },
        {
          id: "suco-laranja",
          name: "Suco Natural de Laranja",
          description: "Suco natural feito na hora, 500ml.",
          imageUrl: "/product-page/bebida-suco-laranja.png",
          basePrice: 9.9,
          promoPrice: null,
          variations: [],
          addons: [],
        },
        {
          id: "guarana-lata",
          name: "Guaraná Antarctica Lata",
          description: "Refrigerante gelado 350ml.",
          imageUrl: "/product-page/bebida-guarana.png",
          basePrice: 6.9,
          promoPrice: null,
          variations: [],
          addons: [],
        },
        {
          id: "agua-mineral-500ml",
          name: "Água Mineral 500ml",
          description: "Água mineral gelada.",
          imageUrl: "/product-page/bebida-agua-mineral.png",
          basePrice: 4.9,
          promoPrice: null,
          variations: [],
          addons: [],
        },
      ],
    },
  ],
};
