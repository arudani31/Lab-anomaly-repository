from app.services.explainability import ExplainabilityService
import pandas as pd
import numpy as np

try:
    service = ExplainabilityService()
    service.load_resources()
    
    sample_input = {
        "age": 65,
        "temperature": 39.5,
        "heart_rate": 90,
        "oxygen_saturation": 92,
        "wbc_count": 12000
    }
    
    print("Input:", sample_input)
    explanation = service.explain_prediction(sample_input)
    print("Explanation:", explanation)

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
