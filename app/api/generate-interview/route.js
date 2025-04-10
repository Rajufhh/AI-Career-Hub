import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

export async function POST(req) {
  try {
    const { role, techStack, experience } = await req.json();

    // Validate input
    if (!role || !techStack || !experience) {
      throw new Error("Missing required fields: role, techStack, or experience");
    }

    // Check API key
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is not configured");
    }

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use a known model

    // Create the prompt for generating interview questions
    const prompt = `
      Generate 5 technical interview questions for a ${role} position with experience level: ${experience} years.
      The candidate has mentioned the following tech stack: ${techStack}.
      
      For each question, provide:
      1. A challenging but fair technical question that would be asked in a real interview
      2. The ideal answer to evaluate the candidate's response
      
      Format the response as a JSON array of objects with the following structure:
      [
        {
          "question": "The technical question text",
          "idealAnswer": "The ideal answer to evaluate against"
        }
      ]
      
      Make sure the questions are appropriate for the experience level and specific to the tech stack mentioned.
      Return only the JSON array, with no additional text or explanations outside the JSON.
    `;

    // Generate content with retry logic
    let text;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text().trim();
    } catch (apiError) {
      console.error("API call failed:", apiError.message);
      throw new Error("Failed to fetch response from Gemini API");
    }

    // Parse the JSON response
    let questions;
    try {
      // Check if response is already valid JSON
      questions = JSON.parse(text);
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Response is not a valid array of questions");
      }
    } catch (parseError) {
      console.error("Raw response:", text);
      // Fallback: Try extracting JSON with regex if direct parse fails
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON found in response");
      }
    }

    // Validate question format
    for (const q of questions) {
      if (!q.question || !q.idealAnswer) {
        throw new Error("Invalid question format in response");
      }
    }

    return new Response(JSON.stringify({ questions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating interview questions:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate interview questions" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}