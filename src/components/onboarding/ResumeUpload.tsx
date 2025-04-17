import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { HelpCircle, Upload } from "lucide-react";

interface ResumeUploadProps {
  onNext: () => void;
  onBack: () => void;
  onUploadComplete: (url: string) => void;
}

const ResumeUpload = ({
  onNext,
  onBack,
  onUploadComplete,
}: ResumeUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    setIsUploading(true);
    try {
      const { data, error } = await supabase.storage
        .from("resumes")
        .upload(`resumes/${file.name}`, file);

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("resumes").getPublicUrl(data.path);
        onUploadComplete(publicUrl);
        onNext();
      }
    } catch (error: unknown) {
      console.error("Error uploading resume:", error);
      if (error instanceof Error) {
        toast.error(`Failed to upload resume: ${error.message}`);
      } else {
        toast.error("Failed to upload resume. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
        <p className="text-gray-600 mb-6">
          Upload your resume in PDF format. We'll use this to help match you
          with relevant job opportunities.
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
          id="resume-upload"
        />
        <label htmlFor="resume-upload" className="cursor-pointer block">
          <div className="space-y-2">
            <p className="text-gray-600">Drag and drop your resume here, or</p>
            <Button variant="outline" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Select File"}
            </Button>
          </div>
        </label>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isUploading}>
          Back
        </Button>
        <Button variant="outline" onClick={onNext} disabled={isUploading}>
          Skip
        </Button>
      </div>
    </div>
  );
};

export default ResumeUpload;
