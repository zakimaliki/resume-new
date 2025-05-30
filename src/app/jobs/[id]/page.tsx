"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import Navbar from "@/components/Navbar";
import { getJobById } from '@/services/api';

interface JobData {
  title: string;
  location: string;
  updatedAt: string;
  teamDescription: string;
  jobDescription: string;
  responsibilities: string[];
  recruitmentTeam: {
    teamName: string;
    manager: string;
    interviewers: Array<{
      name: string;
      department: string;
    }>;
    candidates: Array<{
      name: string;
      location: string;
    }>;
  };
}

export default function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);
  const [showAllCandidates, setShowAllCandidates] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const data = await getJobById(resolvedParams.id);
        setJobData(data);
      } catch (error) {
        console.error("Error fetching job data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [resolvedParams.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!jobData) {
    return <div className="min-h-screen flex items-center justify-center">Job not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col lg:flex-row gap-8 px-8 py-8 max-w-7xl mx-auto w-full">
        <section className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{jobData.title}</h1>
          <div className="flex items-center gap-4 text-gray-500 text-sm mb-6">
            <span className="flex items-center gap-1"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"></svg>{jobData.location}</span>
            <span className="flex items-center gap-1"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"></svg>Diperbarui {jobData.updatedAt}</span>
          </div>
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="font-bold text-lg mb-2">Tentang Tim</h2>
            <p className="text-gray-700">{jobData.teamDescription}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-2">Tentang Pekerjaan</h2>
            <p className="text-gray-700 mb-2">{jobData.jobDescription}</p>
            <div>
              <span className="font-bold">Tanggung Jawab:</span>
              <ul className="list-disc ml-6 text-gray-700 mt-1 space-y-1">
                {jobData.responsibilities?.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <aside className="w-full lg:w-[350px] flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold text-base">Hiring Team</div>
            <div className="flex items-center gap-2">
              <button 
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2 text-sm font-medium"
                onClick={() => router.push(`/jobs/${resolvedParams.id}/edit`)}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit Lowongan
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md mb-4">
            <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
              <div className="font-semibold text-gray-700">Team</div>
              <div className="text-gray-900 text-right">{jobData.recruitmentTeam?.teamName}</div>
              <div className="font-semibold text-gray-700">Hiring Manager</div>
              <div className="text-gray-900 text-right">{jobData.recruitmentTeam?.manager}</div>
              <div className="font-semibold text-gray-700 col-span-2 mt-2">Interviewers</div>
              {jobData.recruitmentTeam?.interviewers?.map((interviewer, index) => (
                <React.Fragment key={index}>
                  <div className="text-gray-700">{interviewer.department}</div>
                  <div className="text-gray-900 text-right">{interviewer.name}</div>
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center justify-between mb-2 mt-6">
              <div className="font-semibold text-gray-700">Candidates</div>
              {jobData.recruitmentTeam?.candidates?.length > 10 && (
                <button
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => setShowAllCandidates(!showAllCandidates)}
                >
                  {showAllCandidates ? 'Show less' : 'View all'}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-y-1 text-sm">
              {(showAllCandidates
                ? jobData.recruitmentTeam?.candidates || []
                : (jobData.recruitmentTeam?.candidates || []).slice(0, 10)
              ).map((candidate) => (
                <React.Fragment key={candidate.name + '-' + candidate.location}>
                  <div className="text-gray-900">{candidate.name}</div>
                  <div className="text-gray-400 text-right">{candidate.location}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <button
            className="w-full bg-black text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition mt-4"
            onClick={() => router.push(`/resume?jobId=${resolvedParams.id}`)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 5v10M5 10h10"/></svg>
            Tambah Kandidat
          </button>
        </aside>
      </main>
      <footer className="w-full py-4 px-8 border-t bg-white text-xs text-gray-400 flex justify-between">
        <span>© 2024 Warkop. Semua hak cipta dilindungi.</span>
        <span>
          <a href="#" className="hover:underline">Kebijakan Privasi</a> · <a href="#" className="hover:underline">Syarat & Ketentuan</a>
        </span>
      </footer>
    </div>
  );
} 