"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface QRCodeListProps {
  qrCodes: any[];
  menuItems: any[];
  locationSlug: string;
  webAppUrl: string;
}

export function QRCodeList({
  qrCodes,
  menuItems,
  locationSlug,
  webAppUrl,
}: QRCodeListProps) {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState("");
  const [generating, setGenerating] = useState(false);

  const generateQR = async () => {
    if (!selectedItem) return;
    setGenerating(true);

    const item = menuItems.find((m: any) => m.id === selectedItem);
    if (!item) {
      setGenerating(false);
      return;
    }

    const supabase = createClient();
    const code = `qr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const fullUrl = `${webAppUrl}/${locationSlug}/menu/${item.slug}`;

    const { error } = await supabase.from("qr_codes").insert({
      menu_item_id: selectedItem,
      code,
      full_url: fullUrl,
    });

    if (!error) {
      setSelectedItem("");
      router.refresh();
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold mb-3">Generate New QR Code</h2>
        <div className="flex gap-2">
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="flex h-9 flex-1 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          >
            <option value="">Select menu item</option>
            {menuItems.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <button
            onClick={generateQR}
            disabled={!selectedItem || generating}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {qrCodes.length === 0 ? (
        <div className="rounded-lg border p-6 text-center text-muted-foreground">
          No QR codes generated yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {qrCodes.map((qr) => (
            <div key={qr.id} className="rounded-lg border p-4">
              <div className="flex justify-center mb-3">
                <QRCodeSVG
                  id={`qr-${qr.id}`}
                  value={qr.full_url}
                  size={160}
                />
              </div>
              <p className="text-sm font-medium text-center">
                {qr.menu_items?.name || "Unknown"}
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1 break-all px-2">
                {qr.full_url}
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Scans: {qr.scan_count}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    const svg = document.getElementById(`qr-${qr.id}`);
                    if (svg) {
                      const blob = new Blob([svg.outerHTML], {
                        type: "image/svg+xml",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${qr.menu_items?.slug || "qr"}.svg`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }
                  }}
                  className="flex-1 border border-input px-3 py-1 rounded text-xs hover:bg-muted"
                >
                  Download SVG
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
