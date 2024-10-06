import GoogleMaps from "@/components/ui/GoogleMaps";
import { sql } from "@vercel/postgres";

export const fetchPins = async () => {
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

export default async function Home() {
  const listOfPins = await fetchPins();
  return (
    <div>
      <GoogleMaps pins={listOfPins} />
    </div>
  );
}
