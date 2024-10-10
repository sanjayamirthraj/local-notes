import { sql } from "@vercel/postgres";
import { NextRequest } from "next/server";

type Geolocation = {
  latitude: number;
  longitude: number;
  googlePlaceId: string | null;
  address: string | null;
  locationType: string | null;
};

type Segment = {
  text: string;
};

function extractTextBetweenPhrases(
  text: string,
  startPhrase: string,
  endPhrase: string
): string {
  const regex = new RegExp(`${startPhrase}(.*?)${endPhrase}`, "g");
  const matches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }

  if (matches.length == 0) throw new Error("No valid message found.");

  return matches[0];
}

export async function POST(request: NextRequest) {
  try {
    const reqUrl = request.url;
    const { searchParams } = new URL(reqUrl);
    const uid = searchParams.get("uid");
    const text = await request.text();
    const data = JSON.parse(text);

    // Combine all transcript segments into a single string
    const transcript = data.transcript_segments
      .map((segment: Segment) => segment.text)
      .join(" ");

    let message = extractTextBetweenPhrases(
      transcript.toLowerCase(),
      "and",
      "something"
    ).trim();

    if (message.startsWith(".")) {
      message = message.substring(1).trim();
    }

    message = message.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

    const geolocation: Geolocation = {
      latitude: data.geolocation?.latitude,
      longitude: data.geolocation?.longitude,
      googlePlaceId: data.geolocation?.google_place_id,
      address: data.geolocation?.address,
      locationType: data.geolocation?.location_type,
    };

    await sql`
    INSERT INTO location_data (latitude, longitude, message, username, user_id)
    VALUES (${geolocation.latitude}, ${geolocation.longitude}, ${message}, ${uid}, ${uid});
  `;
  } catch (error) {
    console.error("Error: " + error.message);
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }

  return new Response("Success!", {
    status: 200,
  });
}

export async function GET(request: Request) {
  console.error(request.text());
  return new Response("Worked", { status: 200 });
}
