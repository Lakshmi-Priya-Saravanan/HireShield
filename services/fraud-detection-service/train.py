import os
import json
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier

# Seed dataset of typical real and fraudulent job postings
SEED_DATA = [
    # --- LEGITIMATE JOBS ---
    {
        "text": "Software Engineer Google. We are looking for a Software Engineer to join our Core Infrastructure team. Experience in Java, C++, or Go, and designing high throughput distributed systems is required. Full benefits, medical insurance, and competitive salary packages matching industry standards are provided.",
        "label": 0
    },
    {
        "text": "Data Analyst Meta. Meta's Analytics team is looking for a senior analyst with experience in SQL, Python, Tableau, and statistical modelling. Candidate must hold a degree in Computer Science, Math, or related field. Positions are located in New York City or Menlo Park.",
        "label": 0
    },
    {
        "text": "Marketing Manager. Join our growing marketing team to drive customer acquisition campaigns, manage social media strategy, and coordinate content production. Requires 3+ years experience, communication skills, and digital marketing certifications.",
        "label": 0
    },
    {
        "text": "HR Generalist. Responsible for employee relations, payroll support, onboarding, and training programs. Candidates should have a bachelor's degree and SHRM certification is a plus. Apply directly on our company website careers page.",
        "label": 0
    },
    {
        "text": "Financial Analyst. Prepare financial statements, conduct budget variance analysis, and support corporate strategy. Experience with Excel models and corporate finance is essential. Chartered Accountant (CA) or CFA candidates preferred.",
        "label": 0
    },
    {
        "text": "Senior Product Manager. Lead cross-functional teams to build, scale, and iterate consumer web applications. 5+ years of software product management experience, user research, agile methodologies, and A/B testing frameworks required.",
        "label": 0
    },
    # --- FRAUDULENT / SCAM JOBS ---
    {
        "text": "EASY WORK FROM HOME! Earn $1500 to $2000 weekly doing basic data entry. No experience required. We send you a check for software purchase. Contact us immediately on Telegram @JobOfferScan to start working today!",
        "label": 1
    },
    {
        "text": "Payment Processing Clerk. Work from home and process financial transfers. You will receive wire transfers in your bank account, withdraw cash, and send it via Western Union. Keep 10% commission. High income potential, no credentials required.",
        "label": 1
    },
    {
        "text": "Urgent hiring! Assistant needed. Contact us on WhatsApp +1-234-567-890. Easy administrative work. Send your SSN and bank details for instant background verification. High salary package paid in Bitcoin or gift cards.",
        "label": 1
    },
    {
        "text": "Customer Support Agent. Work from home chat operator. Earn money immediately. Telegram registration required. We require you to setup an Anydesk session to connect to our systems. Safe and secure entry-level position.",
        "label": 1
    },
    {
        "text": "Mystery Shopper needed. We send you cash checks. You deposit the check at your local bank, buy prepaid gift cards from stores, and send us pictures of the codes. Quick earnings, keep $200 per transaction.",
        "label": 1
    },
    {
        "text": "Virtual Assistant Needed immediately. Work 2 hours a day and earn $800 weekly. SSN required for onboarding tax forms. Access to Teamviewer is a plus. Open to students and anyone seeking fast cash.",
        "label": 1
    }
]

# Duplicate the dataset slightly to provide more samples for fitting
DATASET = SEED_DATA * 5

def train_model():
    print("Initializing NLP Ensemble Model Training...")
    
    # Extract texts and labels
    texts = [item["text"] for item in DATASET]
    labels = [item["label"] for item in DATASET]
    
    # TF-IDF vectorizer configuration
    vectorizer = TfidfVectorizer(stop_words='english', max_features=150)
    X = vectorizer.fit_transform(texts)
    
    # Train Random Forest Classifier (Ensemble Approach)
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X, labels)
    
    # Create models directory
    os.makedirs('models', exist_ok=True)
    
    # Save model artifacts
    joblib.dump(vectorizer, 'models/vectorizer.pkl')
    joblib.dump(clf, 'models/classifier.pkl')
    
    print("✅ Model training complete. Artifacts saved: 'models/vectorizer.pkl' and 'models/classifier.pkl'.")

if __name__ == '__main__':
    train_model()
