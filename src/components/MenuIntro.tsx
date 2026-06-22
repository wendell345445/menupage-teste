interface MenuIntroProps {
  visible: boolean;
}

export function MenuIntro({ visible }: MenuIntroProps) {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white"
      role="status"
      aria-label="Carregando Menu Panda"
    >
      <style>{`
        @keyframes menu-panda-intro-layer {
          0%, 76% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes menu-panda-intro-logo {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.86);
            filter: blur(10px);
          }
          38% {
            opacity: 1;
            transform: translateY(0) scale(1.035);
            filter: blur(0);
          }
          72% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-4px) scale(0.985);
            filter: blur(3px);
          }
        }

        @keyframes menu-panda-intro-glow {
          0% { opacity: 0; transform: scale(0.72); }
          42% { opacity: 0.2; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.12); }
        }

        @media (prefers-reduced-motion: reduce) {
          .menu-panda-intro-layer,
          .menu-panda-intro-logo,
          .menu-panda-intro-glow {
            animation-duration: 1ms !important;
          }
        }
      `}</style>

      <div
        className="menu-panda-intro-layer absolute inset-0 bg-white"
        style={{
          animation:
            "menu-panda-intro-layer 1.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        }}
      />

      <div className="relative flex items-center justify-center px-8">
        <div
          className="menu-panda-intro-glow absolute h-36 w-36 rounded-full"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--menu-primary, #2563EB) 24%, transparent) 0%, transparent 68%)",
            animation:
              "menu-panda-intro-glow 1.45s cubic-bezier(0.22, 1, 0.36, 1) forwards",
          }}
        />

        <img
          src="/LogoMenupanda1.svg"
          alt="Menu Panda"
          className="menu-panda-intro-logo relative z-10 block h-auto w-[154px] max-w-[58vw] sm:w-[174px]"
          style={{
            animation:
              "menu-panda-intro-logo 1.62s cubic-bezier(0.22, 1, 0.36, 1) forwards",
          }}
        />
      </div>
    </div>
  );
}
