import { NextResponse } from 'next/server';
import { sql } from "@vercel/postgres";


/*
Format

{
  session_id: '6344ab76-4560-49d4-9a76-23030104b4c8',
  segments: [
    {
      text: 'when you get',
      speaker: 'SPEAKER_04',
      speaker_id: 4,
      is_user: false,
      start: 218.04,
      end: 218.22
    }
  ]
}
*/

let content = "";
let in_note = false;

export async function POST(request) {
  const response = await request.json();

  for (const segment of response.segments) {
    const lowerText = segment.text.toLowerCase();

    if (lowerText.includes('start') && !in_note) {
      in_note = true;
      content = ''; // Reset content when starting a new note
    }

    if (in_note) {
      content += ' ' + segment.text;
    }

    if (lowerText.includes('finish') && in_note) {
      in_note = false;

      // TODO: Implement create new pin function
      await createNewPin(content.trim());

      content = '';
    }
  }

  console.log(content);

  return NextResponse.json({ message: content });
}

async function createNewPin(noteContent) {
  // Generate random latitude and longitude
  const latitude = (Math.random() * 180 - 90).toFixed(6); // Random latitude between -90 and 90
  const longitude = (Math.random() * 360 - 180).toFixed(6); // Random longitude between -180 and 180

  // SQL query to insert the new pin
  const query = `
    INSERT INTO location_data (latitude, longitude, message)
    VALUES (${latitude}, ${longitude}, '${noteContent}');
  `;

  try {
    // Execute the SQL query
    await sql.query(query);
    console.log('Creating new pin with content:', noteContent);
  } catch (error) {
    console.error('Error creating new pin:', error);
  }
}
