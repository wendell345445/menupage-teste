interface ProductImagePlaceholderProps {
  className?: string;
  iconClassName?: string;
}

const PLACEHOLDER_ICON = "/semfoto.svg";

export function ProductImagePlaceholder({
  className = "",
  iconClassName = "h-11 w-11",
}: ProductImagePlaceholderProps) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-[#ECECEC] ${className}`}
      aria-hidden="true"
    >
      <span
        className={`block shrink-0 bg-[#929292] ${iconClassName}`}
        style={{
          WebkitMaskImage: `url("${PLACEHOLDER_ICON}")`,
          maskImage: `url("${PLACEHOLDER_ICON}")`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </div>
  );
}
