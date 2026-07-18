import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { type Product } from "../services/menu.service";
import { useCartStore } from "../store/useCartStore";

import { resolveImageUrl } from "@/shared/lib/imageUrl";

interface Props {
  product: Product;
  slug: string;
  onNavigate: () => void;
}

function getCloudinaryUrl(url: string): string {
  const resolved = resolveImageUrl(url) ?? url;
  if (!resolved.includes("cloudinary.com")) return resolved;
  return resolved.replace("/upload/", "/upload/f_auto,w_auto/");
}

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getPriceDefiningOptionGroup(product: Product) {
  const groups = product.optionGroups ?? [];
  const hasActivePricedOptions = (group: (typeof groups)[number]) =>
    group.options.some(
      (option) => option.isActive !== false && option.price != null,
    );

  return (
    groups.find(
      (group) =>
        group.pricingStrategy === "highest" && hasActivePricedOptions(group),
    ) ??
    groups.find(
      (group) =>
        (group.required || (group.min ?? 0) > 0) &&
        hasActivePricedOptions(group),
    ) ??
    null
  );
}

function getProductStartingPrice(product: Product) {
  const activeVariations = product.variations.filter(
    (variation) => variation.isActive && variation.price != null,
  );

  if (activeVariations.length > 0) {
    return Math.min(...activeVariations.map((variation) => variation.price));
  }

  if (product.basePrice != null) {
    return product.basePrice;
  }

  const priceGroup = getPriceDefiningOptionGroup(product);
  const activeOptionPrices =
    priceGroup?.options
      .filter((option) => option.isActive !== false && option.price != null)
      .map((option) => option.price) ?? [];

  return activeOptionPrices.length > 0
    ? Math.min(...activeOptionPrices)
    : null;
}

function shouldShowStartingFrom(product: Product) {
  if (product.variations.some((variation) => variation.isActive)) {
    return true;
  }

  const priceGroup = getPriceDefiningOptionGroup(product);
  return (
    product.basePrice == null &&
    priceGroup != null &&
    priceGroup.pricingStrategy === "highest"
  );
}

const IMAGE_SKELETON_MIN_MS = 800;

function ShimmerStyles() {
  return (
    <style>{`
      @keyframes menu-image-shimmer {
        0% { background-position: 100% 0; }
        100% { background-position: 0 0; }
      }
    `}</style>
  );
}

function ShimmerSurface({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        background:
          "linear-gradient(90deg, #e9e9e9 0%, #f3f3f3 42%, #e9e9e9 84%)",
        backgroundSize: "240% 100%",
        animation: "menu-image-shimmer 1.25s ease-in-out infinite",
      }}
    />
  );
}

function ImageShimmerSkeleton() {
  return <ShimmerSurface className="absolute inset-0 rounded-[12px]" />;
}

function ProductTextSkeleton() {
  return (
    <div className="relative z-10 pr-1" aria-hidden="true">
      <ShimmerSurface className="h-[18px] w-[74%] rounded-full" />

      <div className="mt-3 space-y-2">
        <ShimmerSurface className="h-[9px] w-[92%] rounded-full" />
        <ShimmerSurface className="h-[9px] w-[66%] rounded-full" />
      </div>

      <ShimmerSurface className="mt-5 h-[18px] w-[92px] rounded-full" />
    </div>
  );
}

