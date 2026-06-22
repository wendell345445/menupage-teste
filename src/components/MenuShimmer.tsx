import type { CSSProperties, HTMLAttributes } from "react";

interface MenuShimmerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: CSSProperties;
}

export function MenuShimmer({
  className = "",
  style,
  ...props
}: MenuShimmerProps) {
  return (
    <>
      <style>{`
        @keyframes menu-ui-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
      <div
        {...props}
        className={className}
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, #eeeeee 0%, #f8f8f8 42%, #eeeeee 84%)",
          backgroundSize: "240% 100%",
          animation: "menu-ui-shimmer 1.25s ease-in-out infinite",
          ...style,
        }}
      />
    </>
  );
}
