"use client";
import Api from "../api/api";
import { useState, useEffect } from "react";
import pdfToText from "react-pdftotext";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegFile } from "react-icons/fa";
import { VscJson } from "react-icons/vsc";
import { ReactTyped } from "react-typed";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams } from "next/navigation";

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

export default function Home() {
  const { output, setOutput, handleOpenAI, loading } = Api();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [tab, setTab] = useState<string>("summarize");
  const params = useParams();
  const jobId = params?.id;

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const extractedText = await pdfToText(file);
      setPdfFile(file);

      // Generate preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPdfPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      // Get job details first
      try {
        const jobResponse = await fetch(`/api/jobs/${jobId}`);
        const jobData = await jobResponse.json();
        
        // Pass both resume text and job details to OpenAI
        handleOpenAI(e, extractedText, jobData);
      } catch (error) {
        console.error("Error fetching job details:", error);
        // Fallback to regular resume parsing if job details fetch fails
        handleOpenAI(e, extractedText);
      }
    }
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
    setPdfPreview(null);
    setOutput(null);
    const fileInput = document.getElementById("pdfInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const [scale, setScale] = useState(0.4); // Default scale for desktop

  useEffect(() => {
    // Update scale based on window size
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScale(1); // Full scale for mobile
      } else {
        setScale(0.4); // Smaller scale for desktop
      }
    };

    handleResize(); // Initial check for scale on load

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on unmount
    };
  }, []);

  const handleTab = () => {
    setTab(tab === "summarize" ? "raw" : "summarize");
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <main className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
        {/* Left: Upload Area */}
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
          <label htmlFor="pdfInput" className="flex flex-col items-center cursor-pointer select-none">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white hover:bg-gray-50 transition-all">
              <FaRegFile className="text-4xl text-gray-400 mb-2" />
              <span className="text-base text-gray-600 font-medium">Upload a resume</span>
            </div>
            <input id="pdfInput" type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
          </label>
        </div>
        {/* Right: Sections */}
        <div className="flex flex-col justify-center items-start h-full min-h-[60vh] px-6 sm:px-12 py-12">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm p-14 min-h-[600px] flex flex-col gap-20 relative">
            {/* Tombol kurung kurawal kanan atas */}
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-2xl transition-colors"
              onClick={handleTab}
              aria-label="Show JSON"
            >
              {"{}"}
            </button>
            {/* Conditionally render content based on tab */}
            {tab === "summarize" && (
              <>
                <div className="text-lg font-semibold text-gray-800">Contact</div>
                <div className="text-lg font-semibold text-gray-800">Work Experience</div>
                <div className="text-lg font-semibold text-gray-800">Education</div>
                <div className="text-lg font-semibold text-gray-800">Skills</div>
                {loading ? (
                  <Skeleton height={20} width={200} count={3} />
                ) : (
                  output && (
                    <>
                      {output.personal_information && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
                          <p className="text-gray-600">{output.personal_information.name}</p>
                          <p className="text-gray-600">{output.personal_information.title}</p>
                          <p className="text-gray-600">{output.personal_information.city}</p>
                        </div>
                      )}
                      {output.contact && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact</h3>
                          <p className="text-gray-600">{output.contact.email}</p>
                          <p className="text-gray-600">{output.contact.linkedin}</p>
                          <p className="text-gray-600">{output.contact.phone}</p>
                        </div>
                      )}
                      {output.experience && output.experience.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Experience</h3>
                          {output.experience.map((exp, index) => (
                            <div key={index} className="mb-4">
                              <p className="font-medium text-gray-700">{exp.title} at {exp.company}</p>
                              <p className="text-gray-600">{exp.startYear} - {exp.endYear}</p>
                              <p className="text-gray-600">{exp.location}</p>
                              <p className="text-gray-600">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {output.education && output.education.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Education</h3>
                          {output.education.map((edu, index) => (
                            <div key={index} className="mb-4">
                              <p className="font-medium text-gray-700">{edu.degree} at {edu.university}</p>
                              <p className="text-gray-600">{edu.startYear} - {edu.endYear}</p>
                              {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                      {output.additional_information && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills</h3>
                          <p className="text-gray-600">{output.additional_information.technical_skills}</p>
                        </div>
                      )}
                      {output.job_match_analysis && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Job Match Analysis</h3>
                          <div className="mb-4">
                            <p className="font-medium text-gray-700">Match Score: {output.job_match_analysis.match_score}%</p>
                          </div>
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-700 mb-2">Key Skills Match:</h4>
                            <ul className="list-disc list-inside text-gray-600">
                              {output.job_match_analysis.key_skills_match.map((skill, index) => (
                                <li key={index}>{skill}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-700 mb-2">Missing Requirements:</h4>
                            <ul className="list-disc list-inside text-gray-600">
                              {output.job_match_analysis.missing_requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Recommendations:</h4>
                            <ul className="list-disc list-inside text-gray-600">
                              {output.job_match_analysis.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </>
                  )
                )}
              </>
            )}
            {tab === "raw" && (
              // Add back the logic to display raw JSON here when available
              // For example:
              // {output && (
              //   <pre className="w-full text-wrap font-sans font-bold text-xs md:text-sm">
              //     {JSON.stringify(output, null, 2)}
              //   </pre>
              // )}
              <div className="text-lg font-semibold text-gray-800">Raw JSON Output</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}