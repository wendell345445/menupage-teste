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
import { SearchBar } from "../components/SearchBar";
import { CategoryChips } from "../components/CategoryChips";
import { CartSummaryBar } from "../components/CartSummaryBar";
import { BottomNavigation } from "../components/BottomNavigation";
import { MenuPageSidebar } from "../components/MenuPageSidebar";
import { useCartStore } from "../store/useCartStore";

import { useStoreSlug } from "@/hooks/useStoreSlug";
import { resolveImageUrl } from "@/shared/lib/imageUrl";
import { toast } from "@/shared/lib/toast";

const THEME_COLOR = "#2563EB";
const IMAGE_SKELETON_MIN_MS = 800;

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

function FeaturedProductImage({
  imageUrl,
  alt,
}: {
  imageUrl?: string | null;
  alt: string;
}) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [canHideImageSkeleton, setCanHideImageSkeleton] = useState(false);

  useEffect(() => {
    setIsImageLoaded(false);
    setCanHideImageSkeleton(false);

    const timer = window.setTimeout(() => {
      setCanHideImageSkeleton(true);
    }, IMAGE_SKELETON_MIN_MS);

    return () => window.clearTimeout(timer);
  }, [imageUrl]);

  const showImageSkeleton =
    Boolean(imageUrl) && (!isImageLoaded || !canHideImageSkeleton);
  const showProductImage =
    Boolean(imageUrl) && isImageLoaded && canHideImageSkeleton;

  return (
    <div className="relative h-[104px] w-full overflow-hidden rounded-[10px] bg-[#eeeeee] shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:h-[118px]">
      {imageUrl ? (
        <>
          {showImageSkeleton && (
            <ImageShimmerSkeleton roundedClass="rounded-[10px]" />
          )}
          <img
            src={getFeaturedImageUrl(imageUrl)}
            alt={alt}
            className={`block h-full w-full object-cover object-center transition-opacity duration-300 ${
              showProductImage ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)}
          />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-3xl text-gray-300 sm:text-4xl">
          🍔
        </div>
      )}
    </div>
  );
}

function getProductBasePrice(product: {
  variations?: Array<{ isActive?: boolean; price?: number | null }>;
  basePrice?: number | null;
}) {
  const activeVariations =
    product.variations?.filter(
      (variation) => variation.isActive && variation.price != null,
    ) ?? [];

  if (activeVariations.length > 0) {
    return Math.min(
      ...activeVariations.map((variation) => variation.price ?? 0),
    );
  }

  return product.basePrice ?? 0;
}

export function MenuPage() {
  const slug = useStoreSlug();
  const navigate = useNavigate();
  const { data, isLoading } = useMenu(slug);

  const setStore = useCartStore((s) => s.setStore);
  // Modo mesa só vale na aba que veio do QR (`/mesa/:token`).
  const { tableNumber, isTableMode } = useTableMode();
  const cartItems = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCategorySticky, setIsCategorySticky] = useState(false);
  const [showHeaderIdentity, setShowHeaderIdentity] = useState(false);
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
      <div className="min-h-dvh bg-[#ffffff] [font-family:'Sen',Helvetica] antialiased">
        <div className="h-[49px] bg-[#ffffff]" />
        <div className="mx-auto grid max-w-[768px] grid-cols-1 gap-3 px-4 pt-5 sm:grid-cols-2 sm:px-6 md:px-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
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
      <ThemeInjector primaryColor={THEME_COLOR} secondaryColor={THEME_COLOR} />

      <MenuPageSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        storeName={store.name}
        logo={store.logo}
        isOpen={isOpen}
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
          paddingBottom: `calc(${cartCount > 0 ? 152 : 86}px + env(safe-area-inset-bottom))`,
        }}
      >
        <StoreHeader
          storeName={store.name}
          logo={store.logo}
          primaryColor={THEME_COLOR}
          showCompactIdentity={showHeaderIdentity}
          onMenuClick={() => setIsSidebarOpen(true)}
          onShareClick={async () => {
            const shareData = {
              title: store.name,
              text: store.description,
              url: window.location.href,
            };
            if (navigator.share) {
              try {
                await navigator.share(shareData);
                return;
              } catch (err) {
                if ((err as DOMException)?.name === "AbortError") return;
              }
            }
            try {
              await navigator.clipboard.writeText(shareData.url);
              toast.success("Link copiado!", "Cole onde quiser compartilhar");
            } catch {
              toast.error("Não foi possível compartilhar", shareData.url);
            }
          }}
        />

        <main className="w-full flex-1 px-4 pt-5 sm:px-6 md:px-8">
          <StoreInfo
            name={store.name}
            logo={store.logo}
            primaryColor={THEME_COLOR}
            address={store.address}
            isOpen={isOpen}
            nextOpenLabel={store.nextOpenLabel}
            minimumOrder={minimumOrder}
            tableNumber={tableNumber}
          />

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Pesquisar"
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
                          "linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.42) 52%, rgba(255,255,255,0.64) 100%)",
                        backdropFilter: "blur(22px) saturate(185%)",
                        WebkitBackdropFilter: "blur(22px) saturate(185%)",
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
                      className="absolute -left-10 -top-8 h-20 w-36 rounded-full opacity-70 blur-2xl"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0) 68%)",
                      }}
                    />
                    <div
                      className="absolute -right-12 -top-10 h-24 w-40 rounded-full opacity-45 blur-2xl"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0) 70%)",
                      }}
                    />
                    <div className="absolute inset-x-0 top-0 h-px bg-white/75" />
                  </div>
                )}

                <div className="relative z-10 px-4 pt-0 pb-1.5 transition-all duration-200 sm:px-6 md:px-8">
                  <CategoryChips
                    categories={categoryOptions}
                    activeId={activeCategoryId}
                    onSelect={handleCategorySelect}
                    isSticky={isCategorySticky}
                  />
                </div>

                <div
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute inset-x-0 top-full h-10 bg-gradient-to-b from-white/45 via-white/16 to-transparent transition-opacity duration-200",
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
                  </div>

                  <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 [&::-webkit-scrollbar]:hidden">
                    <div className="flex snap-x snap-mandatory gap-3">
                      {featuredProducts.slice(0, 8).map((product) => {
                        const basePrice = getProductBasePrice(product);
                        const hasPromo =
                          product.promoPrice != null &&
                          product.promoPrice > 0 &&
                          basePrice > 0 &&
                          product.promoPrice < basePrice;
                        const finalPrice = hasPromo
                          ? product.promoPrice!
                          : basePrice;
                        const discount = hasPromo
                          ? Math.round(
                              ((basePrice - finalPrice) / basePrice) * 100,
                            )
                          : 0;

                        return (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => navigate(`/produto/${product.id}`)}
                            className="group w-[132px] shrink-0 snap-start text-left transition-transform active:scale-[0.98] sm:w-[150px]"
                            aria-label={`Ver detalhes de ${product.name}`}
                          >
                            <div className="transition-transform duration-300 group-active:scale-[0.98]">
                              <FeaturedProductImage
                                imageUrl={product.imageUrl}
                                alt={product.name}
                              />
                            </div>

                            <div className="mt-1.5 min-h-[42px]">
                              <h3 className="line-clamp-1 text-[12px] font-semibold leading-tight tracking-[-0.16px] text-[#4a4a4a] sm:text-[13px]">
                                {product.name}
                              </h3>

                              {finalPrice > 0 && (
                                <span className="mt-1 block whitespace-nowrap text-[13px] font-black leading-none tracking-[-0.25px] text-[#1f8f18] sm:text-[14px]">
                                  {fmtBRL(finalPrice)}
                                </span>
                              )}

                              {hasPromo && (
                                <div className="mt-1 flex items-center gap-1">
                                  <span className="whitespace-nowrap text-[9px] font-semibold leading-none text-[#4a4a4a] line-through sm:text-[10px]">
                                    {fmtBRL(basePrice)}
                                  </span>

                                  <span className="rounded-[2px] bg-[#1f8f18] px-1 py-[1.5px] text-[7px] font-bold leading-none text-white">
                                    {discount}%
                                  </span>
                                </div>
                              )}
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
                    <h2
                      id={`cat-${cat.id}`}
                      className="text-xl font-semibold leading-none tracking-[-0.33px] text-[#574f4f]"
                    >
                      {cat.name}
                    </h2>
                    <div className="ml-[1.5px] h-0.5 w-[calc(100%-1.5px)] rounded-full bg-menu-primary" />
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
