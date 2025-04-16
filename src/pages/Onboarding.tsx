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

type UserPreferences =
  Database["public"]["Tables"]["user_preferences"]["Insert"];

interface JobPreferencesData {
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

      const preferences: UserPreferences = {
        user_id: user.id,
        job_title: data.jobTitle,
        location: data.location,
        is_remote: data.isRemote,
        portfolio_url: data.portfolioUrl,
        resume_url: resumeUrl,
      };

      const { error } = await supabase
        .from("user_preferences")
        .insert(preferences);

      if (error) throw error;

      toast.success("Preferences saved successfully!");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
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
  );
};

export default Onboarding;
