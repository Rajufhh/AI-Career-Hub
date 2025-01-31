// app/api/generate-questions/route.js
import { NextResponse } from 'next/server';
import GeminiAPI from '@/utils/geminiAPI';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill');

    if (!skill) {
      return NextResponse.json(
        { error: 'Skill parameter is required' },
        { status: 400 }
      );
    }

    const gemini = new GeminiAPI();
    const questions = await gemini.generateQuestions(skill);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}