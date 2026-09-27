"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Flower } from "@/types/flower";

interface FlowerLibraryModalProps {
  onClose: () => void;
}

export default function FlowerLibraryModal({ onClose }: FlowerLibraryModalProps) {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/flowers?scope=all")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setFlowers(data.flowers ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border-2 border-brand-black bg-white shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-brand-turqoise px-4 py-2 border-b-2 border-brand-black">
          <span className="font-urbane text-lg">Flower Library</span>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-4">
          {loading ? (
            <p className="font-spline text-sm text-brand-black/70">Loading...</p>
          ) : flowers.length === 0 ? (
            <p className="font-spline text-sm text-brand-black/70">
              No flowers planted yet - be the first!
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {flowers.map((flower) => (
                <img
                  key={flower.id}
                  src={flower.imageUrl}
                  alt="A hand-drawn flower"
                  className="aspect-square w-full rounded border border-brand-black/30 bg-white object-contain"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
