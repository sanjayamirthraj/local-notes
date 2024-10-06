import { NextResponse } from 'next/server';

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
  // TODO: Implement the logic to create a new pin
  console.log('Creating new pin with content:', noteContent);
  // Add your pin creation logic here
}
