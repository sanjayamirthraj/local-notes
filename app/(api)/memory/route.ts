import { sql } from "@vercel/postgres";

type Geolocation = {
  latitude: number;
  longitude: number;
  googlePlaceId: string | null;
  address: string | null;
  locationType: string | null;
};

export async function POST(request: Request) {
  try {
    const text = await request.text();
    const data = JSON.parse(text);

    // Combine all transcript segments into a single string
    const transcript = data.transcript_segments
      .map((segment) => segment.text)
      .join(" ");

    const startIndex = transcript.toLowerCase().indexOf("start");
    const finishIndex = transcript.toLowerCase().indexOf("finish");

    const message = startIndex !== -1 && finishIndex !== -1 && startIndex < finishIndex
      ? transcript.substring(startIndex + "start".length, finishIndex).trim()
      : "";

    const geolocation: Geolocation = {
      latitude: data.location.latitude,
      longitude: data.location.longitude,
      googlePlaceId: data.location.google_place_id,
      address: data.location.address,
      locationType: data.location.location_type,
    };

    const query = `
    INSERT INTO location_data (latitude, longitude, message)
    VALUES (${geolocation.latitude}, ${geolocation.longitude}, '${message}');
  `;
    try {
      // Execute the SQL query
      await sql.query(query);
    } catch (error) {
      console.error("Error creating new pin:", error);
    }
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }

  return new Response("Success!", {
    status: 200,
  });
}
//comment here