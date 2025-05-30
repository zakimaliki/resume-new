import api from '@/lib/api';

interface JobData {
  title: string;
  description: string;
  location: string;
  type: string;
  requirements: string[];
  salary?: string;
  company: string;
  redirectUrl: string;
}

// Create a new job with redirect URL
export const createJob = async (data: JobData) => {
  const response = await api.post('/api/jobs', {
    ...data,
    redirectUrl: data.redirectUrl // This will be used to redirect users when they click on the job
  });
  return response.data;
};

// Get all jobs
export const getAllJobs = async () => {
  const response = await api.get('/api/jobs');
  return response.data;
};

// Get job by ID
export const getJobById = async (id: string) => {
  const response = await api.get(`/api/jobs/${id}`);
  return response.data;
};

// Update job
export const updateJob = async (id: string, data: Partial<JobData>) => {
  const response = await api.put(`/api/jobs/${id}`, data);
  return response.data;
};

// Delete job
export const deleteJob = async (id: string) => {
  const response = await api.delete(`/api/jobs/${id}`);
  return response.data;
};

// Handle job redirection
export const redirectToJob = (redirectUrl: string) => {
  window.location.href = redirectUrl;
}; 