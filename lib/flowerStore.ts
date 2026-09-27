import { randomUUID } from "crypto";
import { supabaseAdmin } from "./supabaseClient";
import type { Flower } from "@/types/flower";

const BUCKET = "flower-images";
const TABLE = "flowers";

const MIN_SEPARATION = 18; // percentage points apart - flowers render at ~20% width, so this keeps them from overlapping
const MAX_ATTEMPTS = 30;

// How many flowers show on the garden itself at once. The Flower Library
// modal still shows every flower ever planted - this only caps the live
// island view so it doesn't get overcrowded. ~24 is a comfortable fit for
// this island shape with MIN_SEPARATION=18; push much past that and new
// flowers start losing their spacing.
export const MAX_GARDEN_FLOWERS = 24;

/** Picks a spot on the island artwork that's clear of the empty background and of existing flowers. */
function pickIslandPosition(existing: { x: number; y: number }[]): {
  x: number;
  y: number;
} {
  // Island art is roughly centered with an irregular "S" curve - keep new
  // flowers within a safe inner box so they land on grass, not on empty canvas.
  const randomPoint = () => ({
    x: 22 + Math.random() * 56, // 22% - 78%
    y: 20 + Math.random() * 55, // 20% - 75%
  });

  const distance = (
    a: { x: number; y: number },
    b: { x: number; y: number }
  ) => Math.hypot(a.x - b.x, a.y - b.y);

  let best = randomPoint();
  let bestMinDistance = -Infinity;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = randomPoint();
    const minDistance =
      existing.length === 0
        ? Infinity
        : Math.min(...existing.map((f) => distance(candidate, f)));

    if (minDistance >= MIN_SEPARATION) {
      return candidate; // good enough, stop looking
    }
    if (minDistance > bestMinDistance) {
      best = candidate;
      bestMinDistance = minDistance;
    }
  }

  // Garden's getting crowded - use whichever candidate had the most breathing room.
  return best;
}

export async function getAllFlowers(): Promise<Flower[]> {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select("id, image_url, x, y, created_at")
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Failed to load flowers: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    imageUrl: row.image_url,
    x: row.x,
    y: row.y,
    createdAt: row.created_at,
  }));
}

/**
 * A random subset of the full flower history, capped at MAX_GARDEN_FLOWERS,
 * for the garden's live view - a fresh shuffle on every call so different
 * visitors (or the same visitor reloading) see a different mix. Positions
 * are already spaced against the FULL history at plant time (see
 * pickIslandPosition), so any subset stays non-overlapping too.
 */
export async function getGardenFlowers(): Promise<Flower[]> {
  const all = await getAllFlowers();
  if (all.length <= MAX_GARDEN_FLOWERS) return all;

  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, MAX_GARDEN_FLOWERS);
}

export async function saveFlower(base64Png: string): Promise<Flower> {
  const id = randomUUID();
  const inlineData = base64Png.includes(",")
    ? base64Png.split(",")[1]
    : base64Png;
  const bytes = Buffer.from(inlineData, "base64");

  const path = `${id}.png`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: "image/png", upsert: false });

  if (uploadError) {
    throw new Error(`Failed to upload flower image: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(path);

  const existing = await getAllFlowers();
  const { x, y } = pickIslandPosition(existing);

  const { data, error: insertError } = await supabaseAdmin
    .from(TABLE)
    .insert({ id, image_url: publicUrlData.publicUrl, x, y })
    .select("id, image_url, x, y, created_at")
    .single();

  if (insertError) {
    throw new Error(`Failed to save flower record: ${insertError.message}`);
  }

  return {
    id: data.id,
    imageUrl: data.image_url,
    x: data.x,
    y: data.y,
    createdAt: data.created_at,
  };
}
