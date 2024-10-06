interface Geolocation {
  latitude: number;
  longitude: number;
  googlePlaceId: string?;
  address: string?;
  locationType: string?;
}

export async function POST(request: Request) {
  try {
    const text = await request.text();
    const data = JSON.parse(text);

    // Combine all transcript segments into a single string
    const transcript = data.transcript_segments
      .map((segment) => segment.text)
      .join(" ");
    console.log("Full transcript:", transcript);

    const geolocation: Geolocation = {
      latitude: data.location.latitude,
      longitude: data.location.longitude,
      googlePlaceId: data.location.google_place_id,
      address: data.location.address,
      locationType: data.location.location_type,
    };
    console.log("Geolocation:", geolocation);

    // TODO: Save to database
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }

  return new Response("Success!", {
    status: 200,
  });
}
