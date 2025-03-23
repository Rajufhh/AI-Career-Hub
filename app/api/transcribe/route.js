import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { createReadStream } from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ensure the uploads directory exists
async function ensureUploadsDirectory() {
  const uploadsDir = join(process.cwd(), "public", "uploads");
  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.error("Error ensuring uploads directory:", error);
  }
  return uploadsDir;
}

// Save the audio file temporarily
async function saveFile(audioBlob) {
  const uploadsDir = await ensureUploadsDirectory();
  const fileName = `${uuidv4()}.webm`;
  const filePath = join(uploadsDir, fileName);

  const arrayBuffer = await audioBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await writeFile(filePath, buffer);
  return filePath;
}

// Transcribe audio using OpenAI Whisper and delete the file after processing
async function transcribeAudio(audioFilePath) {
  try {
    const response = await openai.audio.transcriptions.create({
      file: createReadStream(audioFilePath),
      model: "whisper-1",
      language: "en",
    });

    // Delete the file after transcription
    await unlink(audioFilePath);

    return response.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);

    // Ensure file is deleted even if transcription fails
    await unlink(audioFilePath).catch((err) =>
      console.error("Failed to delete file:", err)
    );

    throw new Error("Failed to transcribe audio");
  }
}

// API route handler
export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get("audio");
    const questionId = formData.get("questionId");

    if (!audioBlob) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Save the audio file
    const audioFilePath = await saveFile(audioBlob);

    // Transcribe the audio
    const transcription = await transcribeAudio(audioFilePath);

    return NextResponse.json({
      transcription,
      questionId,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process transcription" },
      { status: 500 }
    );
  }
}
