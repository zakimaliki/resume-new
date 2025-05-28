"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface PersonalInformation {
  name?: string;
  title?: string;
  city?: string;
}

interface Contact {
  email?: string;
  linkedin?: string;
  phone?: string;
}

interface Experience {
  company?: string;
  title?: string;
  startYear?: string;
  endYear?: string;
  location?: string;
  description?: string;
}

interface Education {
  university?: string;
  degree?: string;
  gpa?: string;
  startYear?: string;
  endYear?: string;
}

interface AdditionalInformation {
  technical_skills?: string;
}

interface JobData {
  title: string;
  jobDescription: string;
  responsibilities: string[];
}

interface Output {
  personal_information?: PersonalInformation | null;
  contact?: Contact | null;
  experience: Experience[] | null;
  education: Education[] | null;
  additional_information?: AdditionalInformation | null;
  job_match_analysis?: {
    match_score: number;
    key_skills_match: string[];
    missing_requirements: string[];
    recommendations: string[];
  } | null;
}

function Api() {
  const [output, setOutput] = useState<Output | null>();
  const [loading, setLoading] = useState(false);

  const handleOpenAI = async (
    e: React.ChangeEvent<HTMLInputElement>,
    data: string,
    jobData?: JobData
  ) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      let prompt = `please summarize this resume or CV briefly with this layout as JSON Format:
      1. first layout is name, Position or tittle, city,
      2. second layout is contact email, linkedin, and contact number,
      3. third layout is all experience,
      5. fifth layout is education,
      from this text: ${data}`;

      if (jobData) {
        prompt += `\n\nPlease also analyze how well this resume matches the following job requirements:
        Job Title: ${jobData.title}
        Job Description: ${jobData.jobDescription}
        Key Responsibilities: ${jobData.responsibilities.join(', ')}
        
        Add a new field called 'job_match_analysis' to the JSON output with:
        - match_score (0-100)
        - key_skills_match
        - missing_requirements
        - recommendations`;
      }

      prompt += `\n\nmake exactly like this:
      {
        personal_information: {
          name: "",
          title: "",
          city: "",
        },
        contact: {
          email: "",
          linkedin: "",
          phone: "",
        },
        experience: [
          {
            company: "",
            title: "",
            startYear: "",
            endYear: "",
            location: "",
            description: "",
          },
        ],
        education: [
          {
            university: "",
            degree: "",
            gpa: "",
            startYear: "",
            endYear: "",
          }
        ],
        additional_information: {
          technical_skills: "",
        },
        ${jobData ? 'job_match_analysis: { match_score: 0, key_skills_match: [], missing_requirements: [], recommendations: [] },' : ''}
      } and return only JSON format`;

      // Initialize Gemini API
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean and parse the response text
      const cleanedText = text.replace(/```json|```/g, "").trim();
      try {
        const parsedOutput = JSON.parse(cleanedText);
        setOutput(parsedOutput);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        // If parsing fails, try to extract JSON from the response
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const extractedJson = JSON.parse(jsonMatch[0]);
            setOutput(extractedJson);
          } catch (extractError) {
            console.error("Error extracting JSON:", extractError);
            throw new Error("Failed to parse API response as JSON");
          }
        } else {
          throw new Error("No valid JSON found in API response");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { output, setOutput, handleOpenAI, loading };
}

export default Api;
