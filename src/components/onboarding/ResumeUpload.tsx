
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { HelpCircle, Upload } from "lucide-react";

interface ResumeUploadProps {
  onUploadComplete: (url: string) => void;
}

const ResumeUpload = ({ onUploadComplete }: ResumeUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const fileName = `${userId}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      onUploadComplete(publicUrl);
      toast.success('Resume uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="resume">Upload Resume</Label>
        <Tooltip>
          <TooltipTrigger>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>Upload resume to auto-fill applications</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-4">
        <Input
          id="resume"
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        />
        {isUploading && <Upload className="h-4 w-4 animate-spin" />}
      </div>
    </div>
  );
};

export default ResumeUpload;
