import os
import cv2
import numpy as np
from PIL import Image
from ultralytics import YOLO

# Load the model once when the module is imported
# In a real scenario, this would point to the trained model at ../ml-model/models/track_fault_yolov8.pt
# We use a fallback to the base YOLOv8n model if the specific weights don't exist yet (for demo/testing)
MODEL_PATH = os.environ.get("YOLO_MODEL_PATH", "../ml-model/models/track_fault_yolov8.pt")

try:
    if os.path.exists(MODEL_PATH):
        model = YOLO(MODEL_PATH)
        print(f"Loaded custom model from {MODEL_PATH}")
    else:
        print(f"Warning: Model not found at {MODEL_PATH}. Loading base YOLOv8n model for testing.")
        model = YOLO("yolov8n.pt")  # Fallback for testing
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Fault mapping to standard classes for this project
# Note: In a real custom-trained model, the model.names dict will hold the actual classes
CLASS_NAMES = {
    0: 'crack',
    1: 'missing_fishplate',
    2: 'misalignment',
    3: 'obstruction',
    4: 'vegetation_overgrowth'
}

def determine_severity(fault_type, confidence, bbox_area_ratio):
    """
    Rule-based severity classification based on fault type, confidence, and size.
    """
    if fault_type == 'crack':
        if bbox_area_ratio > 0.05 or confidence > 0.9:
            return 'critical'
        return 'major'
    elif fault_type == 'missing_fishplate':
        return 'critical'
    elif fault_type == 'misalignment':
        return 'critical'
    elif fault_type == 'obstruction':
        if bbox_area_ratio > 0.1:
            return 'critical'
        return 'major'
    elif fault_type == 'vegetation_overgrowth':
        if bbox_area_ratio > 0.3:
            return 'major'
        return 'minor'
    
    # Fallback
    return 'minor'

def run_inference(image: Image.Image):
    """
    Run YOLOv8 inference on the provided image and return structured results.
    """
    if model is None:
        raise RuntimeError("ML model is not loaded. Please check the model path and initialization.")

    # Convert PIL image to OpenCV format (numpy array in BGR)
    img_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    img_h, img_w, _ = img_cv.shape
    img_area = img_h * img_w

    # Run YOLOv8 prediction
    # conf=0.25 sets the confidence threshold for detections
    results = model.predict(source=img_cv, conf=0.25, save=False)
    
    detections = []
    
    for r in results:
        boxes = r.boxes
        for box in boxes:
            # Extract bounding box coordinates
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            
            # Calculate bounding box area ratio (how much of the image the fault covers)
            bbox_area = (x2 - x1) * (y2 - y1)
            area_ratio = bbox_area / img_area if img_area > 0 else 0
            
            # Extract confidence and class ID
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            
            # Map to our specific classes.
            # If using a pre-trained model for demo, we override with our dict or use model.names
            if os.path.exists(MODEL_PATH):
                fault_type = model.names.get(cls_id, 'other')
            else:
                # Using our hardcoded map for demo purposes
                fault_type = CLASS_NAMES.get(cls_id, 'other')
            
            # Determine severity
            severity = determine_severity(fault_type, conf, area_ratio)
            
            detections.append({
                "fault_type": fault_type,
                "confidence": round(conf, 4),
                "severity": severity,
                "bounding_box": {
                    "x1": round(x1, 2),
                    "y1": round(y1, 2),
                    "x2": round(x2, 2),
                    "y2": round(y2, 2)
                }
            })
            
    # Sort detections by severity (critical first) and then confidence
    severity_rank = {'critical': 3, 'major': 2, 'minor': 1}
    detections.sort(key=lambda x: (severity_rank.get(x['severity'], 0), x['confidence']), reverse=True)
    
    return detections
