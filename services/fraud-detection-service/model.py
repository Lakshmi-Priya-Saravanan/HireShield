import joblib
from pydantic import BaseModel
import re

# Mocked Feature Extractor simulating TF-IDF or BERT Embeddings
class FeatureExtractor:
    def __init__(self):
        self.scam_keywords = {
            'telegram', 'whatsapp', 'wire transfer', 'ssn', 'social security',
            'bank details', 'crypto', 'urgent hiring', 'no experience required',
            'earn $1000 a week', 'western union', 'anydesk', 'teamviewer'
        }

    def extract_features(self, text: str) -> dict:
        text_lower = text.lower()
        features = {
            'keyword_matches': 0,
            'has_contact_app': int('whatsapp' in text_lower or 'telegram' in text_lower),
            'has_urgent_tone': int('urgent' in text_lower or 'immediately' in text_lower),
            'has_financial_info_request': int('bank' in text_lower or 'ssn' in text_lower),
            'matched_keywords': []
        }
        
        for kw in self.scam_keywords:
            if kw in text_lower:
                features['keyword_matches'] += 1
                features['matched_keywords'].append(kw)
                
        return features

class FraudDetectionModel:
    def __init__(self):
        self.extractor = FeatureExtractor()
        # In a real scenario, we would load an XGBoost or BERT model here:
        # self.model = joblib.load("models/xgboost_fraud_v1.pkl")
        
    def predict(self, text: str):
        features = self.extractor.extract_features(text)
        
        # Mocking inference logic based on feature weights
        base_risk = 0.05
        risk_score = base_risk
        
        risk_score += features['keyword_matches'] * 0.15
        if features['has_contact_app']: risk_score += 0.30
        if features['has_financial_info_request']: risk_score += 0.40
        if features['has_urgent_tone']: risk_score += 0.10
        
        risk_score = min(max(risk_score, 0.0), 1.0)
        
        if risk_score > 0.7:
            level = "Critical Risk"
        elif risk_score > 0.4:
            level = "Medium Risk"
        else:
            level = "Low Risk"
            
        # Simulate SHAP feature importance for Explainable AI (XAI)
        feature_importance = {}
        for kw in features['matched_keywords']:
            feature_importance[kw] = 0.15 + (0.05 if kw in ['whatsapp', 'telegram'] else 0)
            
        return {
            "fraud_probability": risk_score,
            "confidence_score": 0.92, # Simulated model confidence
            "risk_level": level,
            "extracted_features": features['matched_keywords'],
            "feature_importance": feature_importance
        }
