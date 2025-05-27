"use client";

import { useState } from "react";
import axios from "axios";

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

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "developer",
              content: "You are a helpful assistant.",
            },
            {
              role: "user",
              content: prompt,
            }
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOutput(
        JSON.parse(
          response.data.choices[0].message.content.replace(/```json|```/g, "")
        )
      );
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { output, setOutput, handleOpenAI, loading };
}

export default Api;
