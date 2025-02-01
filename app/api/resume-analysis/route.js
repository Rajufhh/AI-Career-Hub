// app/api/analyze/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from "pdf-parse";
import { NextResponse } from "next/server";

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume");
    const jobDescription = formData.get("jobDescription");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text;

    const model = genAi.getGenerativeModel({
      model: "gemini-pro",
    });

    const prompt = `I will give you a resume and a job description. Compare the resume against the job description and
      provide the following
      Resume: ${resumeText}
      Job Description: ${jobDescription}  
      Return only the following, each on a new line:
      - A single number score out of 10
      - Good points (in a single line)
      - Missing points (in a single line)
      - Possible additional points (in a single line)
      Be concise and to the point.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "An error occurred while analyzing the resume" },
      { status: 500 }
    );
  }
}
