export default function GlowButton({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`
        group relative inline-block p-[3px] rounded-xl 
        bg-gradient-to-r from-sky-400 to-pink-500 
        transition-all duration-300
        hover:shadow-[0_0_25px_rgba(244,65,165,0.6)]
        active:shadow-[0_0_10px_rgba(244,65,165,0.4)]
        ${className}
      `}
    >
      <button
        onClick={onClick}
        className="
          text-white 
          bg-black 
          rounded-lg 
          px-6 py-3
          text-lg font-medium
          w-full h-full
          shadow-[2px_2px_3px_rgba(0,0,0,0.7)]
        "
      >
        {children}
      </button>
    </div>
  );
}
