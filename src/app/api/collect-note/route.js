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
  
  for (let s of response.segments) {
    if (s.text.toLowerCase().includes('start')) {
      in_note = true;
    }

    if (in_note) {
        content += ' ' + s.text;
    }

    if (s.text.toLowerCase().includes('finish')) {
      in_note != false;

      // Call create new pin function

      content = ""
    }
  }
    
  console.log(content);

  return NextResponse.json({message: content});
  
}
