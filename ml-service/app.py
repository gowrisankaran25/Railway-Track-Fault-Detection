from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import io
from PIL import Image

from inference_pipeline import run_inference

app = FastAPI(
    title="Railway Track Fault Detection ML API",
    description="Inference service for detecting faults in railway track images using YOLOv8.",
    version="1.0.0"
)

# Allow CORS for dashboard and backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float

class DetectionResult(BaseModel):
    fault_type: str
    confidence: float
    severity: str
    bounding_box: BoundingBox

class InferenceResponse(BaseModel):
    status: str
    message: str
    detections: List[DetectionResult]
    total_faults: int

@app.get("/health")
def health_check():
    """
    Health check endpoint to verify the service is running.
    """
    return {"status": "ok", "message": "ML Inference Service is running."}

@app.post("/predict", response_model=InferenceResponse)
async def predict_fault(file: UploadFile = File(...)):
    """
    Endpoint to receive an image file, run YOLOv8 inference, and return structured detection results.
    """
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        # Read the uploaded image file into memory
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Run inference pipeline
        detections = run_inference(image)
        
        return InferenceResponse(
            status="success",
            message="Inference completed successfully.",
            detections=detections,
            total_faults=len(detections)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Run the FastAPI server via uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
