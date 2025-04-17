export interface Database {
    public: {
        Tables: {
            user_preferences: {
                Row: {
                    id: string;
                    user_id: string;
                    first_name: string;
                    job_title: string;
                    location: string;
                    is_remote: boolean;
                    portfolio_url: string | null;
                    resume_url: string | null;
                    last_login: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    first_name: string;
                    job_title?: string;
                    location?: string;
                    is_remote: boolean;
                    portfolio_url?: string | null;
                    resume_url?: string | null;
                    last_login?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    first_name?: string;
                    job_title?: string;
                    location?: string;
                    is_remote?: boolean;
                    portfolio_url?: string | null;
                    resume_url?: string | null;
                    last_login?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            job_applications: {
                Row: {
                    id: number;
                    user_id: string;
                    company_name: string;
                    job_title: string;
                    job_url: string | null;
                    status: string;
                    application_date: string;
                    next_follow_up: string | null;
                    notes: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    user_id: string;
                    company_name: string;
                    job_title: string;
                    job_url?: string | null;
                    status?: string;
                    application_date?: string;
                    next_follow_up?: string | null;
                    notes?: string | null;
                };
                Update: {
                    user_id?: string;
                    company_name?: string;
                    job_title?: string;
                    job_url?: string | null;
                    status?: string;
                    application_date?: string;
                    next_follow_up?: string | null;
                    notes?: string | null;
                };
            };
            job_matches: {
                Row: {
                    id: number;
                    user_id: string;
                    job_title: string;
                    company_name: string;
                    job_url: string | null;
                    match_score: number;
                    match_reasons: string[];
                    status: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    user_id: string;
                    job_title: string;
                    company_name: string;
                    job_url?: string | null;
                    match_score: number;
                    match_reasons: string[];
                    status?: string;
                };
                Update: {
                    user_id?: string;
                    job_title?: string;
                    company_name?: string;
                    job_url?: string | null;
                    match_score?: number;
                    match_reasons?: string[];
                    status?: string;
                };
            };
        };
    };
} 