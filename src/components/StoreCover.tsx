import { useEffect, useState } from "react";

import { resolveImageUrl } from "@/shared/lib/imageUrl";

const COVER_SKELETON_MIN_MS = 800;
const PUBLIC_FALLBACK_COVER =
  "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=86";

interface Props {
  storeName: string;
  image?: string | null;
  isLoading?: boolean;
}

function getCoverImageUrl(url: string): string {
  const resolved = resolveImageUrl(url) ?? url;

  if (!resolved.includes("cloudinary.com")) return resolved;

  return resolved.replace("/upload/", "/upload/f_auto,q_auto,w_1400/");
}

function CoverShimmerSkeleton() {
  return (
    <>
      <style>{`
        @keyframes menu-cover-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, #e9e9e9 0%, #f7f7f7 42%, #e9e9e9 84%)",
          backgroundSize: "240% 100%",
          animation: "menu-cover-shimmer 1.25s ease-in-out infinite",
        }}
      />
    </>
  );
}

export function StoreCover({ storeName, image, isLoading = false }: Props) {
  const coverUrl = getCoverImageUrl(image || PUBLIC_FALLBACK_COVER);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const [canHideSkeleton, setCanHideSkeleton] = useState(false);

  useEffect(() => {
    setIsImageLoaded(false);
    setHasImageError(false);
    setCanHideSkeleton(false);

    const timer = window.setTimeout(() => {
      setCanHideSkeleton(true);
    }, COVER_SKELETON_MIN_MS);

    return () => window.clearTimeout(timer);
  }, [coverUrl]);

  const showSkeleton =
    isLoading || (!hasImageError && (!isImageLoaded || !canHideSkeleton));
  const showImage =
    !isLoading && !hasImageError && isImageLoaded && canHideSkeleton;

  return (
    <section
      className="relative -mx-4 overflow-hidden bg-[var(--menu-primary)] sm:-mx-6 md:-mx-8"
      aria-label={`Capa de ${storeName}`}
      aria-busy={showSkeleton}
    >
      <div className="relative h-[111px] w-full sm:h-[138px] md:h-[152px]">
        {!hasImageError ? (
          <img
            src={coverUrl}
            alt={`Capa de ${storeName}`}
            className={`absolute inset-0 block h-full w-full object-cover object-center transition-[opacity,transform] duration-500 ${
              showImage ? "scale-100 opacity-100" : "scale-[1.02] opacity-0"
            }`}
            loading="eager"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => {
              setHasImageError(true);
              setIsImageLoaded(true);
            }}
          />
        ) : null}

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/[0.03] to-black/[0.08]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/16 to-transparent"
          aria-hidden="true"
        />

        {showSkeleton ? <CoverShimmerSkeleton /> : null}
      </div>
    </section>
  );
}
