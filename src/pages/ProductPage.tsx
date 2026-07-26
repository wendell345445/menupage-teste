import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useMenu } from "@/hooks/useMenu";
import { useStoreSlug } from "@/hooks/useStoreSlug";
import { resolveImageUrl } from "@/shared/lib/imageUrl";
import type {
  Product,
  ProductOption,
  ProductOptionGroup,
} from "@/services/menu.service";
import { useCartStore } from "@/store/useCartStore";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";

type PizzaOptionView = {
  id: string;
  name: string;
  priceValue: number;
  price: string;
  description: string;
  image: string | null;
};

type BorderOptionView = {
  id: string;
  name: string;
  priceValue: number;
  price: string;
  description: string;
};

type OrderBumpOptionView = BorderOptionView & {
  image: string | null;
};

const fallbackPizzaDescription =
  "Molho de tomate, mussarela e ingredientes selecionados. Sabor artesanal para combinar com sua pizza.";

const fallbackBorderDescription =
  "Borda recheada preparada com massa artesanal e recheio cremoso.";
const fallbackDrinkDescription =
  "Bebida gelada para acompanhar o pedido e aumentar a experiência do combo.";

const fallbackProduct = {
  id: "pizza-grande-2-sabores",
  name: "Pizza (Grande) 8 pedaços",
  description:
    "A pizza portuguesa é um clássico brasileiro criado por padeiros de origem lusa, e não um prato tradicional de Portugal.",
  imageUrl: "/product-page/pizza-portuguesa.png",
  basePrice: 49.99,
};

const fallbackPizzaOptions: PizzaOptionView[] = [
  {
    id: "a-moda-da-casa",
    name: "Á Moda da casa",
    priceValue: 49.99,
    price: "+ R$ 49,99",
    description: fallbackPizzaDescription,
    image: "/product-page/adicionais-3.png",
  },
  {
    id: "frango-catupiry",
    name: "Frango Catupiry",
    priceValue: 49.99,
    price: "+ R$ 49,99",
    description: fallbackPizzaDescription,
    image: "/product-page/frango-catupiry.png",
  },
  {
    id: "calabresa",
    name: "Calabresa",
    priceValue: 49.99,
    price: "+ R$ 49,99",
    description: fallbackPizzaDescription,
    image: "/product-page/adicionais-3.png",
  },
  {
    id: "portuguesa",
    name: "Portuguesa",
    priceValue: 52.99,
    price: "+ R$ 52,99",
    description:
      "Presunto, ovos, cebola, ervilha, mussarela e molho de tomate artesanal.",
    image: "/product-page/pizza-portuguesa.png",
  },
  {
    id: "quatro-queijos",
    name: "Quatro Queijos",
    priceValue: 54.99,
    price: "+ R$ 54,99",
    description:
      "Mussarela, provolone, parmesão e catupiry em uma combinação cremosa.",
    image: null,
  },
  {
    id: "marguerita",
    name: "Marguerita",
    priceValue: 51.99,
    price: "+ R$ 51,99",
    description:
      "Mussarela, tomate, manjericão fresco e molho especial da casa.",
    image: "/product-page/pizza-portuguesa.png",
  },
  {
    id: "pepperoni",
    name: "Pepperoni",
    priceValue: 56.99,
    price: "+ R$ 56,99",
    description:
      "Pepperoni fatiado, mussarela especial e toque levemente picante.",
    image: "/product-page/adicionais-3.png",
  },
];

const fallbackBorderOptions: BorderOptionView[] = [
  {
    id: "catupiry-borda",
    name: "Catupiry",
    priceValue: 9.99,
    price: "+ R$ 9,99",
    description: fallbackBorderDescription,
  },
  {
    id: "cheddar-borda",
    name: "Cheddar",
    priceValue: 9.99,
    price: "+ R$ 9,99",
    description: fallbackBorderDescription,
  },
  {
    id: "calabresa-borda",
    name: "Calabresa",
    priceValue: 11.99,
    price: "+ R$ 11,99",
    description: fallbackBorderDescription,
  },
  {
    id: "cream-cheese-borda",
    name: "Cream Cheese",
    priceValue: 12.99,
    price: "+ R$ 12,99",
    description: fallbackBorderDescription,
  },
  {
    id: "chocolate-borda",
    name: "Chocolate",
    priceValue: 13.99,
    price: "+ R$ 13,99",
    description:
      "Borda doce recheada com chocolate cremoso para finalizar com contraste especial.",
  },
];

const fallbackOrderBumpOptions: OrderBumpOptionView[] = [
  {
    id: "coca-cola-lata",
    name: "Coca-Cola Lata 350ml",
    priceValue: 6.9,
    price: "+ R$ 6,90",
    description: fallbackDrinkDescription,
    image: "/product-page/bebida-coca-cola.png",
  },
  {
    id: "guarana-lata",
    name: "Guaraná Antarctica 350ml",
    priceValue: 6.9,
    price: "+ R$ 6,90",
    description: fallbackDrinkDescription,
    image: "/product-page/bebida-guarana.png",
  },
  {
    id: "suco-laranja-500ml",
    name: "Suco de Laranja 500ml",
    priceValue: 9.9,
    price: "+ R$ 9,90",
    description: "Suco natural gelado para acompanhar a pizza.",
    image: "/product-page/bebida-suco-laranja.png",
  },
  {
    id: "agua-mineral",
    name: "Água Mineral 500ml",
    priceValue: 4.9,
    price: "+ R$ 4,90",
    description: "Água mineral gelada, opção leve para acompanhar o pedido.",
    image: "/product-page/bebida-agua-mineral.png",
  },
];

function fmtBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtOptionPrice(value?: number | null) {
  const numericValue = value ?? 0;
  return `+ ${fmtBRL(numericValue)}`;
}

