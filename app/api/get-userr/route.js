// app/api/get-userr/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { models } from "@/models/User";
const { User } = models;

export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get email from query parameters or session
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || session.user.email;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user
    const user = await User.findOne({ mailId: email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data
    return NextResponse.json({
      username: user.username,
      gender: user.gender,
      country: user.country,
      state: user.state,
      domain: user.domain,
      otherDomain: user.otherDomain,
      skills: user.skills,
      skillScores: user.skillScores || [],
      hasCareerGuidance: !!user.careerGuidance,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
