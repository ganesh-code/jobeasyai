import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ResumeUpload from "@/components/onboarding/ResumeUpload";
import JobPreferencesForm from "@/components/onboarding/JobPreferencesForm";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [resumeUrl, setResumeUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResumeUpload = (url: string) => {
    setResumeUrl(url);
  };

  const handleJobPreferences = async (data: {
    jobTitle: string;
    location: string;
    isRemote: boolean;
    portfolioUrl: string;
  }) => {
    setIsSubmitting(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('user_preferences').insert({
        user_id: user.id,
        job_title: data.jobTitle,
        location: data.location,
        is_remote: data.isRemote,
        portfolio_url: data.portfolioUrl,
        resume_url: resumeUrl,
      });

      if (error) throw error;

      toast.success('Preferences saved successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save preferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-6 space-y-6">
          <Progress value={step === 1 ? 50 : 100} className="w-full" />
          
          {step === 1 ? (
            <div className="space-y-6">
              <ResumeUpload onUploadComplete={handleResumeUpload} />
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!resumeUrl}>
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <JobPreferencesForm onSubmit={handleJobPreferences} />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Finish'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
