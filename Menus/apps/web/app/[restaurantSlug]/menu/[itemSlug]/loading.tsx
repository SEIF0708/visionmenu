export default function MenuItemLoading() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="h-[45vh] sm:h-[55vh] bg-[#0A0A0F] skeleton-shimmer" />
      <div className="relative -mt-6 rounded-t-3xl bg-[#050505] border-t border-white/[0.06]">
        <div className="container mx-auto px-5 py-8 max-w-2xl space-y-4">
          <div className="h-8 w-48 skeleton-shimmer rounded-lg" />
          <div className="h-4 w-24 skeleton-shimmer rounded-lg" />
          <div className="h-6 w-20 skeleton-shimmer rounded-lg" />
          <div className="h-20 w-full skeleton-shimmer rounded-xl" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-20 skeleton-shimmer rounded-xl" />
            <div className="h-20 skeleton-shimmer rounded-xl" />
            <div className="h-20 skeleton-shimmer rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
