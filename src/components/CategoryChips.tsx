import { useEffect, useRef } from "react";

import { MenuShimmer } from "./MenuShimmer";

interface CategoryOption {
  id: string | null;
  name: string;
}

interface Props {
  categories: CategoryOption[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  isSticky?: boolean;
  isLoading?: boolean;
}

const SKELETON_WIDTHS = [76, 104, 92, 118, 86];

export function CategoryChips({
  categories,
  activeId,
  onSelect,
  isSticky = false,
  isLoading = false,
}: Props) {
  const activeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isLoading || !activeButtonRef.current) return;

    activeButtonRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeId, isLoading]);

  return (
    <section
      className="relative z-20 mt-0 mb-0 overflow-visible"
      aria-label="Categorias"
      aria-busy={isLoading}
    >
      <div className="relative -mx-4 overflow-hidden bg-transparent transition-colors duration-200 sm:-mx-6 md:-mx-8">
        <nav
          aria-label="Categorias de produtos"
          className="relative z-20 flex w-full touch-pan-x items-center gap-2.5 overflow-x-auto overflow-y-hidden px-4 pt-1.5 pb-2 overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] sm:px-6 md:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {isLoading
            ? SKELETON_WIDTHS.map((width, index) => (
                <div
                  key={`${width}-${index}`}
                  className="relative z-20 h-[36px] shrink-0 overflow-hidden rounded-[16px] border border-[#DDDDDD] bg-white"
                  style={{ width }}
                >
                  <MenuShimmer className="absolute inset-0 rounded-[16px]" />
                </div>
              ))
            : categories.map((category) => {
                const isActive = activeId === category.id;

                return (
                  <button
                    key={category.id ?? "__all__"}
                    ref={isActive ? activeButtonRef : undefined}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onSelect(category.id)}
                    className="relative z-20 flex h-[36px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] px-5 transition-all duration-200"
                    style={
                      isSticky
                        ? isActive
                          ? {
                              background:
                                "linear-gradient(135deg, color-mix(in srgb, var(--menu-primary) 98%, transparent), color-mix(in srgb, var(--menu-gradient-to) 92%, transparent))",
                              border: "1px solid rgba(255,255,255,0.95)",
                              boxShadow: "none",
                              backdropFilter: "blur(14px) saturate(175%)",
                              WebkitBackdropFilter:
                                "blur(14px) saturate(175%)",
                            }
                          : {
                              background:
                                "linear-gradient(135deg, rgba(255,255,255,0.44), rgba(255,255,255,0.22))",
                              border: "1px solid #DDDDDD",
                              boxShadow:
                                "inset 0 1px 0 rgba(255,255,255,0.58)",
                              backdropFilter: "blur(14px) saturate(175%)",
                              WebkitBackdropFilter:
                                "blur(14px) saturate(175%)",
                            }
                        : isActive
                          ? {
                              background: "var(--menu-primary)",
                              border: "1px solid var(--menu-primary)",
                              boxShadow: "none",
                            }
                          : {
                              background: "#ffffff",
                              border: "1px solid #DDDDDD",
                              boxShadow: "none",
                            }
                    }
                  >
                    <span
                      className={`relative whitespace-nowrap text-[14px] leading-none ${
                        isActive
                          ? "font-semibold tracking-[0.5px] text-white"
                          : isSticky
                            ? "font-semibold tracking-[0.2px] text-[#1f2937]"
                            : "font-semibold tracking-[0.2px] text-[#5c5555]"
                      }`}
                    >
                      {category.name}
                    </span>
                  </button>
                );
              })}
        </nav>
      </div>
    </section>
  );
}
