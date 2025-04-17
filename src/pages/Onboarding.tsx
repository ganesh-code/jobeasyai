import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ResumeUpload from "@/components/onboarding/ResumeUpload";
import JobPreferencesForm from "@/components/onboarding/JobPreferencesForm";
import { PostgrestError } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import DashboardLayout from "@/components/layout/DashboardLayout";

type UserPreferences = Omit<
  Database["public"]["Tables"]["user_preferences"]["Insert"],
  "first_name"
>;

interface JobPreferencesData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  location: string;
  isRemote: boolean;
  portfolioUrl: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [resumeUrl, setResumeUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResumeUpload = (url: string) => {
    setResumeUrl(url);
  };

  const handleJobPreferences = async (data: JobPreferencesData) => {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      // Create user profile
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert({
          user_id: user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          location: data.location,
          portfolio_url: data.portfolioUrl,
        });

      if (profileError) throw profileError;

      // Create user preferences
      const preferences: UserPreferences = {
        user_id: user.id,
        job_title: data.jobTitle,
        location: data.location,
        is_remote: data.isRemote,
        portfolio_url: data.portfolioUrl,
        resume_url: resumeUrl,
        last_login: new Date().toISOString(),
      };

      const { error: preferencesError } = await supabase
        .from("user_preferences")
        .insert(preferences);

      if (preferencesError) throw preferencesError;

      toast.success("Setup completed successfully!");
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof PostgrestError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save preferences");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    Step {step} of {totalSteps}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>

              {step === 1 && (
                <ResumeUpload
                  onUploadComplete={handleResumeUpload}
                  onNext={() => setStep(2)}
                  onBack={() => navigate("/dashboard")}
                />
              )}

              {step === 2 && (
                <JobPreferencesForm
                  onSubmit={handleJobPreferences}
                  isSubmitting={isSubmitting}
                  onBack={() => setStep(1)}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Onboarding;
