import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useMenu } from "../hooks/useMenu";
import { useTableMode } from "../hooks/useTableMode";
import { ProductCard } from "../components/ProductCard";
import { SkeletonCard } from "../components/SkeletonCard";
import { FacebookPixel } from "../components/FacebookPixel";
import { ThemeInjector } from "../components/ThemeInjector";
import { CookieBanner, hasCookieConsent } from "../components/CookieBanner";
import { SuspendedStorePage } from "../components/SuspendedStorePage";
import { StoreHeader } from "../components/StoreHeader";
import { StoreInfo } from "../components/StoreInfo";
import { CategoryChips } from "../components/CategoryChips";
import { CartSummaryBar } from "../components/CartSummaryBar";
import { BottomNavigation } from "../components/BottomNavigation";
import { MenuPageSidebar } from "../components/MenuPageSidebar";
import { MenuShimmer } from "../components/MenuShimmer";
import { useCartStore } from "../store/useCartStore";

import { useStoreSlug } from "@/hooks/useStoreSlug";
import { getMenuThemeFromUrl } from "@/lib/menuThemes";
import { resolveImageUrl } from "@/shared/lib/imageUrl";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";

const IMAGE_SKELETON_MIN_MS = 800;
const CONTENT_SKELETON_MIN_MS = 800;

function getMinimumOrderValue(store: unknown) {
  const source = store as {
    minimumOrder?: number | string | null;
    minimumOrderValue?: number | string | null;
    minOrder?: number | string | null;
    minOrderValue?: number | string | null;
    orderMinimum?: number | string | null;
    orderMinimumValue?: number | string | null;
    deliveryMinimum?: number | string | null;
    minDeliveryOrder?: number | string | null;
    minimumDeliveryOrder?: number | string | null;
  };

  const value =
    source.minimumOrder ??
    source.minimumOrderValue ??
    source.minOrder ??
    source.minOrderValue ??
    source.orderMinimum ??
    source.orderMinimumValue ??
    source.deliveryMinimum ??
    source.minDeliveryOrder ??
    source.minimumDeliveryOrder;

  if (value == null) return null;

  const numberValue =
    typeof value === "number" ? value : Number(String(value).replace(",", "."));
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null;
}

function getFeaturedImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;

  const resolved = resolveImageUrl(url) ?? url;
  if (!resolved.includes("cloudinary.com")) return resolved;

  return resolved.replace("/upload/", "/upload/f_auto,w_420/");
}

function fmtBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function ImageShimmerSkeleton({
  roundedClass = "rounded-[9px]",
}: {
  roundedClass?: string;
}) {
  return (
    <>
      <style>{`
        @keyframes menu-image-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
      <div
        className={`absolute inset-0 ${roundedClass}`}
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, #eeeeee 0%, #f8f8f8 42%, #eeeeee 84%)",
          backgroundSize: "240% 100%",
          animation: "menu-image-shimmer 1.25s ease-in-out infinite",
        }}
      />
    </>
  );
}

function CategoryMetaGlassEffectAssets() {
  return (
    <style>{`
      @keyframes category-meta-glass-drift {
        0% { transform: translate3d(-5%, -8%, 0) scale(1.02); opacity: 0.55; }
        50% { transform: translate3d(4%, 5%, 0) scale(1.08); opacity: 0.72; }
        100% { transform: translate3d(7%, -3%, 0) scale(1.04); opacity: 0.58; }
      }

      @keyframes category-meta-glass-sheen {
        0% { transform: translateX(-40%) skewX(-14deg); opacity: 0.12; }
        50% { opacity: 0.28; }
        100% { transform: translateX(42%) skewX(-14deg); opacity: 0.16; }
      }

      .category-meta-glass-left,
      .category-meta-glass-right {
        animation: category-meta-glass-drift 8s ease-in-out infinite alternate;
        mix-blend-mode: screen;
        will-change: transform, opacity;
      }

      .category-meta-glass-right {
        animation-duration: 10s;
        animation-direction: alternate-reverse;
      }

      .category-meta-glass-sheen {
        animation: category-meta-glass-sheen 7s ease-in-out infinite alternate;
        background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.08) 32%, rgba(255,255,255,0.42) 48%, rgba(255,255,255,0.10) 62%, transparent 100%);
        mix-blend-mode: screen;
        will-change: transform, opacity;
      }

      @media (prefers-reduced-motion: reduce) {
        .category-meta-glass-left,
        .category-meta-glass-right,
        .category-meta-glass-sheen {
          animation: none;
        }
      }
    `}</style>
  );
}

function FeaturedProductImage({
  imageUrl,
  alt,
  isLoading = false,
}: {
  imageUrl?: string | null;
  alt: string;
  isLoading?: boolean;
}) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const [canHideImageSkeleton, setCanHideImageSkeleton] = useState(false);

  useEffect(() => {
    setIsImageLoaded(false);
    setHasImageError(false);
    setCanHideImageSkeleton(false);

    const timer = window.setTimeout(() => {
      setCanHideImageSkeleton(true);
    }, IMAGE_SKELETON_MIN_MS);

    return () => window.clearTimeout(timer);
  }, [imageUrl]);

  const hasProductImage = Boolean(imageUrl) && !hasImageError;
  const showImageSkeleton =
    isLoading || (hasProductImage && (!isImageLoaded || !canHideImageSkeleton));
  const showProductImage =
    !isLoading && hasProductImage && isImageLoaded && canHideImageSkeleton;
  const showPlaceholder = !isLoading && !hasProductImage;

  return (
    <div
      className="relative h-[104px] w-full overflow-hidden rounded-[10px] bg-[#eeeeee] shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:h-[118px]"
      aria-busy={showImageSkeleton}
    >
      {showImageSkeleton ? (
        <ImageShimmerSkeleton roundedClass="rounded-[10px]" />
      ) : null}

      {hasProductImage ? (
        <img
          src={getFeaturedImageUrl(imageUrl)}
          alt={alt}
          className={`block h-full w-full object-cover object-center transition-opacity duration-300 ${
            showProductImage ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          onError={() => {
            setHasImageError(true);
            setIsImageLoaded(true);
          }}
        />
      ) : null}

      {showPlaceholder ? (
        <ProductImagePlaceholder iconClassName="h-10 w-10 sm:h-12 sm:w-12" />
      ) : null}
    </div>
  );
}

type PriceableMenuProduct = {
  variations?: Array<{ isActive?: boolean; price?: number | null }>;
  basePrice?: number | null;
  optionGroups?: Array<{
    required?: boolean;
    min?: number;
    pricingStrategy?: "sum" | "highest";
    options: Array<{ isActive?: boolean; price?: number | null }>;
  }>;
};

