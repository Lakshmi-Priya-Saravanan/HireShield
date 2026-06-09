import { GoogleGenerativeAI } from "@google/generative-ai";
import { HIRESHIELD_SYSTEM_PROMPT } from "./prompts";
import { JobFormData } from "@/types";

const apiKey = process.env.GEMINI_API_KEY || '';

// Initialize client if key is set
const getGenAIClient = () => {
  if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY environment variable is missing.");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

export function buildUserPrompt(data: JobFormData): string {
  return `
Analyze this job posting for fraud indicators:

JOB TITLE: ${data.title}
COMPANY: ${data.company || "Not provided"}
LOCATION: ${data.location || "Not provided"}
SALARY: ${data.salary_range || "Not provided"}
EMPLOYMENT TYPE: ${data.employment_type || "Not provided"}
REQUIRED EXPERIENCE: ${data.required_experience || "Not provided"}
INDUSTRY: ${data.industry || "Not provided"}
TELECOMMUTING: ${data.telecommuting ? "Yes" : "No"}
HAS COMPANY LOGO: ${data.has_company_logo ? "Yes" : "No"}
CONTACT EMAIL: ${data.contact_email || "Not provided"}

JOB DESCRIPTION:
${data.description}

REQUIREMENTS:
${data.requirements || "Not provided"}

COMPANY PROFILE:
${data.company_profile || "Not provided"}

Run all 7 classifiers and return the full ensemble analysis JSON.
`;
}

export async function analyzeJobWithGemini(formData: JobFormData): Promise<any> {
  const client = getGenAIClient();
  
  if (!client) {
    throw new Error("Gemini API key is not configured. Please add GEMINI_API_KEY to environment variables.");
  }

  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
    systemInstruction: HIRESHIELD_SYSTEM_PROMPT
  });

  const userPrompt = buildUserPrompt(formData);
  
  const result = await model.generateContent(userPrompt);
  const responseText = result.response.text();
  
  // Parse JSON response
  try {
    return JSON.parse(responseText);
  } catch (err) {
    console.error("Failed to parse Gemini JSON output:", responseText);
    throw new Error("AI returned an invalid JSON response structure.");
  }
}
