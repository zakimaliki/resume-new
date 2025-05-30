import api from '@/lib/api';

interface CandidateData {
  jobId: number;
  name: string;
  location: string;
  resumeData: {
    personal_information?: {
      name?: string;
      title?: string;
      city?: string;
    };
    contact?: {
      email?: string;
      linkedin?: string;
      phone?: string;
    };
    experience?: Array<{
      company?: string;
      title?: string;
      startYear?: string;
      endYear?: string;
      location?: string;
      description?: string;
    }>;
    education?: Array<{
      university?: string;
      degree?: string;
      gpa?: string;
      startYear?: string;
      endYear?: string;
    }>;
    additional_information?: {
      technical_skills?: string;
    };
  };
}

// Jobs API
export const getJobs = async () => {
  const response = await api.get('/api/jobs');
  return response.data;
};

export const getJobById = async (id: string) => {
  const response = await api.get(`/api/jobs/${id}`);
  return response.data;
};

export const createJob = async (data: {
  title: string;
  location: string;
  teamDescription: string;
  jobDescription: string;
  responsibilities: string[];
  recruitmentTeamName: string;
  recruitmentManager: string;
}) => {
  const response = await api.post('/api/jobs', data);
  return response.data;
};

export const updateJob = async (id: string, data: {
  title: string;
  location: string;
  teamDescription: string;
  jobDescription: string;
  responsibilities: string[];
  recruitmentTeamName: string;
  recruitmentManager: string;
}) => {
  const response = await api.put(`/api/jobs/${id}`, data);
  return response.data;
};

// Candidates API
export const getCandidates = async () => {
  const response = await api.get('/api/candidates');
  return response.data;
};

export const createCandidate = async (data: CandidateData) => {
  const response = await api.post('/api/candidates', data);
  return response.data;
};

// Interviewers API
export const getInterviewers = async () => {
  const response = await api.get('/api/interviewers');
  return response.data;
};

export const createInterviewer = async (data: {
  jobId: number;
  name: string;
  department: string;
}) => {
  const response = await api.post('/api/interviewers', data);
  return response.data;
};

export const updateInterviewers = async (jobId: string, interviewers: Array<{
  name: string;
  department: string;
}>) => {
  const response = await api.put(`/api/interviewers/${jobId}`, { interviewers });
  return response.data;
};

// Auth API
export const login = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const register = async (userData: { email: string; password: string }) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
}; 