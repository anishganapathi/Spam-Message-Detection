from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import os
import numpy as np

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
# Assuming the model is in the parent directory relative to this file
model_path = os.path.join(os.path.dirname(__file__), "../spam_model.joblib")
try:
    model = joblib.load(model_path)
    print(f"Model loaded successfully from {model_path}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

class SMSRequest(BaseModel):
    text: str

@app.post("/predict")
def predict(request: SMSRequest):
    if model is None:
        return {"error": "Model not loaded"}
    
    # The model pipeline expects a list of strings
    prediction = model.predict([request.text])[0]
    
    # Get confidence score
    try:
        proba = model.predict_proba([request.text])[0]
        confidence = float(max(proba))
    except AttributeError:
        confidence = 1.0 # Fallback if model doesn't support predict_proba
    
    label = "Spam" if prediction == 1 else "Not Spam"
    
    return {
        "label": label,
        "confidence": confidence,
        "prediction": int(prediction)
    }

@app.get("/model-info")
def get_model_info():
    return {
        "model_name": "Logistic Regression",
        "vectorizer": "TF-IDF",
        "metrics": {
            "accuracy": 0.9677,
            "precision": 1.0,
            "recall": 0.7584,
            "f1_score": 0.8626
        },
        "dataset_info": {
            "source": "SMS Spam Collection Dataset",
            "total_samples": 5572,
            "training_samples": 4457,
            "test_samples": 1115
        }
    }

@app.get("/")
def read_root():
    return {"message": "SMS Spam Classification API is running"}
