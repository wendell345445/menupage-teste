import { useEffect, useRef } from "react";

interface CategoryOption {
  id: string | null;
  name: string;
}

interface Props {
  categories: CategoryOption[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryChips({ categories, activeId, onSelect }: Props) {
  const activeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!activeButtonRef.current) return;

    activeButtonRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeId]);

  return (
    <section
      className="relative z-20 mt-0 mb-0 overflow-visible"
      aria-label="Categorias"
    >
      <div className="relative -mx-4 overflow-hidden bg-[#ffffff] sm:-mx-6 md:-mx-8">
        <nav
          aria-label="Categorias de produtos"
          className="relative z-20 flex w-full touch-pan-x items-center gap-2.5 overflow-x-auto overflow-y-hidden px-4 pt-1.5 pb-2 overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] sm:px-6 md:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => {
            const isActive = activeId === category.id;
            return (
              <button
                key={category.id ?? "__all__"}
                ref={isActive ? activeButtonRef : undefined}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelect(category.id)}
                className={`relative z-20 flex h-[36px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] px-5 transition-all duration-200 ${
                  isActive
                    ? "shadow-none"
                    : "border border-[#ece7e7] bg-white shadow-none"
                }`}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(135deg, var(--menu-gradient-from) 0%, var(--menu-gradient-to) 100%)",
                      }
                    : undefined
                }
              >
                <span
                  className={`relative whitespace-nowrap text-[14px] leading-none ${
                    isActive
                      ? "font-semibold  tracking-[0.5px] text-white"
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
