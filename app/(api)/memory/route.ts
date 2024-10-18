import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
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
  startPhrases: string[],
  endPhrases: string[],
): string {
  const startPattern = startPhrases.join("|");
  const endPattern = endPhrases.join("|");
  const regex = new RegExp(`(${startPattern})(.*?)(${endPattern})`, "g");
  const matches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    matches.push(match[2]); // Capture the text between start and end phrases
  }

  if (matches.length === 0) throw new Error("No valid message found.");

  return matches[0];
}

export async function POST(request: NextRequest) {
  try {
    const reqUrl = request.url;
    const { searchParams } = new URL(reqUrl);
    const uid = searchParams.get("uid");

    // New code to fetch username based on uid
    const usernameResult = await sql`
      SELECT username FROM uid_to_username WHERE uid = ${uid};
    `;

    const username =
      usernameResult.rows.length > 0 ? usernameResult.rows[0].username : null;

    const text = await request.text();
    const data = JSON.parse(text);

    // Combine all transcript segments into a single string
    const transcript = data.transcript_segments
      .map((segment: Segment) => segment.text)
      .join(" ");

    let message = extractTextBetweenPhrases(
      transcript.toLowerCase(),
      ["start map note", "clip this"],
      ["end map note", "clip that"],
    ).trim();

    if (message.startsWith(".")) {
      message = message.substring(1).trim();
    }

    message = message.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

    console.log(message);

    const geolocation: Geolocation = {
      latitude: data.geolocation?.latitude,
      longitude: data.geolocation?.longitude,
      googlePlaceId: data.geolocation?.google_place_id,
      address: data.geolocation?.address,
      locationType: data.geolocation?.location_type,
    };

    await sql`
    INSERT INTO location_data (latitude, longitude, message, username, user_id)
    VALUES (${geolocation.latitude}, ${geolocation.longitude}, ${message}, ${username || uid}, ${uid});
    `;

    revalidatePath("/");
    revalidatePath("/pins");
    revalidatePath("/map");
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
