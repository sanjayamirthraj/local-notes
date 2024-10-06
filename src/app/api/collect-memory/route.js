import { NextResponse } from 'next/server';

export async function POST(request) {
  const response = await request.json();
    
  console.log(response);

  return NextResponse.json({message: "Worked"});
  
}