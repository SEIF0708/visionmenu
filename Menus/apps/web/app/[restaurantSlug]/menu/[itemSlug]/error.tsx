"use client";

export default function MenuItemError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">
        {error.message || "Failed to load menu item"}
      </p>
      <button
        onClick={reset}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
      >
        Try again
      </button>
    </div>
  );
}
