// app/api/update-user/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { models } from "@/models/User";
const { User } = models;

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request data
    const data = await request.json();

    // Find user
    const user = await User.findOne({ mailId: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user fields
    if (data.domain) user.domain = data.domain;
    if (data.domain === "other" && data.otherDomain)
      user.otherDomain = data.otherDomain;
    if (data.race) user.race = data.race;

    // Handle skills update
    if (data.skills && Array.isArray(data.skills)) {
      user.skills = data.skills;
    }

    // Save the updated user
    await user.save();

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        username: user.username,
        gender: user.gender,
        country: user.country,
        state: user.state,
        domain: user.domain,
        otherDomain: user.otherDomain,
        race: user.race,
        skills: user.skills,
        skillScores: user.skillScores || [],
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          error: Object.values(error.errors)
            .map((e) => e.message)
            .join(", "),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}
