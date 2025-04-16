export interface Database {
    public: {
        Tables: {
            user_preferences: {
                Row: {
                    id: number;
                    user_id: string;
                    job_title: string | null;
                    location: string | null;
                    is_remote: boolean;
                    portfolio_url: string | null;
                    resume_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    user_id: string;
                    job_title?: string | null;
                    location?: string | null;
                    is_remote: boolean;
                    portfolio_url?: string | null;
                    resume_url?: string | null;
                };
                Update: {
                    user_id?: string;
                    job_title?: string | null;
                    location?: string | null;
                    is_remote?: boolean;
                    portfolio_url?: string | null;
                    resume_url?: string | null;
                };
            };
        };
    };
} 