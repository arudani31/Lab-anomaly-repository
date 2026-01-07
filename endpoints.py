from fastapi import APIRouter, HTTPException
from app.models.schemas import PatientData, PredictionResponse
from app.services.ml_model import MLModel
from app.services.explainability import ExplainabilityService
from app.services.workflow import ExplanationWorkflow

router = APIRouter()

# Initialize services
# In a real app, these should be singletons or dependencies
ml_model = MLModel()
explainer = ExplainabilityService()
workflow = ExplanationWorkflow()

@router.post("/predict", response_model=PredictionResponse)
async def predict_anomaly(data: PatientData):
    try:
        # Convert Pydantic model to dict
        input_data = data.dict()
        
        # 1. Predict
        prediction = ml_model.predict(input_data)
        confidence = ml_model.predict_proba(input_data)[1] # Probability of class 1
        
        # 2. Explain (SHAP)
        shap_values = explainer.explain_prediction(input_data)
        
        # 3. Generate Natural Language Explanation (RAG + LLM)
        explanation = workflow.run(prediction, shap_values, input_data)
        
        return PredictionResponse(
            patient_id=data.patient_id,
            is_abnormal=bool(prediction),
            confidence=confidence,
            explanation=explanation,
            shap_values=shap_values
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
