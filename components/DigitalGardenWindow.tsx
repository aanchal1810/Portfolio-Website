"use client";

import Image from "next/image";
import { X, Rose } from "lucide-react";
import type { Flower } from "@/types/flower";

interface DigitalGardenWindowProps {
  flowers: Flower[];
  onOpenLibrary: () => void;
}

export default function DigitalGardenWindow({
  flowers,
  onOpenLibrary,
}: DigitalGardenWindowProps) {
  return (
    <div
      className="rounded-lg border-2 border-brand-black bg-white overflow-hidden w-full max-w-xl mx-auto md:mx-0"
      style={{ boxShadow: "-6px 6px 0px 0px #2E2E2E" }}
    >
      <div className="flex items-center justify-between bg-green-100 px-4 py-2 border-b-2 border-brand-black">
        <span className="font-urbane text-lg">My Digital Garden</span>
        <X size={18} strokeWidth={2} aria-hidden />
      </div>

      <div className="relative aspect-square w-full bg-white">
        <Image
          src="/images/island.png"
          alt="Garden island"
          fill
          className="object-contain"
          priority
        />

        {flowers.map((flower) => (
          <img
            key={flower.id}
            src={flower.imageUrl}
            alt="A hand-drawn flower planted in the garden"
            className="absolute w-[20%] aspect-square -translate-x-1/2 -translate-y-1/2 drop-shadow-md"
            style={{ left: `${flower.x}%`, top: `${flower.y}%` }}
          />
        ))}

        <button
          type="button"
          onClick={onOpenLibrary}
          className="absolute bottom-3 cursor-pointer right-3 flex items-center gap-1.5 rounded-md border-2 border-brand-black bg-brand-pink px-3 py-1.5 font-urbane text-sm"
          style={{ boxShadow: "-4px 4px 0px 0px #2E2E2E" }}
        >
          <Rose size={16} strokeWidth={2} />
          Flower Library
        </button>
      </div>
    </div>
  );
}
