from pydantic import BaseModel
from typing import Dict, Optional

class PatientData(BaseModel):
    patient_id: str
    age: int
    gender: str
    temperature: float
    heart_rate: float
    oxygen_saturation: float
    wbc_count: float
    has_flu_symptoms: int

class PredictionResponse(BaseModel):
    patient_id: str
    is_abnormal: bool
    confidence: float
    explanation: str
    shap_values: Dict[str, float]
