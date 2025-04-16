
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail } from "lucide-react";

// Dummy job data with email added
const DUMMY_JOBS = [
  { job_title: "Software Engineer", company: "TechCorp", location: "New York", platform: "LinkedIn", remote: false, contact_email: "recruiter@techcorp.com" },
  { job_title: "Frontend Developer", company: "WebWizards", location: "London", platform: "Indeed", remote: true, contact_email: "careers@webwizards.com" },
  { job_title: "React Developer", company: "AppGenius", location: "Bangalore", platform: "Naukri", remote: true, contact_email: null },
  { job_title: "Full Stack Developer", company: "StackInnovate", location: "New York", platform: "Glassdoor", remote: false, contact_email: "jobs@stackinnovate.com" },
  { job_title: "UI Engineer", company: "DesignMasters", location: "Remote", platform: "LinkedIn", remote: true, contact_email: "talent@designmasters.com" },
  { job_title: "JavaScript Developer", company: "CodeCrafters", location: "London", platform: "Indeed", remote: false, contact_email: null },
  { job_title: "Software Developer", company: "DevSolutions", location: "Mumbai", platform: "Naukri", remote: false, contact_email: "hr@devsolutions.com" },
  { job_title: "React Native Developer", company: "MobileMinds", location: "Bangalore", platform: "Glassdoor", remote: true, contact_email: null },
  { job_title: "Frontend Engineer", company: "UXPioneers", location: "New York", platform: "LinkedIn", remote: true, contact_email: "recruit@uxpioneers.com" },
  { job_title: "Web Developer", company: "DigitalDreamers", location: "Remote", platform: "Indeed", remote: true, contact_email: "careers@digitaldreamers.com" }
];

interface JobMatchingCardProps {
  onMatchComplete: () => void;
}

const JobMatchingCard = ({ onMatchComplete }: JobMatchingCardProps) => {
  const [isMatching, setIsMatching] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [emailCount, setEmailCount] = useState(0);

  const matchJobs = async () => {
    setIsMatching(true);
    setMatchCount(0);
    setEmailCount(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: preferences, error: prefError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', parseInt(user.id.replace(/-/g, ''), 16) % 2147483647)
        .single();

      if (prefError || !preferences) {
        toast.error('Please set your job preferences first');
        return;
      }

      // Fetch user's resume
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(`${user.id}/resume.pdf`);

      if (!publicUrl) {
        toast.warning('Please upload a resume first');
        return;
      }

      // Filter jobs based on preferences
      const matchedJobs = DUMMY_JOBS.filter(job => {
        const titleMatch = job.job_title.toLowerCase().includes(preferences.job_title.toLowerCase());
        const locationMatch = 
          job.location.toLowerCase() === preferences.location.toLowerCase() || 
          (preferences.is_remote && job.remote);
        
        return titleMatch && locationMatch && job.contact_email;
      });

      if (matchedJobs.length === 0) {
        toast.warning('No matching jobs found');
        return;
      }

      // Save matched jobs and send emails
      for (const job of matchedJobs) {
        // Save job application
        const { data: applicationData, error: applicationError } = await supabase
          .from('job_applications')
          .insert({
            user_id: user.id,
            job_title: job.job_title,
            company: job.company,
            platform: job.platform,
            status: 'Applied',
            date: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (applicationError) {
          console.error('Job application save error:', applicationError);
          continue;
        }

        // Check if email exists and send
        if (job.contact_email) {
          const emailOutreachData = {
            user_id: user.id,
            job_application_id: applicationData.id,
            recipient_email: job.contact_email,
            subject: `Application for ${job.job_title} at ${job.company}`,
            body: `Dear Recruiter,\n\nI'm excited about the ${job.job_title} position at ${job.company}. Please find my resume attached.\n\nBest regards,\n[Your Name]`,
            status: 'Sent', // Placeholder, actual sending requires SendGrid
          };

          const { error: emailError } = await supabase
            .from('email_outreach')
            .insert(emailOutreachData);

          if (!emailError) {
            setEmailCount(prev => prev + 1);
          }
        }

        setMatchCount(prev => prev + 1);
      }

      toast.success(`${matchedJobs.length} jobs matched, ${emailCount} emails prepared`);
      onMatchComplete();
    } catch (error: any) {
      toast.error(error.message || 'Failed to match jobs');
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Job Matching</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Let our AI find and apply to jobs that match your preferences.
        </p>
        <Button 
          onClick={matchJobs} 
          disabled={isMatching}
          className="w-full"
        >
          {isMatching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Matching Jobs...
              {matchCount > 0 && ` (${matchCount} matched)`}
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Run AI Job Matching
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Currently in manual mode. Future versions will run automatically daily.
        </p>
      </CardContent>
    </Card>
  );
};

export default JobMatchingCard;
