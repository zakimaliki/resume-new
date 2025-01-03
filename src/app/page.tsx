"use client";
import Api from "./api/api";
import { useState, useEffect } from "react";
import pdfToText from "react-pdftotext";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { FaRegTrashCan } from "react-icons/fa6";
import { VscJson } from "react-icons/vsc";
import { ReactTyped } from "react-typed";

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
  const { output, setOutput, handleOpenAI } = Api();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [tab, setTab] = useState<string>("summarize");

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
      handleOpenAI(e, extractedText);
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
    <div className="h-dvh">
      <nav className="flex items-center justify-between w-full py-10 px-4 sm:px-12 md:px-36">
        <div className="text-gray-700 dark:text-gray-200 font-semibold">
          PDF Summarizer
        </div>
        <div className="text-gray-700 dark:text-gray-200 font-semibold">
          Resume DemoAI
        </div>
      </nav>
      <main
        className={`${
          output ? "h-fit" : "h-full"
        } pb-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start px-4 sm:px-12 md:px-36`}
      >
        <div
          className={`h-full flex flex-col items-center ${
            output ? "justify-start" : "justify-center"
          } space-y-4`}
        >
          {!pdfPreview && (
            <div>
              <label
                htmlFor="pdfInput"
                className="cursor-pointer flex items-center justify-center border border-gray-300 rounded-lg px-4 py-2 bg-white hover:bg-gray-100 shadow-md"
              >
                <span className="text-gray-700 font-semibold">Upload PDF</span>
              </label>
              <input
                id="pdfInput"
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                className="hidden"
              />
            </div>
          )}
          {pdfPreview && (
            <div className="w-full sm:w-11/12 lg:w-full h-[400px] md:h-[700px] no-scrollbar overflow-y-auto border rounded-lg shadow-md">
              <Document file={pdfPreview}>
                <Page
                  pageNumber={1}
                  loading="Loading PDF..."
                  scale={scale}
                  width={
                    window.innerWidth < 1024
                      ? 390
                      : document.querySelector(".w-full")?.clientWidth || 500
                  } // Adjust width based on the parent container
                />
              </Document>
            </div>
          )}
          {pdfFile && (
            <div className="flex items-center gap-4">
              <div className="font-semibold text-sm md:text-base">
                {pdfFile.name}
              </div>
              <button onClick={handleRemovePdf} className="">
                <FaRegTrashCan className="text-sm md:text-base" />
              </button>
            </div>
          )}
        </div>
        <div
          className={`${
            output ? "h-fit" : "h-full"
          } w-full bg-white dark:bg-zinc-800 rounded-lg p-6 flex flex-col `}
        >
          {output && (
            <div className="flex justify-end items-center">
              <button onClick={handleTab} className="">
                <VscJson className="text-sm md:text-base" />
              </button>
            </div>
          )}
          {tab === "summarize" && (
            <div
              className={`h-full w-full flex flex-col items-start  ${
                output ? "justify-start" : "justify-center"
              } ${output ? "gap-6" : "gap-20"} font-sans`}
            >
              {output?.personal_information && (
                <div className="space-y-0 lg:space-y-2 w-full flex flex-col">
                  <ReactTyped
                    strings={[`${output.personal_information?.name}`]}
                    className="text-2xl font-bold"
                    typeSpeed={10}
                    showCursor={false}
                    startWhenVisible={true}
                  />
                  <ReactTyped
                    strings={[`${output.personal_information?.title}`]}
                    className="text-xl font-semibold"
                    typeSpeed={10}
                    showCursor={false}
                    startDelay={200}
                    startWhenVisible={true}
                  />
                  <ReactTyped
                    strings={[`${output.personal_information?.city}`]}
                    className="text-lg"
                    typeSpeed={10}
                    showCursor={false}
                    startDelay={300}
                    startWhenVisible={true}
                  />
                </div>
              )}
              <div className="space-y-0 lg:space-y-2 w-full flex flex-col">
                <div className="text-xl font-semibold">Contact</div>
                {output?.contact && (
                  <div className="space-y-1 font-semibold">
                    <div className="grid grid-cols-3 items-center">
                      <ReactTyped
                        strings={[`Email`]}
                        className="text-sm md:text-base"
                        typeSpeed={10}
                        showCursor={false}
                        startDelay={400}
                        startWhenVisible={true}
                      />
                      <ReactTyped
                        strings={[`: ${output.contact?.email}`]}
                        className="text-sm md:text-base col-span-2"
                        typeSpeed={10}
                        showCursor={false}
                        startDelay={400}
                        startWhenVisible={true}
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <ReactTyped
                        strings={[`Linkedin`]}
                        className="text-sm md:text-base"
                        typeSpeed={10}
                        showCursor={false}
                        startDelay={500}
                        startWhenVisible={true}
                      />
                      <ReactTyped
                        strings={[`: ${output.contact?.linkedin || "-"}`]}
                        className="text-sm md:text-base col-span-2"
                        typeSpeed={10}
                        showCursor={false}
                        startDelay={500}
                        startWhenVisible={true}
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <ReactTyped
                        strings={[`Phone`]}
                        className="text-sm md:text-base"
                        typeSpeed={10}
                        showCursor={false}
                        startDelay={600}
                        startWhenVisible={true}
                      />
                      <ReactTyped
                        strings={[`: ${output.contact?.phone || "-"}`]}
                        className="text-sm md:text-base col-span-2"
                        typeSpeed={10}
                        showCursor={false}
                        startDelay={600}
                        startWhenVisible={true}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-0 lg:space-y-2 w-full flex flex-col">
                <div className="text-xl font-semibold">Experience</div>
                {output?.experience && (
                  <div className="space-y-1 font-semibold">
                    {output.experience?.map(
                      (exp: Experience, index: number) => (
                        <div
                          key={index}
                          className="grid grid-cols-3 items-start"
                        >
                          <ReactTyped
                            strings={[`${exp.startYear} - ${exp.endYear}`]}
                            className="text-sm md:text-base"
                            typeSpeed={10}
                            showCursor={false}
                            startDelay={700}
                            startWhenVisible={true}
                          />
                          <ReactTyped
                            strings={[`${exp.title} at ${exp.company}`]}
                            className="text-xs md:text-base col-span-2"
                            typeSpeed={10}
                            showCursor={false}
                            startDelay={700}
                            startWhenVisible={true}
                          />
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-0 lg:space-y-2 w-full flex flex-col">
                <div className="text-xl font-semibold">Education</div>
                {Array.isArray(output?.education) && (
                  <div className="space-y-1 font-semibold">
                    {output.education?.map((edu: Education, index: number) => (
                      <div key={index}>
                        <div className="grid grid-cols-3 items-center">
                          <ReactTyped
                            strings={[`University`]}
                            className="text-sm md:text-base"
                            typeSpeed={10}
                            showCursor={false}
                            startDelay={800}
                            startWhenVisible={true}
                          />
                          <ReactTyped
                            strings={[`: ${edu.university}`]}
                            className="text-sm md:text-base col-span-2"
                            typeSpeed={10}
                            showCursor={false}
                            startDelay={800}
                            startWhenVisible={true}
                          />
                        </div>
                        <div className="grid grid-cols-3 items-center">
                          <ReactTyped
                            strings={[`Faculty/Major`]}
                            className="text-sm md:text-base"
                            typeSpeed={10}
                            showCursor={false}
                            startDelay={900}
                            startWhenVisible={true}
                          />
                          <ReactTyped
                            strings={[`: ${edu.degree}`]}
                            className="text-sm md:text-base col-span-2"
                            typeSpeed={10}
                            showCursor={false}
                            startDelay={900}
                            startWhenVisible={true}
                          />
                        </div>
                        <div className="grid grid-cols-3 items-center">
                          <ReactTyped
                            strings={[`GPA`]}
                            className="text-sm md:text-base"
                            typeSpeed={10}
                            showCursor={false}
                            startDelay={1000}
                            startWhenVisible={true}
                          />
                          <ReactTyped
                            strings={[`: ${edu.gpa}`]}
                            className="text-sm md:text-base col-span-2"
                            typeSpeed={10}
                            showCursor={false}
                            startDelay={1000}
                            startWhenVisible={true}
                          />
                        </div>
                        <div className="grid grid-cols-3 items-center">
                          <ReactTyped
                            strings={[`Dates`]}
                            className="text-sm md:text-base"
                            typeSpeed={10}
                            showCursor={false}
                            startDelay={1100}
                            startWhenVisible={true}
                          />
                          <ReactTyped
                            strings={[`: ${edu.startYear} - ${edu.endYear}`]}
                            className="text-sm md:text-base col-span-2"
                            typeSpeed={10}
                            showCursor={false}
                            startDelay={1100}
                            startWhenVisible={true}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-0 lg:space-y-2 w-full flex flex-col">
                <div className="text-xl font-semibold">Skills</div>
                {output?.additional_information && (
                  <ReactTyped
                    strings={[
                      `${output.additional_information?.technical_skills}`,
                    ]}
                    className="text-sm md:text-base font-semibold"
                    typeSpeed={10}
                    showCursor={false}
                    startDelay={1200}
                    startWhenVisible={true}
                  />
                )}
              </div>
            </div>
          )}
          {tab === "raw" && (
            <div>
              {output && (
                <div className="w-full">
                  <pre className="w-full text-wrap font-sans font-bold text-xs md:text-sm">
                    {JSON.stringify(output, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
