"use client";

import { useEffect, useState } from "react";
import type { Flower } from "@/types/flower";
import DigitalGardenWindow from "./DigitalGardenWindow";
import PaintCanvas from "./PaintCanvas";
import FlowerLibraryModal from "./FlowerLibraryModal";

// Keep in sync with MAX_GARDEN_FLOWERS in lib/flowerStore.ts - this only
// caps how many stay visible client-side after a fresh plant; the server
// already caps what it hands back on load.
const MAX_GARDEN_FLOWERS = 24;

export default function GardenSection() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);

  async function loadFlowers() {
    const res = await fetch("/api/flowers");
    if (!res.ok) return;
    const data = await res.json();
    setFlowers(data.flowers ?? []);
  }

  useEffect(() => {
    loadFlowers();
  }, []);

  async function handlePlant(base64Png: string) {
    const res = await fetch("/api/flowers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Png }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? "Couldn't plant that flower.");
    }

    setFlowers((prev) => {
      const next = [...prev, data.flower];
      if (next.length <= MAX_GARDEN_FLOWERS) return next;
      // Over the cap - drop a random older flower from view (not the one
      // just planted) so the person always sees their own new flower land.
      const dropIndex = Math.floor(Math.random() * (next.length - 1));
      return next.filter((_, i) => i !== dropIndex);
    });
  }

  return (
    <section className="flex flex-col-reverse align-middle justify-center gap-6 bg-white p-6 md:flex-row">
      <DigitalGardenWindow
        flowers={flowers}
        onOpenLibrary={() => setLibraryOpen(true)}
      />
      <div className="w-full max-w-xl mx-auto md:mx-0">
        <PaintCanvas onPlant={handlePlant} />
      </div>

      {libraryOpen && <FlowerLibraryModal onClose={() => setLibraryOpen(false)} />}
    </section>
  );
}