export function ProductCard({ product, onNavigate }: Props) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [canHideImageSkeleton, setCanHideImageSkeleton] = useState(false);

  useEffect(() => {
    setIsImageLoaded(false);
    setCanHideImageSkeleton(false);

    const timer = window.setTimeout(() => {
      setCanHideImageSkeleton(true);
    }, IMAGE_SKELETON_MIN_MS);

    return () => window.clearTimeout(timer);
  }, [product.imageUrl]);

  const showImageSkeleton =
    Boolean(product.imageUrl) && (!isImageLoaded || !canHideImageSkeleton);
  const showProductImage =
    Boolean(product.imageUrl) && isImageLoaded && canHideImageSkeleton;
  const showContentSkeleton = showImageSkeleton;

  const addItem = useCartStore((s) => s.addItem);
  const hasVariations = product.variations.filter((v) => v.isActive).length > 0;
  const hasOptionGroups = Boolean(product.optionGroups?.length);
  // v2.9: addons via ProductAddon. Filtra addon ativo.
  const hasAdditionals = product.addons.some((link) => link.addon.isActive);
  const displayPrice = getProductStartingPrice(product);
  const showStartingFrom = shouldShowStartingFrom(product);

  // Promo por produto só se aplica quando não há variations.
  const hasActivePromo =
    !hasVariations &&
    product.promoPrice != null &&
    displayPrice != null &&
    product.promoPrice < displayPrice;

  // Quick-add: só aplica se o produto não tem variação nem adicional. Caso
  // contrário precisa abrir a página do produto pra cliente escolher.
  const canQuickAdd =
    !hasVariations && !hasAdditionals && !hasOptionGroups && product.basePrice != null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canQuickAdd) {
      onNavigate();
      return;
    }
    const unitPrice = hasActivePromo
      ? product.promoPrice!
      : (product.basePrice ?? 0);
    addItem({
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrl,
      additionals: [],
      quantity: 1,
      unitPrice,
    });
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onNavigate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onNavigate();
        }
      }}
      className={[
        "relative min-h-[122px] w-full cursor-pointer overflow-hidden rounded-[14px] p-3 pr-[136px] transition-transform active:scale-[0.99]",
        showContentSkeleton
          ? "border-0 bg-[#eeeeee] shadow-none"
          : "border-[0.50px] border-[#f1f1f1] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
      ].join(" ")}
      aria-label={`Ver detalhes de ${product.name}`}
    >
      <ShimmerStyles />

      {showContentSkeleton ? (
        <ProductTextSkeleton />
      ) : (
        <div className="relative z-10">
          <h3 className="line-clamp-1 text-[16.0975px] font-semibold leading-[20.9268px] tracking-normal text-[#2e2828]">
            {product.name}
          </h3>

          {product.description && (
            <p className="mt-[9px] line-clamp-2 w-full overflow-hidden text-[14.0975px] font-normal leading-[18.3267px] tracking-normal text-[#6c757d]">
              {product.description}
            </p>
          )}

          <div className="mt-4">
            {hasActivePromo ? (
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] text-gray-400 line-through">
                  {fmtBRL(displayPrice!)}
                </span>
                <span className="whitespace-nowrap text-[17px] font-bold leading-none tracking-[-0.5px] text-[#4bb363]">
                  {fmtBRL(product.promoPrice!)}
                </span>
              </div>
            ) : displayPrice != null ? (
              <span className="whitespace-nowrap text-[17px] font-bold leading-none tracking-[-0.5px] text-[#4a4a4a]">
                {showStartingFrom ? (
                  <span className="mr-1 text-[12px] font-normal tracking-normal">
                    A partir de
                  </span>
                ) : null}
                {fmtBRL(displayPrice)}
              </span>
            ) : null}
          </div>
        </div>
      )}

      <div
        className={[
          "absolute bottom-[12px] right-[10px] top-[12px] z-10 w-[116px] overflow-hidden rounded-[12px]",
          showContentSkeleton ? "bg-[#e9e9e9]" : "bg-[#f3eeee]",
        ].join(" ")}
      >
        {product.imageUrl ? (
          <>
            {showImageSkeleton && <ImageShimmerSkeleton />}
            <img
              className={`block h-full w-full object-cover transition-opacity duration-300 ${
                showProductImage ? "opacity-100" : "opacity-0"
              }`}
              alt={product.name}
              src={getCloudinaryUrl(product.imageUrl)}
              loading="lazy"
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setIsImageLoaded(true)}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl text-gray-300">
            🍽️
          </div>
        )}
        {showContentSkeleton ? (
          <ShimmerSurface className="absolute bottom-[6px] right-[6px] z-20 h-5 w-5 rounded-full" />
        ) : (
          <button
            type="button"
            aria-label={
              canQuickAdd
                ? `Adicionar ${product.name} ao carrinho`
                : `Ver opções de ${product.name}`
            }
            onClick={handleQuickAdd}
            className="absolute bottom-[6px] right-[6px] z-20 flex h-5 w-5 items-center justify-center rounded-full shadow-menu-sm transition-transform active:scale-90"
            style={{
              background:
                "linear-gradient(135deg, var(--menu-gradient-from) 0%, var(--menu-gradient-to) 100%)",
            }}
          >
            <Plus className="h-[10px] w-[10px] text-white" strokeWidth={3} />
          </button>
        )}
      </div>
    </article>
  );
}
