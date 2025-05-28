"use client";
import Api from "../api/api";
import { useState, useEffect } from "react";
import pdfToText from "react-pdftotext";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { FaRegFile } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSearchParams, useRouter } from "next/navigation";

export default function Home() {
  const { output, setOutput, handleOpenAI, loading } = Api();
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [tab, setTab] = useState<string>("summarize");
  const searchParams = useSearchParams();
  const jobIdFromSearchParams = searchParams.get("jobId");
  const router = useRouter();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(0.5); // Default scale for desktop
  const [showAllPages, setShowAllPages] = useState(false);

  useEffect(() => {
    if (!jobIdFromSearchParams) {
      router.push("/jobs");
    }
  }, [jobIdFromSearchParams, router]);

  useEffect(() => {
    const handleResize = () => {
      setScale(window.innerWidth < 768 ? 1 : 0.5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const extractedText = await pdfToText(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPdfPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      try {
        if (jobIdFromSearchParams) {
          const jobResponse = await fetch(`/api/jobs/${jobIdFromSearchParams}`);
          const jobData = await jobResponse.json();
          handleOpenAI(e, extractedText, jobData);
        } else {
          handleOpenAI(e, extractedText);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        handleOpenAI(e, extractedText);
      }
    }
  };

  const handleRemovePdf = () => {
    setPdfPreview(null);
    setOutput(null);
    const fileInput = document.getElementById("pdfInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleTab = () => {
    setTab(tab === "summarize" ? "raw" : "summarize");
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="w-full bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800">
            Job ID: {jobIdFromSearchParams || "No job selected"}
          </h1>
        </div>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        {/* LEFT SIDE: PDF Upload / Preview */}
        <div className="flex flex-col items-center justify-center h-full px-6 sm:px-12 py-12">
          {!pdfPreview ? (
            <label
              htmlFor="pdfInput"
              className="flex flex-col items-center cursor-pointer select-none"
            >
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white hover:bg-gray-50 transition-all">
                <FaRegFile className="text-4xl text-gray-400 mb-2" />
                <span className="text-base text-gray-600 font-medium">Upload a resume</span>
              </div>
              <input
                id="pdfInput"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handlePdfUpload}
              />
            </label>
          ) : (
            <div className="w-full max-w-3xl overflow-auto p-4" style={{ maxHeight: '90vh' }}>
              <Document file={pdfPreview} onLoadSuccess={onDocumentLoadSuccess}>
                {showAllPages
                  ? Array.from(new Array(numPages || 0), (_, index) => (
                      <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={scale} />
                    ))
                  : <Page pageNumber={1} scale={scale} />
                }
              </Document>
              {numPages && numPages > 1 && (
                <button
                  onClick={() => setShowAllPages(!showAllPages)}
                  className="mt-2 text-blue-600 underline text-sm"
                >
                  {showAllPages ? "Lihat Lebih Sedikit" : "Lihat Selengkapnya"}
                </button>
              )}
              <button
                onClick={handleRemovePdf}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mx-auto block"
              >
                Remove PDF
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Output Viewer */}
        <div className="flex flex-col justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm p-14 min-h-[600px] flex flex-col gap-6 relative lg:max-h-[calc(100vh-150px)] overflow-y-auto">
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={handleTab}
              aria-label="Toggle JSON"
            >
              {"{}"}
            </button>

            {tab === "summarize" ? (
              <div className="flex flex-col gap-6">
                {/* Contact */}
                <Section title="Contact" loading={loading}>
                  {output?.contact && (
                    <div className="text-gray-600">
                      <p>{output.contact.email}</p>
                      <p>{output.contact.linkedin}</p>
                      <p>{output.contact.phone}</p>
                    </div>
                  )}
                </Section>

                {/* Experience */}
                <Section title="Work Experience" loading={loading} lines={3}>
                  {output?.experience && output.experience.length > 0 && 
                    output.experience.map((exp, index) => (
                      <div key={index}>
                        <p className="font-medium text-gray-700">
                          {exp.title} at {exp.company}
                        </p>
                        <p className="text-gray-600">{exp.startYear} - {exp.endYear}</p>
                        <p className="text-gray-600">{exp.location}</p>
                        <p className="text-gray-600">{exp.description}</p>
                      </div>
                    ))
                  }
                </Section>

                {/* Education */}
                <Section title="Education" loading={loading} lines={2}>
                  {output?.education && output.education.length > 0 && 
                    output.education.map((edu, index) => (
                      <div key={index}>
                        <p className="font-medium text-gray-700">
                          {edu.degree} at {edu.university}
                        </p>
                        <p className="text-gray-600">{edu.startYear} - {edu.endYear}</p>
                        {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                      </div>
                    ))
                  }
                </Section>

                {/* Skills */}
                <Section title="Skills" loading={loading}>
                  {output?.additional_information?.technical_skills && (
                    <p className="text-gray-600">{output.additional_information.technical_skills}</p>
                  )}
                </Section>

                {/* Personal Info */}
                <Section title="Personal Information" loading={loading} lines={3}>
                  {output?.personal_information && (
                    <div className="text-gray-600">
                      <p>{output.personal_information.name}</p>
                      <p>{output.personal_information.title}</p>
                      <p>{output.personal_information.city}</p>
                    </div>
                  )}
                </Section>

                {/* Job Match */}
                {output?.job_match_analysis && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Job Match Analysis</h3>
                    <p className="font-medium text-gray-700 mb-2">
                      Match Score: {output.job_match_analysis.match_score}%
                    </p>
                    <List title="Key Skills Match" items={output.job_match_analysis.key_skills_match} />
                    <List title="Missing Requirements" items={output.job_match_analysis.missing_requirements} />
                    <List title="Recommendations" items={output.job_match_analysis.recommendations} />
                  </div>
                )}
              </div>
            ) : (
              <pre className="w-full whitespace-pre-wrap text-xs md:text-sm font-mono">
                {output ? JSON.stringify(output, null, 2) : ""}
              </pre>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  loading,
  children,
  lines = 1,
}: {
  title: string;
  loading: boolean;
  children: React.ReactNode;
  lines?: number;
}) {
  return (
    <div>
      <div className="text-lg font-semibold text-gray-800 mb-2">{title}</div>
      {loading ? <Skeleton height={20} width={200} count={lines} /> : children}
    </div>
  );
}

// 👇 List Utility Component
function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-4">
      <h4 className="font-medium text-gray-700 mb-2">{title}:</h4>
      <ul className="list-disc list-inside text-gray-600">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
