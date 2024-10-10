"use server";

import { sql } from "@vercel/postgres";
import { Pin } from "@/lib/types";
// import { revalidatePath } from "next/cache";

export const fetchPins = async (): Promise<Pin[]> => {
  try {
    const result = await sql`
    SELECT latitude, longitude, message, username FROM location_data;
    `;
    const pins = result.rows.map((row) => ({
      lat: parseFloat(row.latitude),
      lng: parseFloat(row.longitude),
      message: row.message,
      username: row.username
    }));
    // revalidatePath("/");
    // revalidatePath("/pins");
    return pins;
  } catch (error) {
    console.error("Error fetching pins:", error);
    return [];
  }
};
