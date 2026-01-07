import requests
import json

url = "http://localhost:8000/api/v1/predict"

data = {
    "patient_id": "P9999",
    "age": 65,
    "gender": "Male",
    "temperature": 39.5,
    "heart_rate": 90,
    "oxygen_saturation": 92,
    "wbc_count": 12000,
    "has_flu_symptoms": 1
}

try:
    # Check root
    root_response = requests.get("http://localhost:8000/")
    print(f"Root Status: {root_response.status_code}")
    
    # Check OpenAPI
    openapi_response = requests.get("http://localhost:8000/openapi.json")
    print(f"OpenAPI Status: {openapi_response.status_code}")
    if openapi_response.status_code == 200:
        print("OpenAPI JSON:")
        print(json.dumps(openapi_response.json(), indent=2))

    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Response JSON:")
        # json.dumps escapes non-ascii by default
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error Response: {response.status_code}")
        print(f"Detail: {response.text}")
except Exception as e:
    print(f"Error: {e}")
