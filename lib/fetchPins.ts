"use server";

import { sql } from "@vercel/postgres";
import { Pin } from "@/lib/types";
// import { revalidatePath } from "next/cache";

export const fetchPins = async (): Promise<Pin[]> => {
  try {
    const result = await sql`
    SELECT username, latitude, longitude, message FROM location_data ORDER BY time DESC;
    `;
    const pins = result.rows.map((row) => ({
      name: row.username,
      lat: parseFloat(row.latitude),
      lng: parseFloat(row.longitude),
      message: row.message,
    }));
    // revalidatePath("/");
    // revalidatePath("/pins");
    return pins;
  } catch (error) {
    console.error("Error fetching pins:", error);
    return [];
  }
};
