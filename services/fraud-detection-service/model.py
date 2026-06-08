import os
import re
import json
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

    def _predict_local(self, text: str) -> dict:
        text_lower = text.lower()
        matched_keywords = [kw for kw in self.scam_keywords if kw in text_lower]
        
        # Heuristics risk calculation
        base_risk = 0.05
        heuristic_risk = base_risk
        heuristic_risk += len(matched_keywords) * 0.15
        if any(kw in matched_keywords for kw in ['whatsapp', 'telegram']):
            heuristic_risk += 0.25
        if any(kw in matched_keywords for kw in ['ssn', 'bank details', 'wire transfer', 'deposit check']):
            heuristic_risk += 0.35
        heuristic_risk = min(max(heuristic_risk, 0.0), 1.0)

        # Machine Learning Pipeline
        ml_risk = None
        feature_importance = {}
        confidence_score = 0.85

        if self.vectorizer and self.classifier:
            try:
                features = self.vectorizer.transform([text])
                probabilities = self.classifier.predict_proba(features)[0]
                ml_risk = float(probabilities[1])
                confidence_score = 0.94
                
                # Get feature importance for matched terms
                feature_names = self.vectorizer.get_feature_names_out()
                importances = self.classifier.feature_importances_
                
                for name, imp in zip(feature_names, importances):
                    if name in text_lower and imp > 0.005:
                        feature_importance[name] = float(imp * 5)
            except Exception as e:
                print(f"Error during local ML inference: {e}")

        fraud_probability = ml_risk if ml_risk is not None else heuristic_risk
        score_percentage = round(fraud_probability * 100)
        
        if score_percentage > 60:
            level = "High Risk"
        elif score_percentage > 30:
            level = "Suspicious"
        else:
            level = "Safe"

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

        if not feature_importance:
            for kw in matched_keywords:
                for word in kw.split():
                    if len(word) > 3:
                        feature_importance[word] = 0.20 + (0.1 if word in ['whatsapp', 'telegram'] else 0.0)

        return {
            "fraud_probability": fraud_probability,
            "score": score_percentage,
            "confidence_score": confidence_score,
            "risk_level": level,
            "red_flags": reasons,
            "feature_importance": feature_importance
        }

    def predict(self, text: str) -> dict:
        api_key = os.environ.get('XAI_API_KEY') or os.environ.get('OPENAI_API_KEY')
        
        # If no LLM credentials provided, fallback to local NLP/ML model immediately
        if not api_key:
            return self._predict_local(text)

        # Dynamic LLM API call
        try:
            from openai import OpenAI
            
            # Auto-configure base URL for Grok vs OpenAI
            is_grok = os.environ.get('XAI_API_KEY') is not None or api_key.startswith('xai-')
            base_url = "https://api.x.ai/v1" if is_grok else None
            model_name = "grok-2-1212" if is_grok else "gpt-4o-mini"
            
            client = OpenAI(api_key=api_key, base_url=base_url)
            
            prompt = f"""
            You are an expert Cybersecurity Fraud Analyst specializing in detecting employment scams and fake job postings.
            Analyze the following job description text and output a structured JSON response containing:
            1. "score": an integer from 0 to 100 representing the fraud risk score (0 = completely safe, 100 = critical scam).
            2. "risk_level": "Safe" (score 0-30), "Suspicious" (score 31-60), or "High Risk" (score 61-100).
            3. "red_flags": a list of strings explaining specific warnings or indicators of fraud found in the text (e.g., requests to download remote software like Anydesk, mobile check deposits, payments in crypto, or interviews conducted entirely on WhatsApp/Telegram).
            4. "feature_importance": a JSON object mapping specific keywords or terms in the text (e.g., "WhatsApp", "Telegram", "SSN", "check") to their relative contribution weight (0.0 to 1.0) so we can highlight them in the UI. Select only terms that are indicators of fraud.

            Job Description:
            \"\"\"{text}\"\"\"

            Respond ONLY with a valid JSON object matching the schema. No markdown formatting backticks.
            """
            
            response = client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            
            result_json = json.loads(response.choices[0].message.content)
            
            # Ensure return fields match expected formats
            score = int(result_json.get('score', 0))
            risk_level = result_json.get('risk_level', 'Safe')
            red_flags = result_json.get('red_flags', [])
            feature_importance = result_json.get('feature_importance', {})
            
            print(f"✅ Successful AI LLM inference run via {model_name} (Risk score: {score}%)")
            
            return {
                "fraud_probability": score / 100.0,
                "score": score,
                "confidence_score": 0.98,
                "risk_level": risk_level,
                "red_flags": red_flags,
                "feature_importance": feature_importance
            }
            
        except Exception as err:
            print(f"⚠️ OpenAI/Grok AI API call failed: {err}. Falling back to local ensemble model.")
            return self._predict_local(text)
