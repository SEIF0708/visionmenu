export default function MenuItemLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-[50vh] sm:h-[60vh] bg-muted animate-pulse" />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="h-8 w-64 bg-muted animate-pulse rounded mb-2" />
        <div className="h-4 w-24 bg-muted animate-pulse rounded mb-4" />
        <div className="h-6 w-20 bg-muted animate-pulse rounded mb-6" />
        <div className="h-16 w-full bg-muted animate-pulse rounded mb-4" />
        <div className="h-12 w-full bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}
