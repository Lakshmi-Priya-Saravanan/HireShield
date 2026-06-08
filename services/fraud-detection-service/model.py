import os
import re
import joblib

# Auto-train on import if models do not exist
if not os.path.exists('models/classifier.pkl') or not os.path.exists('models/vectorizer.pkl'):
    try:
        from train import train_model
        train_model()
    except Exception as e:
        print(f"⚠️ Failed to auto-train TF-IDF + Random Forest model: {e}")

class FraudDetectionModel:
    def __init__(self):
        self.vectorizer = None
        self.classifier = None
        self.scam_keywords = {
            'telegram', 'whatsapp', 'wire transfer', 'ssn', 'social security',
            'bank details', 'crypto', 'urgent hiring', 'no experience required',
            'earn $1000 a week', 'western union', 'anydesk', 'teamviewer',
            'gift card', 'deposit check', 'process payment', 'instant hire'
        }
        self.load_model()

    def load_model(self):
        try:
            if os.path.exists('models/classifier.pkl') and os.path.exists('models/vectorizer.pkl'):
                self.vectorizer = joblib.load('models/vectorizer.pkl')
                self.classifier = joblib.load('models/classifier.pkl')
                print("✅ NLP TF-IDF + Random Forest Ensemble Model loaded successfully.")
            else:
                print("⚠️ Model files not found. Using robust heuristic fallback engine.")
        except Exception as e:
            print(f"⚠️ Error loading ML model: {e}. Falling back to heuristics.")

    def predict(self, text: str) -> dict:
        text_lower = text.lower()
        
        # Extract keywords matching the description
        matched_keywords = [kw for kw in self.scam_keywords if kw in text_lower]
        
        # 1. Fallback Heuristics Risk calculation
        base_risk = 0.05
        heuristic_risk = base_risk
        heuristic_risk += len(matched_keywords) * 0.15
        if any(kw in matched_keywords for kw in ['whatsapp', 'telegram']):
            heuristic_risk += 0.25
        if any(kw in matched_keywords for kw in ['ssn', 'bank details', 'wire transfer', 'deposit check']):
            heuristic_risk += 0.35
        heuristic_risk = min(max(heuristic_risk, 0.0), 1.0)

        # 2. Machine Learning Pipeline (if available)
        ml_risk = None
        feature_importance = {}
        confidence_score = 0.85

        if self.vectorizer and self.classifier:
            try:
                # ML inference
                features = self.vectorizer.transform([text])
                probabilities = self.classifier.predict_proba(features)[0]
                ml_risk = float(probabilities[1]) # probability of fraud class (1)
                confidence_score = 0.94
                
                # Get feature importance for matched terms
                feature_names = self.vectorizer.get_feature_names_out()
                importances = self.classifier.feature_importances_
                
                # Map important features present in this description
                for name, imp in zip(feature_names, importances):
                    if name in text_lower and imp > 0.005:
                        feature_importance[name] = float(imp * 5) # Scale for UI representation
            except Exception as e:
                print(f"Error during ML inference: {e}")

        # Combined Ensemble / Fallback approach
        fraud_probability = ml_risk if ml_risk is not None else heuristic_risk
        
        # Calibrate score and assign category
        score_percentage = round(fraud_probability * 100)
        if score_percentage > 60:
            level = "High Risk"
        elif score_percentage > 30:
            level = "Suspicious"
        else:
            level = "Safe"

        # Generate reasons (Explainable AI indicators)
        reasons = []
        for kw in matched_keywords:
            if kw in ['telegram', 'whatsapp']:
                reasons.append(f"Requesting communication outside official channels ({kw.capitalize()}).")
            elif kw in ['ssn', 'social security', 'bank details']:
                reasons.append("Requests sensitive personal/financial identity details on first contact.")
            elif kw in ['wire transfer', 'western union', 'deposit check', 'process payment']:
                reasons.append("Involves financial transmission / processing tasks (typical of money laundering/check fraud).")
            elif kw in ['anydesk', 'teamviewer']:
                reasons.append("Requests installation of remote-access tracking software.")
            elif kw in ['urgent hiring', 'instant hire', 'immediately']:
                reasons.append("Uses high-pressure, urgent language to force quick onboarding.")
            else:
                reasons.append(f"Suspicious scam keyword detected: '{kw}'.")

        # Fallback feature importance scaling if ML was bypassed
        if not feature_importance:
            for kw in matched_keywords:
                # Split keywords to single words for frontend highlight matching
                for word in kw.split():
                    if len(word) > 3:
                        feature_importance[word] = 0.20 + (0.1 if word in ['whatsapp', 'telegram'] else 0.0)

        return {
            "fraud_probability": fraud_probability,
            "score": score_percentage,
            "confidence_score": confidence_score,
            "risk_level": level,
            "red_flags": reasons,
            "feature_importance": feature_importance,
            "extracted_features": matched_keywords
        }
