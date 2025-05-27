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

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [formData, setFormData] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await fetch(`/api/jobs/${resolvedParams.id}`);
        const data = await response.json();
        setJobData(data);
        setFormData(data); // Initialize form data with fetched data
      } catch (error) {
        console.error("Error fetching job data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [resolvedParams.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    } as JobData); // Type assertion for simplicity, can be refined
  };

  const handleArrayInputChange = (name: string, index: number, value: string) => {
    const updatedArray = [...(formData?.[name as keyof JobData] as string[] || [])];
    updatedArray[index] = value;
    setFormData({
      ...formData,
      [name]: updatedArray,
    } as JobData);
  };

  const handleRecruitmentTeamInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      recruitmentTeam: {
        ...formData?.recruitmentTeam,
        [name]: value,
      },
    } as JobData);
  };

  const handleSave = async () => {
    if (!formData) return;
    // TODO: Implement actual save API call (PUT/PATCH)
    console.log("Saving data:", formData);
    alert("Save functionality not implemented yet. Check console for data.");
    // router.push(`/jobs/${resolvedParams.id}`); // Redirect after save
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!jobData || !formData) {
    return <div className="min-h-screen flex items-center justify-center">Job data not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <nav className="flex items-center justify-between w-full py-4 px-8 border-b bg-white">
        <div className="flex items-center gap-2">
          <span className="font-black text-xl">Warkop</span>
        </div>
        {/* Search bar and profile - can be a shared component */}
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
          <h1 className="text-3xl font-bold mb-6">Edit Job: {formData.title}</h1>

          {/* Job Details Form */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Job Details</h2>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
             <div className="mb-4">
              <label htmlFor="updatedAt" className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
              <input type="text" id="updatedAt" name="updatedAt" value={formData.updatedAt} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <textarea id="jobDescription" name="jobDescription" rows={4} value={formData.jobDescription} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
            </div>
            <div className="mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</span>
              {formData.responsibilities.map((responsibility, index) => (
                 <input
                    key={index}
                    type="text"
                    value={responsibility}
                    onChange={(e) => handleArrayInputChange('responsibilities', index, e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2"
                 />
              ))}
               {/* Add button for new responsibility */}
            </div>
          </div>

          {/* Recruitment Team Form */}
           <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Recruitment Team</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="mb-4 md:mb-0">
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                <input type="text" id="teamName" name="teamName" value={formData.recruitmentTeam.teamName} onChange={handleRecruitmentTeamInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div className="mb-4 md:mb-0">
                 <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">Hiring Manager</label>
                <input type="text" id="manager" name="manager" value={formData.recruitmentTeam.manager} onChange={handleRecruitmentTeamInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>
             {/* Interviewers and Candidates editing can be more complex - maybe in separate sections or modals */}
            <div className="mt-4">
              <div className="font-semibold text-gray-700 mb-2">Interviewers (Read Only for now)</div>
               {/* Display current interviewers - editing them requires more complex form handling */}
               <div className="text-sm text-gray-700">
                 Engineering: {formData.recruitmentTeam.interviewers.engineering.join(", ")}<br/>
                 Product sense: {formData.recruitmentTeam.interviewers.product.join(", ")}<br/>
                 Design sense: {formData.recruitmentTeam.interviewers.design.join(", ")}
              </div>
            </div>
             <div className="mt-4">
              <div className="font-semibold text-gray-700 mb-2">Candidates (Read Only for now)</div>
              {/* Display current candidates - editing or adding them requires more complex form handling */}
              <div className="text-sm text-gray-700">
                {formData.recruitmentTeam.candidates.map((candidate, index) => (
                   <div key={index}>{candidate.name} ({candidate.location})</div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => router.push(`/jobs/${resolvedParams.id}`)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </section>

        {/* Aside section - could potentially show related info or remain hidden */}
        <aside className="w-full lg:w-[350px] flex-shrink-0 hidden lg:block">
           {/* Content for aside if needed */}
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