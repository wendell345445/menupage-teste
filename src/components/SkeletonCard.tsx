import { MenuShimmer } from "./MenuShimmer";

export function SkeletonCard() {
  return (
    <div
      className="relative min-h-[122px] w-full overflow-hidden rounded-[14px] border-0 bg-[#eeeeee] p-3 pr-[136px] shadow-none"
      aria-hidden="true"
    >
      <div className="relative z-10 pr-1">
        <MenuShimmer className="h-[18px] w-[74%] rounded-full" />

        <div className="mt-3 space-y-2">
          <MenuShimmer className="h-[9px] w-[92%] rounded-full" />
          <MenuShimmer className="h-[9px] w-[66%] rounded-full" />
        </div>

        <MenuShimmer className="mt-5 h-[18px] w-[92px] rounded-full" />
      </div>

      <div className="absolute bottom-[12px] right-[10px] top-[12px] z-10 w-[116px] overflow-hidden rounded-[12px] bg-[#e9e9e9]">
        <MenuShimmer
          className="absolute inset-0 rounded-[12px]"
          style={{ animationDelay: "120ms" }}
        />
        <MenuShimmer
          className="absolute bottom-[6px] right-[6px] z-20 h-5 w-5 rounded-full"
          style={{ animationDelay: "220ms" }}
        />
      </div>
    </div>
  );
}
