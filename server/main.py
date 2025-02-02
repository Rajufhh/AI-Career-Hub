from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import mediapipe as mp
import tempfile
import os
import time

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-career-hub-v1.onrender.com",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}

def analyze_video(video_path):
    cap = None
    face_mesh = None
    try:
        # Initialize variables for tracking violations
        face_missing_count = 0
        multiple_faces_count = 0
        lip_movement_count = 0
        head_movement_count = 0
        audio_violations = 0
        total_frames = 0

        # Initialize MediaPipe Face Mesh
        mp_face_mesh = mp.solutions.face_mesh
        face_mesh = mp_face_mesh.FaceMesh(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

        # Open video file
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise Exception("Failed to open video file")

        print("\n=== Starting Test Analysis ===")
        print("Analyzing video recording...")
        start_time = time.time()

        while cap.isOpened():
            success, image = cap.read()
            if not success:
                break

            total_frames += 1
            
            # Convert to RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(image)

            if not results.multi_face_landmarks:
                face_missing_count += 1
                print(".", end="", flush=True)
            elif len(results.multi_face_landmarks) > 1:
                multiple_faces_count += 1
                print("M", end="", flush=True)
            else:
                face_landmarks = results.multi_face_landmarks[0]
                
                nose_tip = face_landmarks.landmark[1]
                if nose_tip.x < 0.3 or nose_tip.x > 0.7:
                    head_movement_count += 1
                    print("H", end="", flush=True)
                else:
                    print(".", end="", flush=True)

                upper_lip = face_landmarks.landmark[13]
                lower_lip = face_landmarks.landmark[14]
                lip_distance = abs(upper_lip.y - lower_lip.y)
                if lip_distance > 0.05:
                    lip_movement_count += 1

        analysis_time = time.time() - start_time

        if total_frames == 0:
            raise Exception("No frames were processed from the video")

        cheating_detected = (
            face_missing_count > total_frames * 0.1 or
            multiple_faces_count > 1 or
            lip_movement_count > total_frames * 0.15 or
            head_movement_count > total_frames * 0.2
        )

        print("\n\n=== Test Analysis Results ===")
        print(f"Analysis completed in {analysis_time:.2f} seconds")
        print(f"Total frames analyzed: {total_frames}")
        print("\nViolations Detected:")
        print(f"• Face Missing Incidents: {face_missing_count} ({(face_missing_count/total_frames)*100:.1f}% of frames)")
        print(f"• Multiple Faces Detected: {multiple_faces_count} times")
        print(f"• Lip Movement Incidents: {lip_movement_count} times")
        print(f"• Head Movement Violations: {head_movement_count} times")
        print(f"• Audio Violations: {audio_violations} times")
        print("\nFinal Verdict:")
        print("❌ CHEATING DETECTED" if cheating_detected else "✅ NO CHEATING DETECTED")
        print("=" * 30 + "\n")

        return {
            "cheated": cheating_detected,
            "details": {
                "faceMissing": face_missing_count,
                "multipleFaces": multiple_faces_count,
                "lipMovement": lip_movement_count,
                "headMovement": head_movement_count,
                "audioViolations": audio_violations
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Properly release resources
        if cap is not None:
            cap.release()
        if face_mesh is not None:
            face_mesh.close()

@app.post("/analyze")
async def analyze_test_recording(video: UploadFile = File(...)):
    temp_file = None
    try:
        # Create temporary file with a specific suffix
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.webm')
        content = await video.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty video file received")
        
        temp_file.write(content)
        temp_file.flush()
        temp_file.close()  # Close the file handle explicitly
        
        # Analyze the video
        result = analyze_video(temp_file.name)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temporary file
        if temp_file is not None:
            try:
                os.unlink(temp_file.name)
            except Exception as e:
                print(f"Warning: Failed to delete temporary file: {e}")
