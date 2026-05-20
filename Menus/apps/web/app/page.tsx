import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">AR Menu</h1>
      <p className="text-muted-foreground mb-8">
        Experience restaurant menus in augmented reality
      </p>
      <p className="text-sm text-muted-foreground">
        Scan a QR code from a restaurant to get started
      </p>
    </div>
  );
}