function resolvePublicImage(url?: string | null) {
  if (!url) return null;
  return resolveImageUrl(url) ?? url;
}

function getActiveOptions(group?: ProductOptionGroup | null) {
  return group?.options.filter((option) => option.isActive !== false) ?? [];
}

function cleanDescription(
  value?: string | null,
  fallback = fallbackPizzaDescription,
) {
  return value?.trim() || fallback;
}

function toPizzaOptionView(option: ProductOption): PizzaOptionView {
  return {
    id: option.id,
    name: option.name,
    priceValue: option.price ?? 0,
    price: fmtOptionPrice(option.price),
    description: cleanDescription(option.description, fallbackPizzaDescription),
    image: resolvePublicImage(option.imageUrl),
  };
}

function toBorderOptionView(option: ProductOption): BorderOptionView {
  return {
    id: option.id,
    name: option.name,
    priceValue: option.price ?? 0,
    price: fmtOptionPrice(option.price),
    description: cleanDescription(
      option.description,
      fallbackBorderDescription,
    ),
  };
}

function toOrderBumpOptionView(option: ProductOption): OrderBumpOptionView {
  return {
    id: option.id,
    name: option.name,
    priceValue: option.price ?? 0,
    price: fmtOptionPrice(option.price),
    description: cleanDescription(option.description, fallbackDrinkDescription),
    image: resolvePublicImage(option.imageUrl),
  };
}

function getProductById(data: ReturnType<typeof useMenu>["data"], id?: string) {
  if (!data || !id) return null;

  return (
    data.categories
      .flatMap((category) => category.products)
      .find((item) => item.id === id) ?? null
  );
}

function getBasePrice(product: Product | null) {
  if (!product) return 0;
  if (product.promoPrice != null) return product.promoPrice;
  if (product.basePrice != null) return product.basePrice;
  return 0;
}

function getProductStartingPrice(product: Product | null) {
  if (!product) return fallbackProduct.basePrice;

  const activeVariationPrices = product.variations
    .filter((variation) => variation.isActive && variation.price != null)
    .map((variation) => variation.price);

  if (activeVariationPrices.length > 0) {
    return Math.min(...activeVariationPrices);
  }

  if (product.basePrice != null) {
    const hasPromo =
      product.promoPrice != null && product.promoPrice < product.basePrice;

    return hasPromo ? product.promoPrice! : product.basePrice;
  }

  const groups = product.optionGroups ?? [];
  const hasActivePricedOptions = (group: ProductOptionGroup) =>
    group.options.some(
      (option) => option.isActive !== false && option.price != null,
    );
  const priceGroup =
    groups.find(
      (group) =>
        group.pricingStrategy === "highest" && hasActivePricedOptions(group),
    ) ??
    groups.find(
      (group) =>
        (group.required || (group.min ?? 0) > 0) &&
        hasActivePricedOptions(group),
    );
  const activeOptionPrices =
    priceGroup?.options
      .filter((option) => option.isActive !== false && option.price != null)
      .map((option) => option.price) ?? [];

  return activeOptionPrices.length > 0
    ? Math.min(...activeOptionPrices)
    : null;
}

function hasActiveProductPromo(product: Product | null) {
  if (!product || product.variations.some((variation) => variation.isActive)) {
    return false;
  }

  return (
    product.basePrice != null &&
    product.promoPrice != null &&
    product.promoPrice < product.basePrice
  );
}

function shouldShowStartingFrom(product: Product | null) {
  if (!product) return true;

  if (product.variations.some((variation) => variation.isActive)) {
    return true;
  }

  return (
    product.basePrice == null &&
    Boolean(
      product.optionGroups?.some(
        (group) =>
          group.pricingStrategy === "highest" &&
          group.options.some(
            (option) => option.isActive !== false && option.price != null,
          ),
      ),
    )
  );
}

function useProductScreenData(product: Product | null) {
  return useMemo(() => {
    const groups = product?.optionGroups ?? [];
    const pizzaGroup = groups[0];
    const borderGroup = groups[1];
    const orderBumpGroup = groups[2];
    const pizzaOptions = getActiveOptions(pizzaGroup).map(toPizzaOptionView);
    const borderOptions = getActiveOptions(borderGroup).map(toBorderOptionView);
    const orderBumpOptions = getActiveOptions(orderBumpGroup).map(
      toOrderBumpOptionView,
    );
    const hasActivePromo = hasActiveProductPromo(product);

    return {
      productId: product?.id || fallbackProduct.id,
      productTitle: product?.name || fallbackProduct.name,
      productDescription: cleanDescription(
        product?.description,
        fallbackProduct.description,
      ),
      productImage: resolvePublicImage(product?.imageUrl),
      basePrice: getBasePrice(product),
      displayPrice: getProductStartingPrice(product),
      originalPrice: hasActivePromo ? product?.basePrice ?? null : null,
      hasActivePromo,
      showStartingFrom: shouldShowStartingFrom(product),
      pizzaGroupTitle: pizzaGroup?.title || "Pizzas (Grande)",
      pizzaGroupHelper: pizzaGroup?.helperText || "Escolha até 2 opções",
      pizzaMax: pizzaGroup?.max ?? 2,
      pizzaPricingStrategy: pizzaGroup?.pricingStrategy ?? "highest",
      pizzaOptions:
        pizzaOptions.length > 0 ? pizzaOptions : fallbackPizzaOptions,
      borderGroupTitle: borderGroup?.title || "Qual sabor da borda?",
      borderGroupHelper: borderGroup?.helperText || "Escolha 1 opção",
      borderOptions:
        borderOptions.length > 0 ? borderOptions : fallbackBorderOptions,
      orderBumpGroupTitle: orderBumpGroup?.title || "Que tal uma bebida?",
      orderBumpGroupHelper:
        orderBumpGroup?.helperText || "Adicione uma bebida ao pedido",
      orderBumpOptions:
        orderBumpOptions.length > 0
          ? orderBumpOptions
          : fallbackOrderBumpOptions,
    };
  }, [product]);
}

