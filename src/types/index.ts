export interface ClassifierResult {
  score: number;
  signal: string;
}

export interface RedFlag {
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendation: string;
}

export interface AnalysisResult {
  final_risk_score: number;
  risk_level: 'LEGITIMATE' | 'SUSPICIOUS' | 'HIGH_RISK' | 'CRITICAL_SCAM';
  verdict: string;
  confidence: number;
  classifiers: {
    NaiveBayes: ClassifierResult;
    MLP: ClassifierResult;
    KNN: ClassifierResult;
    DecisionTree: ClassifierResult;
    RandomForest: ClassifierResult;
    AdaBoost: ClassifierResult;
    GradientBoost: ClassifierResult;
  };
  red_flags: RedFlag[];
  positive_signals: string[];
  overall_analysis: string;
  safe_to_apply: boolean;
}

export interface JobFormData {
  title: string;
  company?: string;
  location?: string;
  salary_range?: string;
  employment_type?: string;
  required_experience?: string;
  industry?: string;
  description: string;
  requirements?: string;
  company_profile?: string;
  has_company_logo?: boolean;
  telecommuting?: boolean;
  contact_email?: string;
}

export interface ScanRecord {
  id: string;
  job_title: string;
  company?: string;
  risk_level: 'LEGITIMATE' | 'SUSPICIOUS' | 'HIGH_RISK' | 'CRITICAL_SCAM';
  risk_score: number;
  red_flags_count: number;
  verdict?: string;
  safe_to_apply: boolean;
  created_at: string;
}
