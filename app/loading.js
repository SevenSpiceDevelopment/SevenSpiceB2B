export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none select-none bg-black/10 backdrop-blur-[2px] animate-fadeIn">
      {/* Pure Simple Animated Bouncing Dots */}
      <div className="flex items-center gap-2.5">
        <span className="w-3.5 h-3.5 rounded-full bg-primary shadow-sm animate-bounce [animation-delay:-0.3s]" />
        <span className="w-3.5 h-3.5 rounded-full bg-secondary-container shadow-sm animate-bounce [animation-delay:-0.15s]" />
        <span className="w-3.5 h-3.5 rounded-full bg-secondary shadow-sm animate-bounce" />
      </div>
    </div>
  );
}
