import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Settings } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

interface Job {
  id: string;
  job_title: string;
  company: string;
  platform: string;
  location: string;
  remote: boolean;
  match_score: number;
  job_description: string;
  requirements: string;
  posted_date: string;
  salary_range: string;
  job_type: string;
  work_preference: string;
  industry: string;
}

interface UserPreferences {
  job_title: string;
  industry: string;
  work_preference: "remote" | "hybrid" | "onsite";
  salary_range: string;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] =
    useState<UserPreferences | null>(null);
  const [preferencesChecked, setPreferencesChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserPreferences();
  }, []);

  const checkUserPreferences = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: preferences, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setUserPreferences(preferences);
      setPreferencesChecked(true);

      if (preferences) {
        fetchMatchingJobs(preferences);
      }
    } catch (error) {
      console.error("Error checking user preferences:", error);
      toast.error("Failed to check user preferences");
      setPreferencesChecked(true);
    }
  };

  const fetchMatchingJobs = async (preferences: UserPreferences) => {
    try {
      let query = supabase
        .from("jobs")
        .select("*")
        .order("posted_date", { ascending: false });

      // Apply filters based on preferences
      if (preferences.job_title) {
        query = query.ilike("job_title", `%${preferences.job_title}%`);
      }
      if (preferences.industry) {
        query = query.eq("industry", preferences.industry);
      }
      if (preferences.work_preference) {
        query = query.eq("work_preference", preferences.work_preference);
      }

      const { data, error } = await query;

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch matching jobs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (preferencesChecked && !userPreferences) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader>
              <CardTitle>Set Your Job Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Please set your job preferences to see matching job
                opportunities.
              </p>
              <Button onClick={() => navigate("/profile")}>
                <Settings className="mr-2 h-4 w-4" />
                Go to Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Matching Jobs</h1>
          <Button variant="outline" onClick={() => navigate("/profile")}>
            <Settings className="mr-2 h-4 w-4" />
            Edit Preferences
          </Button>
        </div>

        <div className="grid gap-4">
          {jobs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-gray-500">No matching jobs found.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your job preferences in settings.
                </p>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{job.job_title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {job.company} • {job.location}
                      </p>
                    </div>
                    <Badge variant="secondary">{job.work_preference}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">{job.job_description}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline">{job.industry}</Badge>
                      <Badge variant="outline">{job.salary_range}</Badge>
                      <Badge variant="outline">{job.job_type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Posted on {new Date(job.posted_date).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