function getPriceDefiningOptionGroup(product: PriceableMenuProduct) {
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

function getProductStartingPrice(product: PriceableMenuProduct) {
  const activeVariations =
    product.variations?.filter(
      (variation) => variation.isActive && variation.price != null,
    ) ?? [];

  if (activeVariations.length > 0) {
    return Math.min(
      ...activeVariations.map((variation) => variation.price ?? 0),
    );
  }

  if (product.basePrice != null) {
    return product.basePrice;
  }

  const priceGroup = getPriceDefiningOptionGroup(product);
  const activeOptionPrices =
    priceGroup?.options
      .filter((option) => option.isActive !== false && option.price != null)
      .map((option) => option.price ?? 0) ?? [];

  return activeOptionPrices.length > 0
    ? Math.min(...activeOptionPrices)
    : null;
}

function shouldShowStartingFrom(product: PriceableMenuProduct) {
  if (product.variations?.some((variation) => variation.isActive)) {
    return true;
  }

  const priceGroup = getPriceDefiningOptionGroup(product);
  return (
    product.basePrice == null &&
    priceGroup != null &&
    priceGroup.pricingStrategy === "highest"
  );
}

export function MenuPage() {
  const slug = useStoreSlug();
  const navigate = useNavigate();
  const { data, isLoading } = useMenu(slug);
  const selectedTheme = useMemo(() => getMenuThemeFromUrl(), []);

  const setStore = useCartStore((s) => s.setStore);
  // Modo mesa só vale na aba que veio do QR (`/mesa/:token`).
  const { tableNumber, isTableMode } = useTableMode();
  const cartItems = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHeaderSearchOpen, setIsHeaderSearchOpen] = useState(false);
  const [isCategorySticky, setIsCategorySticky] = useState(false);
  const [showHeaderIdentity, setShowHeaderIdentity] = useState(false);
  const [showContentSkeleton, setShowContentSkeleton] = useState(true);
  const categoryStickySentinelRef = useRef<HTMLDivElement | null>(null);
  const menuContentStartRef = useRef<HTMLDivElement | null>(null);
  const featuredSectionRef = useRef<HTMLElement | null>(null);
  const categorySectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const categoryScrollLockRef = useRef(false);
  const categoryScrollUnlockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (slug && slug !== "__custom_domain__") setStore(slug);
  }, [slug, setStore]);

  useEffect(() => {
    if (isLoading || !data) {
      setShowContentSkeleton(true);
      return;
    }

    setShowContentSkeleton(true);
    const timer = window.setTimeout(() => {
      setShowContentSkeleton(false);
    }, CONTENT_SKELETON_MIN_MS);

    return () => window.clearTimeout(timer);
  }, [isLoading, data]);

  useEffect(() => {
    let frame = 0;

    const updateHeaderIdentity = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setShowHeaderIdentity(window.scrollY > 88);
      });
    };

    updateHeaderIdentity();
    window.addEventListener("scroll", updateHeaderIdentity, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateHeaderIdentity);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (categoryScrollUnlockTimerRef.current) {
        window.clearTimeout(categoryScrollUnlockTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const updateCategoryStickyState = () => {
      cancelAnimationFrame(frame);

      frame = window.requestAnimationFrame(() => {
        const sentinel = categoryStickySentinelRef.current;
        if (!sentinel) return;

        // Usa medição direta em vez de depender apenas do IntersectionObserver.
        // Isso evita a barra continuar branca quando o sticky já encostou na top bar.
        setIsCategorySticky(sentinel.getBoundingClientRect().top <= 49);
      });
    };

    updateCategoryStickyState();
    window.addEventListener("scroll", updateCategoryStickyState, {
      passive: true,
    });
    window.addEventListener("resize", updateCategoryStickyState);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateCategoryStickyState);
      window.removeEventListener("resize", updateCategoryStickyState);
    };
  }, []);

  const handleCategorySelect = (categoryId: string | null) => {
    // Evita o scroll-spy trocar o chip para a categoria anterior durante a rolagem suave.
    categoryScrollLockRef.current = true;

    if (categoryScrollUnlockTimerRef.current) {
      window.clearTimeout(categoryScrollUnlockTimerRef.current);
    }

    if (search.trim()) {
      setSearch("");
    }

    setIsHeaderSearchOpen(false);
    setActiveCategoryId(categoryId);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const target = categoryId
          ? categorySectionRefs.current[categoryId]
          : menuContentStartRef.current;

        if (!target) {
          categoryScrollLockRef.current = false;
          return;
        }

        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });

    categoryScrollUnlockTimerRef.current = window.setTimeout(() => {
      categoryScrollLockRef.current = false;
      categoryScrollUnlockTimerRef.current = null;
      window.dispatchEvent(new Event("scroll"));
    }, 950);
  };

  const handleFeaturedSelect = () => {
    categoryScrollLockRef.current = true;

    if (categoryScrollUnlockTimerRef.current) {
      window.clearTimeout(categoryScrollUnlockTimerRef.current);
    }

    if (search.trim()) {
      setSearch("");
    }

    setIsHeaderSearchOpen(false);
    setActiveCategoryId(null);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const target =
          featuredSectionRef.current ?? menuContentStartRef.current;

        if (!target) {
          categoryScrollLockRef.current = false;
          return;
        }

        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });

    categoryScrollUnlockTimerRef.current = window.setTimeout(() => {
      categoryScrollLockRef.current = false;
      categoryScrollUnlockTimerRef.current = null;
      window.dispatchEvent(new Event("scroll"));
    }, 950);
  };

  const allProducts = useMemo(() => {
    if (!data) return [];
    return data.categories.flatMap((c) => c.products);
  }, [data]);

  const featuredProducts = useMemo(() => {
    if (!allProducts.length) return [];

    const explicitFeaturedProducts = allProducts.filter((product) => {
      const item = product as typeof product & {
        isFeatured?: boolean;
        featured?: boolean;
        isHighlight?: boolean;
        highlight?: boolean;
      };

      return Boolean(
        item.isFeatured || item.featured || item.isHighlight || item.highlight,
      );
    });

    return (
      explicitFeaturedProducts.length > 0
        ? explicitFeaturedProducts
        : allProducts
    ).slice(0, 6);
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    if (search.trim()) {
      return allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return allProducts;
  }, [allProducts, search]);

  const visibleCategories = useMemo(() => {
    if (!data) return [];
    if (search.trim()) return [];
    return data.categories.filter((c) => c.isActive);
  }, [data, search]);

  useEffect(() => {
    if (search.trim() || visibleCategories.length === 0) {
      setActiveCategoryId(null);
      return;
    }

    let frame = 0;

    const updateActiveCategoryOnScroll = () => {
      if (categoryScrollLockRef.current) return;

      cancelAnimationFrame(frame);

      frame = window.requestAnimationFrame(() => {
        if (categoryScrollLockRef.current) return;

        const topSafeArea = 120;
        const bottomSafeArea = cartCount > 0 ? 168 : 104;
        const viewportTop = topSafeArea;
        const viewportBottom = window.innerHeight - bottomSafeArea;
        const currentScrollY = window.scrollY;
        const pageBottom = currentScrollY + window.innerHeight;
        const documentHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
        );
        const distanceFromBottom = documentHeight - pageBottom;
        const lastCategoryId =
          visibleCategories[visibleCategories.length - 1]?.id ?? null;

        const firstCategorySection = visibleCategories[0]
          ? categorySectionRefs.current[visibleCategories[0].id]
          : null;

        // Mantém “Todos” ativo antes da primeira categoria entrar na área útil.
        if (
          firstCategorySection &&
          firstCategorySection.getBoundingClientRect().top > viewportTop + 16
        ) {
          setActiveCategoryId((previousId) =>
            previousId === null ? previousId : null,
          );
          return;
        }

        // Garante que a última categoria permaneça ativa no final do cardápio,
        // mesmo quando ela não tem altura suficiente para ocupar a maior área visível.
        if (distanceFromBottom <= bottomSafeArea) {
          setActiveCategoryId((previousId) =>
            previousId === lastCategoryId ? previousId : lastCategoryId,
          );
          return;
        }

        let currentCategoryId: string | null = null;
        let largestVisibleArea = 0;

        for (const category of visibleCategories) {
          const section = categorySectionRefs.current[category.id];
          if (!section) continue;

          const rect = section.getBoundingClientRect();
          const visibleTop = Math.max(rect.top, viewportTop);
          const visibleBottom = Math.min(rect.bottom, viewportBottom);
          const visibleArea = Math.max(0, visibleBottom - visibleTop);

          if (visibleArea > largestVisibleArea) {
            largestVisibleArea = visibleArea;
            currentCategoryId = category.id;
          }
        }

        // Fallback para transições muito rápidas entre seções.
        if (!currentCategoryId) {
          for (const category of visibleCategories) {
            const section = categorySectionRefs.current[category.id];
            if (!section) continue;

            const rect = section.getBoundingClientRect();

            if (rect.top <= viewportTop) {
              currentCategoryId = category.id;
            } else {
              break;
            }
          }
        }

        setActiveCategoryId((previousId) =>
          previousId === currentCategoryId ? previousId : currentCategoryId,
        );
      });
    };

    updateActiveCategoryOnScroll();
    window.addEventListener("scroll", updateActiveCategoryOnScroll, {
      passive: true,
    });
    window.addEventListener("resize", updateActiveCategoryOnScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveCategoryOnScroll);
      window.removeEventListener("resize", updateActiveCategoryOnScroll);
    };
  }, [search, visibleCategories, cartCount]);

  if (isLoading) {
    return (
      <div className="min-h-dvh w-full overflow-x-clip bg-[#ffffff] [font-family:'Sen',Helvetica] antialiased text-menu-text">
        <ThemeInjector
          primaryColor={selectedTheme.primaryColor}
          secondaryColor={selectedTheme.secondaryColor}
        />
        <CategoryMetaGlassEffectAssets />

        <div
          className="mx-auto flex min-h-dvh w-full max-w-[768px] flex-col bg-[#ffffff]"
          style={{
            paddingBottom: `calc(${cartCount > 0 ? 138 : 86}px + env(safe-area-inset-bottom))`,
          }}
        >
          {/* A top bar permanece normal durante o carregamento, sem skeleton. */}
          <StoreHeader
            storeName="Cardápio"
            logo={null}
            primaryColor={selectedTheme.primaryColor}
            showCompactIdentity={false}
            searchOpen={isHeaderSearchOpen}
            searchValue={search}
            onMenuClick={() => setIsSidebarOpen(true)}
            onSearchClick={() => setIsHeaderSearchOpen(true)}
            onSearchChange={setSearch}
            onSearchClose={() => {
              setSearch("");
              setIsHeaderSearchOpen(false);
            }}
          />

          <main className="w-full flex-1 px-4 pt-5 sm:px-6 md:px-8">
            <StoreInfo
              name=""
              logo={null}
              address=""
              isOpen
              minimumOrder={20}
              isLoading
            />

            <div className="h-3" aria-hidden="true" />

            <CategoryChips
              categories={[]}
              activeId={null}
              onSelect={() => undefined}
              isLoading
            />

            <section
              className="relative z-0 mt-3"
              aria-label="Carregando destaques"
            >
              <div className="mb-2.5 flex items-center gap-1.5">
                <MenuShimmer className="h-4 w-4 rounded-full" />
                <MenuShimmer className="h-[18px] w-[148px] rounded-full" />
              </div>

              <div className="-mx-4 overflow-hidden px-4 pb-1 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
                <div className="flex items-start gap-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex w-[132px] shrink-0 flex-col sm:w-[150px]"
                      aria-hidden="true"
                    >
                      <MenuShimmer className="h-[104px] w-full rounded-[10px] sm:h-[118px]" />
                      <MenuShimmer className="mt-2 h-[12px] w-[82%] rounded-full" />
                      <MenuShimmer className="mt-2 h-[14px] w-[70px] rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </main>
        </div>

        <CartSummaryBar
          quantity={cartCount}
          total={subtotal()}
          onClick={() => navigate("/carrinho")}
        />

        {/* A menu bar inferior também permanece normal, sem skeleton. */}
        <BottomNavigation
          cartQuantity={cartCount}
          onCartClick={() => navigate("/carrinho")}
          tableMode={isTableMode}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-dvh items-center justify-center [font-family:'Sen',Helvetica] antialiased">
        <p className="text-gray-500">Cardápio não encontrado.</p>
      </div>
    );
  }

  // Loja suspensa — bloqueia o cardápio inteiro (Option B). O backend ainda
  // retorna os produtos, mas escondemos no frontend pra não dar a falsa
  // impressão de loja operando.
  if (data.store.storeStatus === "suspended") {
    return <SuspendedStorePage storeName={data.store.name} />;
  }

  const { store, categories } = data;
  const isOpen = store.storeStatus === "open";
  const minimumOrder = getMinimumOrderValue(store);

  const categoryOptions = [
    { id: null, name: "Todos" },
    ...categories
      .filter((c) => c.isActive)
      .map((c) => ({ id: c.id, name: c.name })),
  ];

  return (
    <div className="min-h-dvh w-full overflow-x-clip bg-[#ffffff] [font-family:'Sen',Helvetica] antialiased text-menu-text">
      {store.facebookPixelId && hasCookieConsent() && (
        <FacebookPixel pixelId={store.facebookPixelId} />
      )}
      <ThemeInjector
        primaryColor={selectedTheme.primaryColor}
        secondaryColor={selectedTheme.secondaryColor}
      />
      <CategoryMetaGlassEffectAssets />

      <MenuPageSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        storeName={store.name}
        logo={store.logo}
        isOpen={isOpen}
        address={store.address}
        minimumOrder={minimumOrder}
        categories={categories
          .filter((category) => category.isActive)
          .map((category) => ({ id: category.id, name: category.name }))}
        activeCategoryId={activeCategoryId}
        hasFeaturedProducts={featuredProducts.length > 0}
        cartQuantity={cartCount}
        tableMode={isTableMode}
        onGoHome={() => handleCategorySelect(null)}
        onGoHighlights={handleFeaturedSelect}
        onCategorySelect={(categoryId) => handleCategorySelect(categoryId)}
        onCartClick={() => navigate("/carrinho")}
        onOrdersClick={() =>
          navigate(isTableMode ? "/comanda" : "/meus-pedidos")
        }
      />

      <div
        className="mx-auto flex min-h-dvh w-full max-w-[768px] flex-col bg-[#ffffff]"
        style={{
          paddingBottom: `calc(${cartCount > 0 ? 138 : 86}px + env(safe-area-inset-bottom))`,
        }}
      >
        <StoreHeader
          storeName={store.name}
          logo={store.logo}
          primaryColor={selectedTheme.primaryColor}
          showCompactIdentity={showHeaderIdentity}
          searchOpen={isHeaderSearchOpen}
          searchValue={search}
          onMenuClick={() => setIsSidebarOpen(true)}
          onSearchClick={() => setIsHeaderSearchOpen(true)}
          onSearchChange={setSearch}
          onSearchClose={() => {
            setSearch("");
            setIsHeaderSearchOpen(false);
          }}
        />

        <main className="w-full flex-1 px-4 pt-5 sm:px-6 md:px-8">
          <StoreInfo
            name={store.name}
            logo={store.logo}
            primaryColor={selectedTheme.primaryColor}
            address={store.address}
            isOpen={isOpen}
            nextOpenLabel={store.nextOpenLabel}
            minimumOrder={minimumOrder}
            tableNumber={tableNumber}
            isLoading={showContentSkeleton}
          />

          {!search.trim() && (
            <>
              <div className="h-3" aria-hidden="true" />
              <div
                ref={categoryStickySentinelRef}
                className="h-px"
                aria-hidden="true"
              />

              <div
                className={[
                  "sticky top-[48px] z-[80] -mx-4 isolate overflow-visible transition-all duration-200 sm:-mx-6 md:-mx-8",
                  isCategorySticky
                    ? "shadow-[0_12px_32px_rgba(15,23,42,0.07)]"
                    : "bg-white shadow-none",
                ].join(" ")}
                style={
                  isCategorySticky
                    ? {
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.76) 0%, rgba(255,255,255,0.46) 54%, rgba(255,255,255,0.62) 100%)",
                        backdropFilter:
                          "blur(24px) saturate(205%) contrast(1.12) brightness(1.02)",
                        WebkitBackdropFilter:
                          "blur(24px) saturate(205%) contrast(1.12) brightness(1.02)",
                        boxShadow:
                          "0 12px 32px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.88), inset 0 -1px 0 rgba(255,255,255,0.38)",
                      }
                    : undefined
                }
              >
                {isCategorySticky && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
                  >
                    <div
                      className="category-meta-glass-left absolute -left-10 -top-8 h-20 w-36 rounded-full opacity-70 blur-2xl"
                      style={{
                        background:
                          "radial-gradient(ellipse at center, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.30) 34%, rgba(255,255,255,0) 70%)",
                      }}
                    />
                    <div
                      className="category-meta-glass-right absolute -right-12 -top-10 h-24 w-40 rounded-full opacity-45 blur-2xl"
                      style={{
                        background:
                          "radial-gradient(ellipse at center, color-mix(in srgb, var(--menu-primary) 12%, rgba(255,255,255,0.26)) 0%, rgba(255,255,255,0.12) 40%, transparent 72%)",
                      }}
                    />
                    <div className="category-meta-glass-sheen absolute inset-y-0 -left-16 right-[-4rem]" />
                    <div className="absolute inset-x-0 top-0 h-px bg-white/75" />
                  </div>
                )}

                <div className="relative z-10 px-4 transition-all duration-200 sm:px-6 md:px-8">
                  <CategoryChips
                    categories={categoryOptions}
                    activeId={activeCategoryId}
                    onSelect={handleCategorySelect}
                    isSticky={isCategorySticky}
                    isLoading={showContentSkeleton}
                  />
                </div>

                <div
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute inset-x-0 top-full h-7 bg-gradient-to-b from-white/45 via-white/16 to-transparent transition-opacity duration-200",
                    isCategorySticky ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                />
              </div>
            </>
          )}

          {/* Resultados de busca ou categoria filtrada — grid plano */}
          {search.trim() && (
            <section className="relative z-0 mt-4">
              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <p>Nenhum produto encontrado.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      slug={slug ?? ""}
                      onNavigate={() => navigate(`/produto/${product.id}`)}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Visão padrão — sessões por categoria */}
          {!search.trim() && (
            <div className="mt-3 space-y-5">
              <div
                ref={menuContentStartRef}
                className="scroll-mt-[120px]"
                aria-hidden="true"
              />

              {featuredProducts.length > 0 && (
                <section
                  ref={featuredSectionRef}
                  className="relative z-0 scroll-mt-[120px]"
                  aria-labelledby="featured-products"
                >
                  <div className="mb-2.5 flex items-center gap-1.5">
                    {showContentSkeleton ? (
                      <>
                        <MenuShimmer className="h-4 w-4 shrink-0 rounded-full" />
                        <h2 id="featured-products" className="leading-none">
                          <MenuShimmer className="h-[18px] w-[148px] rounded-full" />
                          <span className="sr-only">Destaques do Dia</span>
                        </h2>
                      </>
                    ) : (
                      <>
                        <span
                          className="flex h-4 w-4 shrink-0 items-center justify-center text-[13px] leading-none"
                          aria-hidden="true"
                        >
                          🏅
                        </span>
                        <h2
                          id="featured-products"
                          className="text-[18px] font-bold leading-none tracking-[-0.35px] text-[#4a4a4a]"
                        >
                          Destaques do Dia
                        </h2>
                      </>
                    )}
                  </div>

                  <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 [&::-webkit-scrollbar]:hidden">
                    <div className="flex snap-x snap-mandatory items-start gap-3">
                      {featuredProducts.slice(0, 8).map((product) => {
                        const basePrice = getProductStartingPrice(product);
                        const showStartingFrom =
                          shouldShowStartingFrom(product);
                        const hasPromo =
                          product.promoPrice != null &&
                          product.promoPrice > 0 &&
                          basePrice != null &&
                          basePrice > 0 &&
                          product.promoPrice < basePrice;
                        const finalPrice = hasPromo
                          ? product.promoPrice!
                          : basePrice;
                        const discount =
                          hasPromo && basePrice != null && finalPrice != null
                            ? Math.round(
                                ((basePrice - finalPrice) / basePrice) * 100,
                              )
                            : 0;

                        return (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => navigate(`/produto/${product.id}`)}
                            className="group flex w-[132px] shrink-0 snap-start flex-col text-left transition-transform active:scale-[0.98] sm:w-[150px]"
                            aria-label={`Ver detalhes de ${product.name}`}
                          >
                            <div className="shrink-0 transition-transform duration-300 group-active:scale-[0.98]">
                              <FeaturedProductImage
                                imageUrl={product.imageUrl}
                                alt={product.name}
                                isLoading={showContentSkeleton}
                              />
                            </div>

                            <div className="mt-1.5 flex min-h-[58px] flex-col justify-start">
                              {showContentSkeleton ? (
                                <MenuShimmer className="h-[12px] w-[82%] rounded-full sm:h-[13px]" />
                              ) : (
                                <h3 className="line-clamp-1 text-[12px] font-semibold leading-tight tracking-[-0.16px] text-[#4a4a4a] sm:text-[13px]">
                                  {product.name}
                                </h3>
                              )}

                              {showContentSkeleton ? (
                                <MenuShimmer className="mt-1 h-[14px] w-[72px] rounded-full" />
                              ) : (
                                finalPrice != null &&
                                finalPrice > 0 && (
                                  <span className="mt-1 block whitespace-nowrap text-[13px] font-bold leading-none tracking-[-0.25px] text-[#4bb363] sm:text-[14px]">
                                    {!hasPromo && showStartingFrom ? (
                                      <span className="mr-1.5 text-[10px] font-normal tracking-normal sm:text-[11px]">
                                        A partir de
                                      </span>
                                    ) : null}
                                    {fmtBRL(finalPrice)}
                                  </span>
                                )
                              )}

                              <div className="mt-1 flex min-h-[12px] items-center gap-1">
                                {showContentSkeleton ? (
                                  <MenuShimmer className="h-[9px] w-[48px] rounded-full" />
                                ) : hasPromo ? (
                                  <>
                                    <span className="whitespace-nowrap text-[9px] font-bold leading-none text-[#4a4a4a] line-through sm:text-[10px]">
                                      {fmtBRL(basePrice)}
                                    </span>

                                    <span className="rounded-[2px] bg-[#4bb363] px-1 py-[1.5px] text-[7px] font-bold leading-none text-white">
                                      {discount}%
                                    </span>
                                  </>
                                ) : null}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}

              {visibleCategories.map((cat) => (
                <section
                  key={cat.id}
                  ref={(node) => {
                    categorySectionRefs.current[cat.id] = node;
                  }}
                  className="relative z-0 scroll-mt-[120px]"
                  aria-labelledby={`cat-${cat.id}`}
                >
                  <div className="flex w-fit flex-col gap-[5px]">
                    {showContentSkeleton ? (
                      <>
                        <h2 id={`cat-${cat.id}`} className="leading-none">
                          <MenuShimmer
                            className="h-5 rounded-full"
                            style={{
                              width: `${Math.min(Math.max(cat.name.length * 9, 84), 190)}px`,
                            }}
                          />
                          <span className="sr-only">{cat.name}</span>
                        </h2>
                        <MenuShimmer
                          className="ml-[1.5px] h-0.5 rounded-full"
                          style={{
                            width: `${Math.min(Math.max(cat.name.length * 9 - 2, 82), 188)}px`,
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <h2
                          id={`cat-${cat.id}`}
                          className="text-xl font-semibold leading-none tracking-[-0.33px] text-[#574f4f]"
                        >
                          {cat.name}
                        </h2>
                        <div className="ml-[1.5px] h-0.5 w-[calc(100%-1.5px)] rounded-full bg-menu-primary" />
                      </>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {cat.products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        slug={slug ?? ""}
                        onNavigate={() => navigate(`/produto/${product.id}`)}
                      />
                    ))}
                  </div>
                </section>
              ))}

              {visibleCategories.length > 0 && (
                <div className="h-[112px]" aria-hidden="true" />
              )}

              {visibleCategories.length === 0 && (
                <div className="py-16 text-center text-gray-400">
                  <p>Cardápio vazio no momento.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <CartSummaryBar
        quantity={cartCount}
        total={subtotal()}
        onClick={() => navigate("/carrinho")}
      />

      <BottomNavigation
        cartQuantity={cartCount}
        onCartClick={() => navigate("/carrinho")}
        tableMode={isTableMode}
      />

      <CookieBanner />
    </div>
  );
}
