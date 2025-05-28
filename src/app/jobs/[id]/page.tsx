"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import React from "react";

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
    interviewers: {
      engineering: string[];
      product: string[];
      design: string[];
    };
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
        const response = await fetch(`/api/jobs/${resolvedParams.id}`);
        const data = await response.json();
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
      <nav className="flex items-center justify-between w-full py-4 px-8 border-b bg-white">
        <div className="flex items-center gap-2">
          <span className="font-black text-xl">Warkop</span>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center bg-[#F5F5F5] rounded-full px-4 py-2 w-full max-w-xl shadow-sm">
            <input
              type="text"
              placeholder="Ask a question"
              className="bg-transparent outline-none flex-1 text-gray-700 placeholder-gray-400"
            />
            <button className="ml-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 10h10M13 6l4 4-4 4"/></svg>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 ml-4">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="profile" className="w-8 h-8 rounded-full" />
        </div>
      </nav>
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
                {jobData.responsibilities.map((responsibility, index) => (
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
                className="text-xs px-2 py-1 border rounded hover:bg-gray-100"
                onClick={() => router.push(`/jobs/${resolvedParams.id}/edit`)}
              >
                Edit
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md mb-4">
            <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
              <div className="font-semibold text-gray-700">Team</div>
              <div className="text-gray-900 text-right">{jobData.recruitmentTeam.teamName}</div>
              <div className="font-semibold text-gray-700">Hiring Manager</div>
              <div className="text-gray-900 text-right">{jobData.recruitmentTeam.manager}</div>
              <div className="font-semibold text-gray-700 col-span-2 mt-2">Interviewers</div>
              <div className="text-gray-700">Engineering</div>
              <div className="text-gray-900 text-right">{jobData.recruitmentTeam.interviewers.engineering.join(", ")}</div>
              <div className="text-gray-700">Product sense</div>
              <div className="text-gray-900 text-right">{jobData.recruitmentTeam.interviewers.product.join(", ")}</div>
              <div className="text-gray-700">Design sense</div>
              <div className="text-gray-900 text-right">{jobData.recruitmentTeam.interviewers.design.join(", ")}</div>
            </div>
            <div className="flex items-center justify-between mb-2 mt-6">
              <div className="font-semibold text-gray-700">Candidates</div>
              {jobData.recruitmentTeam.candidates.length > 10 && (
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
                ? jobData.recruitmentTeam.candidates
                : jobData.recruitmentTeam.candidates.slice(0, 10)
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