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
          className="relative z-20 flex w-full touch-pan-x items-center gap-2.5 overflow-x-auto overflow-y-hidden px-4 py-1.5 overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] sm:px-6 md:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {isLoading
            ? SKELETON_WIDTHS.map((width, index) => (
                <div
                  key={`${width}-${index}`}
                  className="relative z-20 h-[36px] shrink-0 overflow-hidden rounded-[13px] border-[0.5px] border-[#DDDDDD] bg-white"
                  style={{ width }}
                >
                  <MenuShimmer className="absolute inset-0 rounded-[13px]" />
                </div>
              ))
            : categories.map((category) => {
                const isActive = activeId === category.id;

                const categoryButton = (
                  <button
                    ref={isActive ? activeButtonRef : undefined}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onSelect(category.id)}
                    className={`relative z-20 isolate [contain:paint] flex h-[36px] shrink-0 items-center justify-center overflow-hidden rounded-[13px] border-[0.5px] px-5 transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive ? "scale-[1.015]" : "scale-100"
                    }`}
                    style={{
                      background: isSticky
                        ? "linear-gradient(135deg, rgba(255,255,255,0.44), rgba(255,255,255,0.22))"
                        : "#ffffff",
                      borderColor: isActive
                        ? isSticky
                          ? "#FFFFFF"
                          : "var(--menu-primary)"
                        : "#DDDDDD",
                      boxShadow:
                        isSticky && !isActive
                          ? "inset 0 1px 0 rgba(255,255,255,0.58)"
                          : "none",
                      backdropFilter: isSticky
                        ? "blur(14px) saturate(175%)"
                        : undefined,
                      WebkitBackdropFilter: isSticky
                        ? "blur(14px) saturate(175%)"
                        : undefined,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 rounded-[12.5px] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive
                          ? "scale-100 opacity-100"
                          : "scale-[0.96] opacity-0"
                      }`}
                      style={{
                        background: isSticky
                          ? "linear-gradient(135deg, color-mix(in srgb, var(--menu-primary) 98%, transparent), color-mix(in srgb, var(--menu-gradient-to) 92%, transparent))"
                          : "var(--menu-primary)",
                      }}
                    />

                    <span
                      className={`relative z-10 whitespace-nowrap text-[14px] font-semibold leading-none transition-[color,letter-spacing,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive
                          ? "translate-y-0 tracking-[0.5px] text-white"
                          : isSticky
                            ? "translate-y-0 tracking-[0.2px] text-[#1f2937]"
                            : "translate-y-0 tracking-[0.2px] text-[#5c5555]"
                      }`}
                    >
                      {category.name}
                    </span>
                  </button>
                );

                if (category.id === null) {
                  return (
                    <div
                      key="__all__"
                      className="relative z-20 flex shrink-0 items-center gap-3"
                    >
                      <svg
                        aria-hidden="true"
                        className="h-[18px] w-[18px] shrink-0 text-[#5c5555]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <circle cx="12" cy="5" r="1.8" />
                        <circle cx="12" cy="12" r="1.8" />
                        <circle cx="12" cy="19" r="1.8" />
                      </svg>
                      {categoryButton}
                    </div>
                  );
                }

                return <div key={category.id}>{categoryButton}</div>;
              })}
        </nav>
      </div>
    </section>
  );
}
