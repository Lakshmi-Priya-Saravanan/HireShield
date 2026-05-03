from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from model import FraudDetectionModel

app = FastAPI(
    title="HireShield Fraud Detection API",
    description="Advanced ML pipeline for detecting fraudulent job postings.",
    version="1.0.0"
)

# Initialize the model singleton
fraud_model = FraudDetectionModel()

class JobDescription(BaseModel):
    description: str
    salary_range: str | None = None
    company_name: str | None = None
    url: str | None = None

class FraudScoreResponse(BaseModel):
    fraud_probability: float
    confidence_score: float
    risk_level: str
    red_flags: list[str]
    feature_importance: dict[str, float] = {}

@app.get("/health")
def read_root():
    return {"status": "ok", "service": "Fraud Detection ML Pipeline"}

@app.post("/analyze/job", response_model=FraudScoreResponse)
def analyze_job(job: JobDescription):
    if not job.description:
        raise HTTPException(status_code=400, detail="Job description cannot be empty")
        
    prediction = fraud_model.predict(job.description)
    
    red_flags = []
    for feature in prediction['extracted_features']:
        red_flags.append(f"Suspicious keyword/phrase detected: '{feature}'")
        
    if job.salary_range and "$" in job.salary_range and "entry" in job.description.lower():
        red_flags.append("Salary seems disproportionately high for an entry-level position.")
        prediction['fraud_probability'] = min(prediction['fraud_probability'] + 0.1, 1.0)
        
    return FraudScoreResponse(
        fraud_probability=prediction['fraud_probability'],
        confidence_score=prediction['confidence_score'],
        risk_level=prediction['risk_level'],
        red_flags=red_flags,
        feature_importance=prediction.get('feature_importance', {})
    )
