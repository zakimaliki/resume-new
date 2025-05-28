-- Jobs table structure
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    team_description TEXT,
    job_description TEXT,
    responsibilities TEXT [],
    recruitment_team_name VARCHAR(100),
    recruitment_manager VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Interviewers table structure
CREATE TABLE interviewers (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs (id),
    department VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Candidates table structure
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs (id),
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_jobs_title ON jobs (title);

CREATE INDEX idx_jobs_location ON jobs (location);

CREATE INDEX idx_interviewers_job_id ON interviewers (job_id);

CREATE INDEX idx_candidates_job_id ON candidates (job_id);