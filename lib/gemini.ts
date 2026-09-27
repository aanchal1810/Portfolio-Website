import type { ModerationResult } from "@/types/flower";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Sends the hand-drawn PNG to Gemini and asks it to confirm:
 *   1. the drawing is recognizably a flower / plant, and
 *   2. the content is appropriate (no hate symbols, gore, nudity, slurs, etc. hidden in the doodle).
 *
 * Throws if the Gemini call itself fails (network/key issues) - the caller
 * should treat that as "could not verify" and reject the submission rather
 * than silently letting it through.
 */
export async function moderateFlowerDrawing(
  base64Png: string
): Promise<ModerationResult> {
  // Explicit opt-in only, and only outside production - lets you iterate on
  // layout/CSS locally without spending your daily Gemini quota on every
  // click. Never set SKIP_MODERATION=true in a deployed environment.
  if (process.env.NODE_ENV !== "production" && process.env.SKIP_MODERATION === "true") {
    return { isFlower: true, isAppropriate: true, reason: "Moderation skipped (dev mode)." };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set on the server");
  }

  // Strip the "data:image/png;base64," prefix if the client sent a data URL.
  const inlineData = base64Png.includes(",")
    ? base64Png.split(",")[1]
    : base64Png;

  const prompt = `You are a moderator for a community garden website where visitors hand-draw a single flower on a small canvas.
Look at the attached image and decide:
1. "isFlower": true only if the drawing is plausibly a flower, plant, or blossom (simple, childlike, or abstract drawings count - it just needs to clearly be a flower/plant and not some other object).
2. "isAppropriate": true only if the image contains nothing offensive, sexual, violent, hateful, or otherwise inappropriate for a public, all-ages website (including anything hidden in the details of the drawing).

Respond with ONLY minified JSON, no markdown fences, in exactly this shape:
{"isFlower": boolean, "isAppropriate": boolean, "reason": "one short sentence explaining the decision"}`;

  const requestBody = JSON.stringify({
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          { inline_data: { mime_type: "image/png", data: inlineData } },
        ],
      },
    ],
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json",
    },
  });

  // Gemini's free-tier model occasionally returns 503 "model overloaded" -
  // this is transient, so retry a couple of times with backoff before
  // giving up and telling the user to try again themselves.
  const MAX_ATTEMPTS = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    });

    if (response.ok) {
      const data = await response.json();
      const text: string | undefined =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("Gemini returned no content to parse");
      }

      try {
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        if (start === -1 || end === -1 || end < start) {
          throw new Error("no JSON object found");
        }
        const jsonSlice = text.slice(start, end + 1);
        const parsed = JSON.parse(jsonSlice);
        return {
          isFlower: Boolean(parsed.isFlower),
          isAppropriate: Boolean(parsed.isAppropriate),
          reason: String(parsed.reason ?? ""),
        };
      } catch {
        throw new Error(`Could not parse Gemini response as JSON: ${text}`);
      }
    }

    const errText = await response.text();
    lastError = new Error(`Gemini request failed (${response.status}): ${errText}`);

    // Only retry on transient server-side failures (503 overloaded, 429 rate limited).
    const isRetryable = response.status === 503 || response.status === 429;
    if (!isRetryable || attempt === MAX_ATTEMPTS) {
      throw lastError;
    }

    const backoffMs = 500 * 2 ** (attempt - 1); // 500ms, 1000ms
    await new Promise((resolve) => setTimeout(resolve, backoffMs));
  }

  // Unreachable, but keeps TypeScript happy.
  throw lastError ?? new Error("Gemini request failed for an unknown reason");
}