function RequiredBadge() {
  return (
    <span className="inline-flex min-h-[21px] items-center justify-center rounded-[7px] bg-[#2E2F31] px-2.5 py-1 text-[11px] font-normal leading-none text-white">
      Obrigatório
    </span>
  );
}

function CountBadge({ current, total }: { current: number; total: number }) {
  return (
    <span className="inline-flex min-h-[21px] items-center justify-center rounded-[7px] bg-white px-2.5 py-1 text-[11px] font-normal leading-none text-[#4b4b4b]">
      {current} de {total}
    </span>
  );
}

function CompletedBadge() {
  return (
    <span className="inline-flex min-h-[21px] items-center justify-center rounded-[7px] bg-[#07a028] px-2.5 py-1 text-[11px] font-normal leading-none text-white">
      Concluído
    </span>
  );
}

function OptionalBadge() {
  return (
    <span className="inline-flex min-h-[21px] items-center justify-center rounded-[7px] bg-white px-2.5 py-1 text-[11px] font-normal leading-none text-[#2E2F31]">
      Opcional
    </span>
  );
}

function SelectedItemsBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex min-h-[21px] items-center justify-center rounded-[7px] bg-[#000000] px-2.5 py-1 text-[11px] font-bold leading-none text-white">
      {count === 1 ? "1 item" : `${count} itens`}
    </span>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <span
      className={`menu-page-product-shimmer block rounded-[7px] bg-[#ECECEC] ${className}`}
      aria-hidden="true"
    />
  );
}

