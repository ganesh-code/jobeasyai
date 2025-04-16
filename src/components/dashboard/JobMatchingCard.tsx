
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Dummy job data
const DUMMY_JOBS = [
  { job_title: "Software Engineer", company: "TechCorp", location: "New York", platform: "LinkedIn", remote: false },
  { job_title: "Frontend Developer", company: "WebWizards", location: "London", platform: "Indeed", remote: true },
  { job_title: "React Developer", company: "AppGenius", location: "Bangalore", platform: "Naukri", remote: true },
  { job_title: "Full Stack Developer", company: "StackInnovate", location: "New York", platform: "Glassdoor", remote: false },
  { job_title: "UI Engineer", company: "DesignMasters", location: "Remote", platform: "LinkedIn", remote: true },
  { job_title: "JavaScript Developer", company: "CodeCrafters", location: "London", platform: "Indeed", remote: false },
  { job_title: "Software Developer", company: "DevSolutions", location: "Mumbai", platform: "Naukri", remote: false },
  { job_title: "React Native Developer", company: "MobileMinds", location: "Bangalore", platform: "Glassdoor", remote: true },
  { job_title: "Frontend Engineer", company: "UXPioneers", location: "New York", platform: "LinkedIn", remote: true },
  { job_title: "Web Developer", company: "DigitalDreamers", location: "Remote", platform: "Indeed", remote: true }
];

interface JobMatchingCardProps {
  onMatchComplete: () => void;
}

const JobMatchingCard = ({ onMatchComplete }: JobMatchingCardProps) => {
  const [isMatching, setIsMatching] = useState(false);
  const [matchCount, setMatchCount] = useState(0);

  const matchJobs = async () => {
    setIsMatching(true);
    setMatchCount(0);

    try {
      // Get user preferences
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

      // Filter jobs based on preferences
      const matchedJobs = DUMMY_JOBS.filter(job => {
        // Match by job title (contains)
        const titleMatch = job.job_title.toLowerCase().includes(preferences.job_title.toLowerCase());
        
        // Match by location (exact match or remote)
        const locationMatch = 
          job.location.toLowerCase() === preferences.location.toLowerCase() || 
          (preferences.is_remote && job.remote);
        
        return titleMatch && locationMatch;
      });

      if (matchedJobs.length === 0) {
        toast.warning('No matching jobs found');
        return;
      }

      // Save matched jobs to applications table
      for (const job of matchedJobs) {
        const { error } = await supabase.from('job_applications').insert({
          user_id: user.id,
          job_title: job.job_title,
          company: job.company,
          platform: job.platform,
          status: 'Applied',
          date: new Date().toISOString(),
        });

        if (!error) {
          setMatchCount(prev => prev + 1);
        }
      }

      toast.success(`${matchedJobs.length} jobs matched and applied`);
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
            'Run AI Job Matching'
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
