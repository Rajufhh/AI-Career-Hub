// app/api/submit-feedback/route.js
import { models } from "@/models/User";
const { Feedback } = models;
import connectDB from "@/lib/mongodb";
export async function POST(req) {
  try {
    // Ensure database connection is established first
    await connectDB();

    const body = await req.json();
    const { section, stars, comment } = body;

    if (!section || typeof stars !== "number" || stars < 1 || stars > 5) {
      return new Response(JSON.stringify({ error: "Invalid feedback data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create feedback document
    const feedback = new Feedback({
      section,
      stars,
      comment: comment || "",
    });

    await feedback.save();

    return new Response(
      JSON.stringify({
        success: true,
        feedbackId: feedback._id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