function ProductPageSkeleton() {
  const optionRows = Array.from({ length: 4 });
  const borderRows = Array.from({ length: 3 });
  const drinkRows = Array.from({ length: 3 });

  return (
    <main
      className="fixed inset-0 h-[100svh] w-full overflow-hidden bg-white font-sen tracking-wide text-[#2E2F31] antialiased"
      aria-label="Carregando produto"
      aria-busy="true"
    >
      <style>{`
        @keyframes menuPageProductShimmer {
          0% { background-position: -260px 0; }
          100% { background-position: 260px 0; }
        }

        .menu-page-product-shimmer {
          background-image: linear-gradient(90deg, #ECECEC 0%, #F7F7F7 48%, #ECECEC 100%);
          background-size: 260px 100%;
          animation: menuPageProductShimmer 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="mx-auto flex h-full w-full max-w-[768px] flex-col overflow-y-auto overscroll-y-contain bg-white pb-[calc(152px+env(safe-area-inset-bottom))] [-webkit-overflow-scrolling:touch]">
        <section className="relative aspect-[390/327] w-full shrink-0 overflow-hidden bg-[#F3F3F3] leading-none">
          <SkeletonBlock className="absolute inset-0 h-full w-full rounded-none" />
          <SkeletonBlock className="absolute inset-x-0 bottom-0 z-10 h-[3px] min-h-[3px] w-full rounded-none" />
          <SkeletonBlock className="absolute left-[13px] top-4 z-20 h-9 w-9 rounded-full" />
        </section>

        <section className="px-[13px] pb-[24px] pt-[13px] sm:px-6 sm:pt-5">
          <SkeletonBlock className="h-[24px] w-4/5 max-w-[360px]" />
          <SkeletonBlock className="mt-[10px] h-[14px] w-full max-w-[600px]" />
          <SkeletonBlock className="mt-[7px] h-[14px] w-[72%] max-w-[440px]" />
          <SkeletonBlock className="mt-[12px] h-[18px] w-[128px]" />
        </section>

        <SkeletonSection rows={optionRows} withImage />
        <SkeletonSection rows={borderRows} className="mt-[18px]" />
        <SkeletonSection rows={drinkRows} withImage className="mt-[18px]" />

        <section className="mt-[18px] px-[13px] pb-8 sm:px-6">
          <SkeletonBlock className="h-[16px] w-[170px]" />
          <SkeletonBlock className="mt-3 h-[96px] w-full" />
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 z-[60] w-full max-w-[768px] -translate-x-1/2 border-t border-[#E8E8E8] bg-white px-[13px] pb-[calc(14px+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_22px_rgba(0,0,0,0.08)] transform-gpu sm:px-6">
        <div className="flex min-h-11 items-center gap-3">
          <SkeletonBlock className="h-11 w-[116px] shrink-0" />
          <SkeletonBlock className="h-11 min-w-0 flex-1" />
        </div>
      </div>
    </main>
  );
}

function SkeletonSection({
  rows,
  withImage = false,
  className = "",
}: {
  rows: unknown[];
  withImage?: boolean;
  className?: string;
}) {
  return (
    <section className={`w-full ${className}`}>
      <div className="sticky top-0 z-30 flex min-h-[70px] items-center justify-between gap-3 bg-[#F3F3F3] px-[13px] py-[14px] shadow-[0_1px_0_rgba(0,0,0,0.04)] sm:px-6">
        <div className="min-w-0 flex-1">
          <SkeletonBlock className="h-[17px] w-[58%] max-w-[240px]" />
          <SkeletonBlock className="mt-[8px] h-[13px] w-[44%] max-w-[180px]" />
        </div>
        <SkeletonBlock className="h-[21px] w-[78px] shrink-0" />
      </div>

      {rows.map((_, index) => (
        <div
          key={index}
          className={
            withImage
              ? "relative grid min-h-[76px] grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-2 rounded-[7px] px-[13px] py-[11px] after:absolute after:bottom-0 after:left-[13px] after:right-[13px] after:h-px after:origin-bottom after:scale-y-50 after:bg-[#E6E6E6] after:content-[''] last:after:hidden sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:px-6 sm:py-3 sm:after:left-6 sm:after:right-6"
              : "relative grid min-h-[68px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[7px] px-[13px] py-[11px] after:absolute after:bottom-0 after:left-[13px] after:right-[13px] after:h-px after:origin-bottom after:scale-y-50 after:bg-[#E6E6E6] after:content-[''] last:after:hidden sm:px-6 sm:py-3 sm:after:left-6 sm:after:right-6"
          }
        >
          {withImage ? <SkeletonBlock className="h-11 w-11 shrink-0 sm:h-12 sm:w-12" /> : null}
          <div className="min-w-0">
            <SkeletonBlock className="h-[15px] w-[70%] max-w-[260px]" />
            <SkeletonBlock className="mt-[7px] h-[12px] w-full max-w-[430px]" />
            <SkeletonBlock className="mt-[7px] h-[12px] w-[58%] max-w-[300px]" />
            <SkeletonBlock className="mt-[7px] h-[13px] w-[72px]" />
          </div>
          <SkeletonBlock className="h-10 w-10 shrink-0 rounded-full" />
        </div>
      ))}
    </section>
  );
}

function SectionHeader({
  title,
  helper,
  selectedCount = 0,
  maxCount,
  completed = false,
  showCountProgress = false,
  optional = false,
}: {
  title: string;
  helper: string;
  selectedCount?: number;
  maxCount?: number;
  completed?: boolean;
  showCountProgress?: boolean;
  optional?: boolean;
}) {
  const shouldShowCountBadge =
    showCountProgress &&
    selectedCount > 0 &&
    typeof maxCount === "number" &&
    selectedCount < maxCount;
  const shouldShowSelectedItemsBadge = optional && selectedCount > 0;

  return (
    <div className="sticky top-0 z-30 flex min-h-[70px] items-center justify-between gap-3 bg-[#F3F3F3] px-[13px] py-[14px] shadow-[0_1px_0_rgba(0,0,0,0.04)] sm:px-6">
      <div className="min-w-0">
        <h2 className="text-[15px] font-bold leading-none text-[#4b4949]">
          {title}
        </h2>
        <p className="mt-[8px] text-[11px] font-normal leading-none text-[#2E2F31]">
          {helper}
        </p>
      </div>

      <div className="flex shrink-0 items-center self-center gap-1.5">
        {shouldShowSelectedItemsBadge ? (
          <SelectedItemsBadge count={selectedCount} />
        ) : optional ? (
          <OptionalBadge />
        ) : shouldShowCountBadge ? (
          <CountBadge current={selectedCount} total={maxCount} />
        ) : completed ? (
          <CompletedBadge />
        ) : (
          <RequiredBadge />
        )}
      </div>
    </div>
  );
}

function PlusIcon({ className = "h-[17px] w-[17px]" }: { className?: string }) {
  return (
    <span
      className={`block shrink-0 bg-[#000000] ${className}`}
      style={{
        WebkitMask: "url('/product-page/vector-2.svg') center / contain no-repeat",
        mask: "url('/product-page/vector-2.svg') center / contain no-repeat",
      }}
      aria-hidden="true"
    />
  );
}

function MinusIcon({ className = "w-[17px]" }: { className?: string }) {
  return (
    <span
      className={`block h-[3px] shrink-0 rounded-full bg-[#000000] ${className}`}
      aria-hidden="true"
    />
  );
}

function PizzaQuantityControl({
  quantity,
  onIncrement,
  onDecrement,
  incrementDisabled,
  itemLabel = "sabor",
}: {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  incrementDisabled: boolean;
  itemLabel?: string;
}) {
  if (quantity <= 0) {
    return (
      <button
        type="button"
        onClick={onIncrement}
        disabled={incrementDisabled}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:active:scale-100"
        aria-label={`Adicionar ${itemLabel}`}
      >
        <PlusIcon />
      </button>
    );
  }

  return (
    <div className="flex h-9 shrink-0 items-center overflow-hidden rounded-full">
      <button
        type="button"
        onClick={onDecrement}
        className="flex h-full w-8 items-center justify-center active:scale-95"
        aria-label={`Remover ${itemLabel}`}
      >
        <MinusIcon />
      </button>
      <span className="min-w-[18px] text-center text-[13px] font-normal leading-none text-[#2E2F31]">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={incrementDisabled}
        className="flex h-full w-8 items-center justify-center active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:active:scale-100"
        aria-label={`Adicionar mais deste ${itemLabel}`}
      >
        <PlusIcon />
      </button>
    </div>
  );
}

function RadioMark({ checked }: { checked: boolean }) {
  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-solid border-[#14BE39]"
      aria-hidden="true"
    >
      {checked ? (
        <span className="h-2.5 w-2.5 rounded-full bg-[#14BE39]" />
      ) : null}
    </span>
  );
}

function ProductOptionImage({
  src,
  className,
  iconClassName = "h-5 w-5 sm:h-[22px] sm:w-[22px]",
  objectFitClassName = "object-cover",
}: {
  src?: string | null;
  className: string;
  iconClassName?: string;
  objectFitClassName?: string;
}) {
  const [imageFailed, setImageFailed] = useState(!src);

  useEffect(() => {
    setImageFailed(!src);
  }, [src]);

  if (!src || imageFailed) {
    return (
      <div className={`${className} aspect-square shrink-0 overflow-hidden`}>
        <ProductImagePlaceholder
          className="h-full w-full"
          iconClassName={iconClassName}
        />
      </div>
    );
  }

  return (
    <img
      className={`${className} aspect-square shrink-0 ${objectFitClassName}`}
      alt=""
      aria-hidden="true"
      src={src}
      onError={() => setImageFailed(true)}
    />
  );
}

export function ProductPage() {
  const { id } = useParams();
  const slug = useStoreSlug();
  const navigate = useNavigate();
  const { data } = useMenu(slug);
  const product =
    getProductById(data, id) ?? getProductById(data, "pizza-grande-2-sabores");
  const screen = useProductScreenData(product);
  const addItem = useCartStore((state) => state.addItem);

  const [selectedPizzaQuantities, setSelectedPizzaQuantities] = useState<
    Record<string, number>
  >({});
  const [selectedBorder, setSelectedBorder] = useState<string>("");
  const [selectedOrderBumpQuantities, setSelectedOrderBumpQuantities] =
    useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(1);
  const [orderNote, setOrderNote] = useState("");
  const [showRequiredFeedback, setShowRequiredFeedback] = useState(false);
  const [isProductSkeletonVisible, setIsProductSkeletonVisible] = useState(true);
  const [isPhotoPreviewOpen, setIsPhotoPreviewOpen] = useState(false);
  const [isProductImageUnavailable, setIsProductImageUnavailable] =
    useState(false);
  const pizzaGroupName = useId();
  const borderSectionRef = useRef<HTMLElement | null>(null);
  const orderBumpSectionRef = useRef<HTMLElement | null>(null);
  const wasPizzaSelectionCompletedRef = useRef(false);
  const wasBorderSelectionCompletedRef = useRef(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlHeight = html.style.height;
    const previousBodyHeight = body.style.height;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverscroll = html.style.overscrollBehavior;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    html.style.height = "100%";
    body.style.height = "100%";
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";

    return () => {
      html.style.height = previousHtmlHeight;
      body.style.height = previousBodyHeight;
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      html.style.overscrollBehavior = previousHtmlOverscroll;
      body.style.overscrollBehavior = previousBodyOverscroll;
    };
  }, []);

  useEffect(() => {
    const skeletonTimer = window.setTimeout(() => {
      setIsProductSkeletonVisible(false);
    }, 1500);

    return () => window.clearTimeout(skeletonTimer);
  }, []);

  useEffect(() => {
    setIsProductImageUnavailable(false);
    setIsPhotoPreviewOpen(false);
  }, [screen.productImage]);

  useEffect(() => {
    setSelectedBorder((current) => {
      if (!current) return "";
      return screen.borderOptions.some((option) => option.id === current)
        ? current
        : "";
    });
  }, [screen.borderOptions]);

  const totalSelectedPizzas = Object.values(selectedPizzaQuantities).reduce(
    (sum, value) => sum + value,
    0,
  );
  const selectedPizzaOptions = screen.pizzaOptions
    .map((option) => ({
      ...option,
      quantity: selectedPizzaQuantities[option.id] ?? 0,
    }))
    .filter((option) => option.quantity > 0);
  const selectedBorderOption =
    screen.borderOptions.find((option) => option.id === selectedBorder) ?? null;
  const selectedOrderBumpOptions = screen.orderBumpOptions
    .map((option) => ({
      ...option,
      quantity: selectedOrderBumpQuantities[option.id] ?? 0,
    }))
    .filter((option) => option.quantity > 0);
  const totalSelectedOrderBumps = Object.values(
    selectedOrderBumpQuantities,
  ).reduce((sum, value) => sum + value, 0);
  const highestPricedPizzaOption = selectedPizzaOptions.reduce<
    (typeof selectedPizzaOptions)[number] | null
  >((highest, option) => {
    if (!highest || option.priceValue > highest.priceValue) return option;
    return highest;
  }, null);
  const pizzaPrice =
    screen.pizzaPricingStrategy === "highest"
      ? highestPricedPizzaOption?.priceValue ?? 0
      : selectedPizzaOptions.reduce(
          (sum, option) => sum + option.priceValue * option.quantity,
          0,
        );
  const borderPrice = selectedBorderOption?.priceValue ?? 0;
  const orderBumpPrice = selectedOrderBumpOptions.reduce(
    (sum, option) => sum + option.priceValue * option.quantity,
    0,
  );
  const totalPrice =
    (screen.basePrice + pizzaPrice + borderPrice) * quantity + orderBumpPrice;
  const missingPizzaCount = Math.max(screen.pizzaMax - totalSelectedPizzas, 0);
  const missingBorderCount = selectedBorder ? 0 : 1;
  const missingRequiredCount = missingPizzaCount + missingBorderCount;
  const canAdd = missingRequiredCount === 0;
  const pizzaSelectionCompleted = missingPizzaCount === 0;
  const shouldShowMissingState =
    showRequiredFeedback && missingRequiredCount > 0;
  const addButtonText = shouldShowMissingState
    ? missingRequiredCount === 1
      ? "Falta 1"
      : `Faltam ${missingRequiredCount}`
    : `Adicionar · ${fmtBRL(totalPrice)}`;

  useEffect(() => {
    if (canAdd) setShowRequiredFeedback(false);
  }, [canAdd]);

  useEffect(() => {
    const isPizzaSelectionCompleted = totalSelectedPizzas >= screen.pizzaMax;

    if (isPizzaSelectionCompleted && !wasPizzaSelectionCompletedRef.current) {
      window.setTimeout(() => {
        borderSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    }

    wasPizzaSelectionCompletedRef.current = isPizzaSelectionCompleted;
  }, [screen.pizzaMax, totalSelectedPizzas]);

  useEffect(() => {
    const isBorderSelectionCompleted = Boolean(selectedBorder);

    if (
      isBorderSelectionCompleted &&
      !wasBorderSelectionCompletedRef.current
    ) {
      window.setTimeout(() => {
        orderBumpSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    }

    wasBorderSelectionCompletedRef.current = isBorderSelectionCompleted;
  }, [selectedBorder]);

  const incrementPizzaSelection = (optionId: string) => {
    setSelectedPizzaQuantities((current) => {
      const currentTotal = Object.values(current).reduce(
        (sum, value) => sum + value,
        0,
      );
      if (currentTotal >= screen.pizzaMax) return current;

      return {
        ...current,
        [optionId]: (current[optionId] ?? 0) + 1,
      };
    });
  };

  const decrementPizzaSelection = (optionId: string) => {
    setSelectedPizzaQuantities((current) => {
      const currentQuantity = current[optionId] ?? 0;
      if (currentQuantity <= 0) return current;

      const next = { ...current };
      if (currentQuantity === 1) {
        delete next[optionId];
        return next;
      }

      next[optionId] = currentQuantity - 1;
      return next;
    });
  };

  const incrementOrderBumpSelection = (optionId: string) => {
    setSelectedOrderBumpQuantities((current) => ({
      ...current,
      [optionId]: (current[optionId] ?? 0) + 1,
    }));
  };

  const decrementOrderBumpSelection = (optionId: string) => {
    setSelectedOrderBumpQuantities((current) => {
      const currentQuantity = current[optionId] ?? 0;
      if (currentQuantity <= 0) return current;

      const next = { ...current };
      if (currentQuantity === 1) {
        delete next[optionId];
        return next;
      }

      next[optionId] = currentQuantity - 1;
      return next;
    });
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  const handleAddToCart = () => {
    if (!canAdd) {
      setShowRequiredFeedback(true);
      return;
    }

    addItem({
      productId: screen.productId,
      productName: screen.productTitle,
      imageUrl: screen.productImage,
      quantity,
      unitPrice: totalPrice / quantity,
      additionals: [
        ...selectedPizzaOptions.map((option) => ({
          id: option.id,
          name:
            option.quantity > 1
              ? `${option.name} x${option.quantity}`
              : option.name,
          price:
            screen.pizzaPricingStrategy === "highest"
              ? option.id === highestPricedPizzaOption?.id
                ? highestPricedPizzaOption.priceValue
                : 0
              : option.priceValue * option.quantity,
          groupId: "sabores-grande",
          groupName: screen.pizzaGroupTitle,
        })),
        ...(selectedBorderOption
          ? [
              {
                id: selectedBorderOption.id,
                name: selectedBorderOption.name,
                price: selectedBorderOption.priceValue,
                groupId: "borda-recheada",
                groupName: screen.borderGroupTitle,
              },
            ]
          : []),
        ...selectedOrderBumpOptions.map((option) => ({
          id: option.id,
          name:
            option.quantity > 1
              ? `${option.name} x${option.quantity}`
              : option.name,
          price: option.priceValue * option.quantity,
          groupId: "order-bump-bebidas",
          groupName: screen.orderBumpGroupTitle,
        })),
        ...(orderNote.trim()
          ? [
              {
                id: "observacao-pedido",
                name: `Observação: ${orderNote.trim()}`,
                price: 0,
                groupId: "observacao",
                groupName: "Alguma observação?",
              },
            ]
          : []),
      ],
    });

    navigate("/carrinho");
  };

  if (isProductSkeletonVisible) {
    return <ProductPageSkeleton />;
  }

  return (
    <main className="fixed inset-0 h-[100svh] w-full overflow-hidden bg-white font-sen tracking-wide text-[#2E2F31] antialiased">
      <div className="mx-auto flex h-full w-full max-w-[768px] flex-col overflow-y-auto overscroll-y-contain bg-white pb-[calc(152px+env(safe-area-inset-bottom))] [-webkit-overflow-scrolling:touch]">
        <section
          aria-label="Imagem do produto"
          className="relative aspect-[390/327] w-full shrink-0 overflow-hidden bg-[#F3F3F3] leading-none"
        >
          {screen.productImage && !isProductImageUnavailable ? (
            <>
              <img
                className="absolute inset-0 block h-full w-full object-cover align-middle"
                alt={screen.productTitle}
                src={screen.productImage}
                onError={() => {
                  setIsProductImageUnavailable(true);
                  setIsPhotoPreviewOpen(false);
                }}
              />

              <button
                type="button"
                aria-label="Abrir foto do produto"
                onClick={() => setIsPhotoPreviewOpen(true)}
                className="absolute inset-0 z-10 cursor-zoom-in bg-transparent"
              />
            </>
          ) : (
            <ProductImagePlaceholder iconClassName="h-20 w-20 sm:h-24 sm:w-24" />
          )}

          <div className="absolute inset-x-0 bottom-0 z-[11] h-[3px] min-h-[3px] w-full bg-[#000000]" />

          <button
            type="button"
            aria-label="Voltar"
            onClick={handleBack}
            className="absolute left-[13px] top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_7px_18px_rgba(0,0,0,0.16)] ring-1 ring-black/5 transition-transform duration-150 active:scale-95"
          >
            <img
              className="block h-[15px] w-[9px] object-contain"
              alt=""
              aria-hidden="true"
              src="/product-page/vector-3.svg"
            />
          </button>
        </section>

        <section
          aria-labelledby="pizza-title"
          className="px-[13px] pb-[24px] pt-[13px] sm:px-6 sm:pt-5"
        >
          <h1
            id="pizza-title"
            className="text-[21px] font-bold leading-[1.12] text-[#4b4949] sm:text-[23px]"
          >
            {screen.productTitle}
          </h1>
          <p className="mt-[10px] max-w-[620px] text-[13px] font-normal leading-[1.38] tracking-wide text-[#6c757d] sm:text-[14px]">
            {screen.productDescription}
          </p>

          {screen.displayPrice != null ? (
            <div className="mt-[12px] flex items-baseline gap-2">
              {screen.hasActivePromo && screen.originalPrice != null ? (
                <span className="text-[12px] font-normal text-[#9A9A9A] line-through">
                  {fmtBRL(screen.originalPrice)}
                </span>
              ) : null}

              <span
                className={`text-[18px] font-bold leading-none tracking-[-0.35px] ${
                  screen.hasActivePromo ? "text-[#4bb363]" : "text-[#4b4949]"
                }`}
              >
                {!screen.hasActivePromo && screen.showStartingFrom ? (
                  <span className="mr-1.5 text-[12px] font-normal tracking-normal sm:text-[13px]">
                    A partir de
                  </span>
                ) : null}
                {fmtBRL(screen.displayPrice)}
              </span>
            </div>
          ) : null}
        </section>

        <section aria-labelledby="sabores-heading" className="w-full">
          <SectionHeader
            title={screen.pizzaGroupTitle}
            helper={screen.pizzaGroupHelper}
            selectedCount={totalSelectedPizzas}
            maxCount={screen.pizzaMax}
            completed={pizzaSelectionCompleted}
            showCountProgress
          />

          <fieldset
            className="m-0 border-0 p-0"
            aria-describedby="sabores-help"
          >
            <legend id="sabores-heading" className="sr-only">
              Selecione até 2 sabores de pizza
            </legend>
            <span id="sabores-help" className="sr-only">
              Você pode selecionar até {screen.pizzaMax} opções.
            </span>

            {screen.pizzaOptions.map((option) => {
              const optionQuantity = selectedPizzaQuantities[option.id] ?? 0;
              const checked = optionQuantity > 0;
              const pizzaLimitReached = totalSelectedPizzas >= screen.pizzaMax;
              const optionLocked = !checked && pizzaLimitReached;
              const incrementDisabled = pizzaLimitReached;

              return (
                <div
                  key={option.id}
                  className="relative grid min-h-[76px] grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-2 rounded-[7px] px-[13px] py-[11px] after:absolute after:bottom-0 after:left-[13px] after:right-[13px] after:h-px after:origin-bottom after:scale-y-50 after:bg-[#E6E6E6] after:content-[''] last:after:hidden sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:px-6 sm:py-3 sm:after:left-6 sm:after:right-6"
                >
                  <input
                    type="checkbox"
                    name={pizzaGroupName}
                    checked={checked}
                    onChange={() =>
                      checked
                        ? decrementPizzaSelection(option.id)
                        : incrementPizzaSelection(option.id)
                    }
                    className="sr-only"
                    aria-label={`${option.name} ${option.price}`}
                  />

                  <ProductOptionImage
                    src={option.image}
                    className="h-11 w-11 self-center rounded-[7px] sm:h-12 sm:w-12"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (checked || optionLocked) return;
                      incrementPizzaSelection(option.id);
                    }}
                    disabled={optionLocked}
                    className="min-w-0 pr-0 text-left disabled:cursor-not-allowed"
                  >
                    <span className="block truncate text-[14px] font-bold leading-[1.15] text-[#4b4949] sm:text-[15px]">
                      {option.name}
                    </span>
                    <p className="mt-[6px] line-clamp-2 max-w-[430px] overflow-hidden text-[11px] font-normal leading-[1.35] tracking-wide text-[#6c757d] sm:text-[12px] sm:leading-[1.35]">
                      {option.description}
                    </p>
                    <span className="mt-[6px] block text-[12px] font-bold leading-none text-[#2E2F31] sm:text-[13px]">
                      {option.price}
                    </span>
                  </button>

                  <PizzaQuantityControl
                    quantity={optionQuantity}
                    onIncrement={() => incrementPizzaSelection(option.id)}
                    onDecrement={() => decrementPizzaSelection(option.id)}
                    incrementDisabled={incrementDisabled}
                  />
                </div>
              );
            })}
          </fieldset>
        </section>

        <section
          ref={borderSectionRef}
          aria-labelledby="borda-heading"
          className="mt-[18px] scroll-mt-0 w-full"
        >
          <SectionHeader
            title={screen.borderGroupTitle}
            helper={screen.borderGroupHelper}
            selectedCount={selectedBorder ? 1 : 0}
            maxCount={1}
            completed={Boolean(selectedBorder)}
          />

          <fieldset className="m-0 border-0 p-0">
            <legend id="borda-heading" className="sr-only">
              Selecione o sabor da borda
            </legend>

            {screen.borderOptions.map((option) => {
              const checked = selectedBorder === option.id;

              return (
                <label
                  key={option.id}
                  className="relative grid min-h-[68px] cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[7px] px-[13px] py-[11px] after:absolute after:bottom-0 after:left-[13px] after:right-[13px] after:h-px after:origin-bottom after:scale-y-50 after:bg-[#E6E6E6] after:content-[''] last:after:hidden sm:px-6 sm:py-3 sm:after:left-6 sm:after:right-6"
                >
                  <input
                    type="radio"
                    name="border-option"
                    checked={checked}
                    onChange={() => setSelectedBorder(option.id)}
                    className="sr-only"
                    aria-label={`${option.name} ${option.price}`}
                  />

                  <div className="min-w-0">
                    <span className="block truncate text-[14px] font-bold leading-[1.15] text-[#4b4949] sm:text-[15px]">
                      {option.name}
                    </span>
                    <p className="mt-[6px] line-clamp-2 max-w-[430px] overflow-hidden text-[11px] font-normal leading-[1.35] tracking-wide text-[#6c757d] sm:text-[12px] sm:leading-[1.35]">
                      {option.description}
                    </p>
                    <span className="mt-[6px] block text-[12px] font-bold leading-none text-[#2E2F31] sm:text-[13px]">
                      {option.price}
                    </span>
                  </div>

                  <RadioMark checked={checked} />
                </label>
              );
            })}
          </fieldset>
        </section>

        <section
          ref={orderBumpSectionRef}
          aria-labelledby="bebidas-heading"
          className="mt-[18px] scroll-mt-0 w-full"
        >
          <SectionHeader
            title={screen.orderBumpGroupTitle}
            helper={screen.orderBumpGroupHelper}
            selectedCount={totalSelectedOrderBumps}
            optional
          />

          <fieldset className="m-0 border-0 p-0">
            <legend id="bebidas-heading" className="sr-only">
              Adicione uma bebida ao pedido
            </legend>

            {screen.orderBumpOptions.map((option) => {
              const optionQuantity =
                selectedOrderBumpQuantities[option.id] ?? 0;

              return (
                <div
                  key={option.id}
                  className="relative grid min-h-[76px] grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-2 rounded-[7px] px-[13px] py-[11px] after:absolute after:bottom-0 after:left-[13px] after:right-[13px] after:h-px after:origin-bottom after:scale-y-50 after:bg-[#E6E6E6] after:content-[''] last:after:hidden sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:px-6 sm:py-3 sm:after:left-6 sm:after:right-6"
                >
                  <ProductOptionImage
                    src={option.image}
                    className="h-11 w-11 self-center rounded-[7px] sm:h-12 sm:w-12"
                    objectFitClassName="bg-[#F8F8F8] object-contain p-1"
                  />

                  <button
                    type="button"
                    onClick={() => incrementOrderBumpSelection(option.id)}
                    className="min-w-0 text-left"
                  >
                    <span className="block truncate text-[14px] font-bold leading-[1.15] text-[#4b4949] sm:text-[15px]">
                      {option.name}
                    </span>
                    <p className="mt-[6px] line-clamp-2 max-w-[430px] overflow-hidden text-[11px] font-normal leading-[1.35] tracking-wide text-[#6c757d] sm:text-[12px] sm:leading-[1.35]">
                      {option.description}
                    </p>
                    <span className="mt-[6px] block text-[12px] font-bold leading-none text-[#2E2F31] sm:text-[13px]">
                      {option.price}
                    </span>
                  </button>

                  <PizzaQuantityControl
                    quantity={optionQuantity}
                    onIncrement={() => incrementOrderBumpSelection(option.id)}
                    onDecrement={() => decrementOrderBumpSelection(option.id)}
                    incrementDisabled={false}
                    itemLabel="bebida"
                  />
                </div>
              );
            })}
          </fieldset>
        </section>

        <section
          aria-labelledby="observacao-heading"
          className="mt-[18px] px-[13px] pb-8 sm:px-6"
        >
          <label htmlFor="order-note" className="block">
            <span
              id="observacao-heading"
              className="block text-[14px] font-bold leading-none text-[#4b4949] sm:text-[15px]"
            >
              Alguma observação?
            </span>
            <textarea
              id="order-note"
              value={orderNote}
              onChange={(event) => setOrderNote(event.target.value)}
              placeholder="Ex: tirar cebola, deixar bem assada..."
              maxLength={180}
              className="mt-3 min-h-[96px] w-full resize-none rounded-[7px] border border-[#E6E6E6] bg-white px-3.5 py-3 text-[16px] font-normal leading-[1.35] text-[#2E2F31] outline-none placeholder:text-[#9A9A9A] focus:border-[#000000] focus:ring-2 focus:ring-[#000000]/15"
            />
          </label>
        </section>
      </div>

      {isPhotoPreviewOpen && screen.productImage && !isProductImageUnavailable ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 px-4 py-[calc(18px+env(safe-area-inset-top))]"
          role="dialog"
          aria-modal="true"
          aria-label="Foto do produto"
        >
          <button
            type="button"
            aria-label="Fechar foto"
            onClick={() => setIsPhotoPreviewOpen(false)}
            className="absolute right-4 top-[calc(16px+env(safe-area-inset-top))] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[24px] font-normal leading-none text-[#2E2F31] shadow-[0_8px_22px_rgba(0,0,0,0.22)] ring-1 ring-white/20 transition-transform duration-150 active:scale-95"
          >
            ×
          </button>

          <img
            className="max-h-[86svh] w-full max-w-[768px] rounded-[12px] object-contain"
            alt={screen.productTitle}
            src={screen.productImage}
          />
        </div>
      ) : null}

      <div className="fixed bottom-0 left-1/2 z-[60] w-full max-w-[768px] -translate-x-1/2 border-t border-[#E8E8E8] bg-white px-[13px] pb-[calc(14px+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_22px_rgba(0,0,0,0.08)] transform-gpu sm:px-6">
        <div className="flex min-h-11 items-center gap-3">
          <div className="flex h-11 min-h-11 shrink-0 items-center overflow-hidden rounded-[7px]">
            <button
              type="button"
              aria-label="Diminuir quantidade"
              disabled={quantity <= 1}
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="flex h-full w-11 items-center justify-center transition-opacity active:scale-95 disabled:cursor-default disabled:opacity-25 disabled:active:scale-100"
            >
              <MinusIcon />
            </button>
            <span className="min-w-7 text-center text-[14px] font-normal text-[#2E2F31]">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Aumentar quantidade"
              onClick={() => setQuantity((current) => current + 1)}
              className="flex h-full w-11 items-center justify-center"
            >
              <PlusIcon />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex h-11 min-h-11 min-w-0 flex-1 shrink-0 items-center justify-center rounded-[7px] px-4 text-[14px] font-bold leading-none active:scale-[0.99] sm:text-[15px] ${
              canAdd || shouldShowMissingState
                ? "bg-[#000000] text-white"
                : "bg-[#D9D9D9] text-[#5B5858]"
            }`}
          >
            {addButtonText}
          </button>
        </div>
      </div>
    </main>
  );
}
