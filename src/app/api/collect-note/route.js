import { NextResponse } from 'next/server';

export async function POST(request) {
    const { text } = await request.json();

    const match = text.match(/start note(.*?)end note/);

    if (match && match[1]) {
        return NextResponse.json({ message: match[1].trim() });
    } else {
        return NextResponse.json({ error: 'No note found' }, { status: 400 });
    }
}
