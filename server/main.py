from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import mediapipe as mp
import tempfile
import os
import time
import logging
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Get port from environment variable with fallback to 3002
PORT = int(os.getenv("PORT", 3002))

app = FastAPI(title="AI Career Hub - Proctoring Service")

# Configure CORS with environment-aware origins
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://ai-career-hub-v1.onrender.com")
ALLOWED_ORIGINS = [
    FRONTEND_URL,
    "http://localhost:3000",  # Development frontend
    "http://localhost:3002",  # Development backend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint for API health check"""
    return {
        "status": "ok",
        "message": "AI Career Hub Proctoring Service is running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "ok",
        "timestamp": time.time()
    }

def analyze_video(video_path: str) -> dict:
    """
    Analyzes a video file for potential cheating behavior.
    
    Args:
        video_path (str): Path to the video file to analyze
        
    Returns:
        dict: Analysis results including cheating detection and detailed metrics
        
    Raises:
        HTTPException: If video processing fails
    """
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

        logger.info("Starting video analysis...")
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
            elif len(results.multi_face_landmarks) > 1:
                multiple_faces_count += 1
            else:
                face_landmarks = results.multi_face_landmarks[0]
                
                nose_tip = face_landmarks.landmark[1]
                if nose_tip.x < 0.3 or nose_tip.x > 0.7:
                    head_movement_count += 1

                upper_lip = face_landmarks.landmark[13]
                lower_lip = face_landmarks.landmark[14]
                lip_distance = abs(upper_lip.y - lower_lip.y)
                if lip_distance > 0.05:
                    lip_movement_count += 1

        analysis_time = time.time() - start_time

        if total_frames == 0:
            raise Exception("No frames were processed from the video")

        # Calculate violation percentages
        face_missing_percentage = (face_missing_count/total_frames) * 100
        
        cheating_detected = (
            face_missing_percentage > 10 or  # More than 10% frames without face
            multiple_faces_count > 1 or      # More than one person detected
            lip_movement_count > total_frames * 0.15 or  # Excessive lip movement
            head_movement_count > total_frames * 0.2     # Excessive head movement
        )

        logger.info(f"Analysis completed in {analysis_time:.2f} seconds")
        logger.info(f"Total frames analyzed: {total_frames}")

        return {
            "cheated": cheating_detected,
            "details": {
                "faceMissing": face_missing_count,
                "faceMissingPercentage": round(face_missing_percentage, 2),
                "multipleFaces": multiple_faces_count,
                "lipMovement": lip_movement_count,
                "headMovement": head_movement_count,
                "audioViolations": audio_violations,
                "totalFrames": total_frames,
                "analysisTimeSeconds": round(analysis_time, 2)
            }
        }
    except Exception as e:
        logger.error(f"Error analyzing video: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cap is not None:
            cap.release()
        if face_mesh is not None:
            face_mesh.close()

@app.post("/analyze")
async def analyze_test_recording(video: UploadFile = File(...)):
    """
    Endpoint to analyze a test recording for potential cheating behavior.
    
    Args:
        video (UploadFile): The video file to analyze
        
    Returns:
        dict: Analysis results
    """
    temp_file = None
    try:
        # Validate file type
        if not video.filename.endswith(('.webm', '.mp4')):
            raise HTTPException(
                status_code=400,
                detail="Invalid file format. Only .webm and .mp4 files are supported."
            )

        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.webm')
        content = await video.read()
        
        if not content:
            raise HTTPException(status_code=400, detail="Empty video file received")
        
        # Write content to temporary file
        temp_file.write(content)
        temp_file.flush()
        temp_file.close()
        
        # Analyze the video
        logger.info(f"Starting analysis for file: {video.filename}")
        result = analyze_video(temp_file.name)
        
        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temporary file
        if temp_file is not None:
            try:
                os.unlink(temp_file.name)
            except Exception as e:
                logger.warning(f"Failed to delete temporary file: {str(e)}")

if __name__ == "__main__":
    # Run the application
    logger.info(f"Starting server on port {PORT}")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=PORT,
        reload=False,  # Disable reload in production
        workers=1      # Adjust based on your needs
    )