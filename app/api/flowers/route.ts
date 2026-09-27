import { NextRequest, NextResponse } from "next/server";
import { getAllFlowers, getGardenFlowers, saveFlower } from "@/lib/flowerStore";
import { moderateFlowerDrawing } from "@/lib/gemini";

export async function GET(req: NextRequest) {
  const scope = req.nextUrl.searchParams.get("scope");
  try {
    const flowers =
      scope === "all" ? await getAllFlowers() : await getGardenFlowers();
    return NextResponse.json({ flowers });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not load the garden right now." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  let body: { image?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.image || typeof body.image !== "string") {
    return NextResponse.json(
      { error: "Missing 'image' (base64 PNG) in request body." },
      { status: 400 }
    );
  }

  // 1. Ask Gemini whether this is actually a flower and safe to publish.
  let moderation;
  try {
    moderation = await moderateFlowerDrawing(body.image);
  } catch (err) {
    console.error("Moderation failed:", err);
    return NextResponse.json(
      { error: "Couldn't verify your drawing right now. Please try again." },
      { status: 502 }
    );
  }

  if (!moderation.isAppropriate) {
    return NextResponse.json(
      { error: "That drawing can't be added to the garden." },
      { status: 422 }
    );
  }

  if (!moderation.isFlower) {
    return NextResponse.json(
      {
        error:
          moderation.reason ||
          "That doesn't look like a flower yet - give it another try!",
      },
      { status: 422 }
    );
  }

  // 2. Persist it.
  try {
    const flower = await saveFlower(body.image);
    return NextResponse.json({ flower }, { status: 201 });
  } catch (err) {
    console.error("Saving flower failed:", err);
    return NextResponse.json(
      { error: "Your flower passed the check but couldn't be saved. Please try again." },
      { status: 500 }
    );
  }
}
