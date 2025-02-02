// app/api/update-skill-score/route.js
import { models } from '@/models/User';
const { User } = models;
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { skill, score } = body;

    if (!skill || typeof score !== 'number') {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find user and update skill score
    const user = await User.findOne({ mailId: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find existing skill score or create new one
    const existingScoreIndex = user.skillScores.findIndex(s => s.skill === skill);
    if (existingScoreIndex !== -1) {
      user.skillScores[existingScoreIndex].score = score;
    } else {
      user.skillScores.push({ skill, score });
    }

    await user.save();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating skill score:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}