import GoogleMap from "@/components/GoogleMap";
import { Pin } from "@/lib/types";
import { sql } from "@vercel/postgres";

export const fetchPins = async (): Promise<Pin[]> => {
  try {
    const result = await sql`
        SELECT latitude, longitude, message FROM location_data;
      `;
    return result.rows.map((row) => ({
      lat: parseFloat(row.latitude),
      lng: parseFloat(row.longitude),
      message: row.message,
    }));
  } catch (error) {
    console.error("Error fetching pins:", error);
    return [];
  }
};

export default async function PinMap() {
  const listOfPins = await fetchPins();
  return <GoogleMap pins={listOfPins} />;
}
