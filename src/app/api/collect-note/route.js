import { NextResponse } from 'next/server';
import { useMemories } from '../components/contexts/memories';

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
  const { memories, addMemory } = useMemories();

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
      addMemory({ lat: 37.8685573, lng: -122.256697, message: content })

      content = ""
    }
  }
    
  console.log(content);

  return NextResponse.json({message: content});
  
}

console.log('i am taking ur data');
