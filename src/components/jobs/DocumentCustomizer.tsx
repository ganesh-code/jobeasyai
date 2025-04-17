import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, FileText, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  customizeResume,
  generateCoverLetter,
  ResumeCustomizationInput,
  CoverLetterInput,
} from "@/lib/openai";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Job {
  id: string;
  job_title: string;
  company: string;
  job_description: string;
  requirements: string;
}

interface DocumentCustomizerProps {
  job: Job;
}

interface LoadingState {
  resume: boolean;
  coverLetter: boolean;
}

export function DocumentCustomizer({ job }: DocumentCustomizerProps) {
  const [loading, setLoading] = useState<LoadingState>({
    resume: false,
    coverLetter: false,
  });
  const [customDocuments, setCustomDocuments] = useState<{
    resumePath?: string;
    coverLetterPath?: string;
    keywordsUsed?: string[];
  }>({});
  const [originalResume, setOriginalResume] = useState<string | null>(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [previewContent, setPreviewContent] = useState<{
    type: "resume" | "cover-letter";
    content: string;
  } | null>(null);
  const [customizedResume, setCustomizedResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomDocuments();
    fetchOriginalResume();
  }, [job.id]);

  const fetchCustomDocuments = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("custom_documents")
        .select("resume_path, cover_letter_path, keywords_used")
        .eq("user_id", user.id)
        .eq("job_id", job.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      if (data)
        setCustomDocuments({
          resumePath: data.resume_path,
          coverLetterPath: data.cover_letter_path,
          keywordsUsed: data.keywords_used,
        });
    } catch (error) {
      console.error("Error fetching custom documents:", error);
    }
  };

  const fetchOriginalResume = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First check if the resume exists
      const { data: files, error: listError } = await supabase.storage
        .from("resumes")
        .list(user.id);

      if (listError) throw listError;

      const resumeFile = files?.find((file) => file.name === "resume.pdf");
      if (!resumeFile) {
        toast.error("Please upload your resume in Settings first");
        return;
      }

      // Then download it
      const { data: resumeData, error: resumeError } = await supabase.storage
        .from("resumes")
        .download(`${user.id}/resume.pdf`);

      if (resumeError) throw resumeError;

      const text = await resumeData.text();
      setOriginalResume(text);
    } catch (error) {
      console.error("Error fetching original resume:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(
          "Could not fetch your resume. Please upload one in Settings."
        );
      }
    }
  };

  const extractKeywords = (text: string): string[] => {
    // This is a simple keyword extraction. In a real app, you'd want to use
    // more sophisticated NLP techniques or an AI service
    const commonKeywords = [
      "python",
      "javascript",
      "react",
      "node.js",
      "aws",
      "docker",
      "kubernetes",
      "machine learning",
      "agile",
      "leadership",
      "team management",
      "communication",
    ];

    return commonKeywords.filter((keyword) =>
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const customizeDocuments = async () => {
    setLoading({ resume: true, coverLetter: true });
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (!originalResume) {
        throw new Error("Please upload your resume in Settings first");
      }

      // Generate customized resume using AI
      const customizedResume = await customizeResume({
        originalResume,
        jobTitle: job.job_title,
        company: job.company,
        jobDescription: job.job_description,
        requirements: job.requirements,
      });

      // Generate cover letter using AI
      const coverLetter = await generateCoverLetter({
        jobTitle: job.job_title,
        company: job.company,
        jobDescription: job.job_description,
        requirements: job.requirements,
        userExperience: originalResume,
      });

      // Create the user's folder if it doesn't exist
      const timestamp = Date.now();
      const userFolder = `${user.id}/${job.id}`;
      const resumePath = `${userFolder}/resume_${timestamp}.pdf`;
      const coverLetterPath = `${userFolder}/cover_letter_${timestamp}.pdf`;

      // Upload the files
      const { error: uploadError } = await supabase.storage
        .from("custom_documents")
        .upload(
          resumePath,
          new Blob([customizedResume], { type: "application/pdf" })
        );

      if (uploadError) throw uploadError;

      const { error: uploadError2 } = await supabase.storage
        .from("custom_documents")
        .upload(
          coverLetterPath,
          new Blob([coverLetter], { type: "application/pdf" })
        );

      if (uploadError2) throw uploadError2;

      // Extract keywords from the customized resume for tracking
      const keywords = extractKeywords(customizedResume);

      // Save metadata to database
      const { error: dbError } = await supabase.from("custom_documents").upsert(
        {
          user_id: user.id,
          job_id: job.id,
          resume_path: resumePath,
          cover_letter_path: coverLetterPath,
          keywords_used: keywords,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,job_id",
        }
      );

      if (dbError) throw dbError;

      setCustomDocuments({
        resumePath,
        coverLetterPath,
        keywordsUsed: keywords,
      });

      toast.success("Documents customized successfully!");
    } catch (error) {
      console.error("Error customizing documents:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to customize documents. Please try again.");
      }
    } finally {
      setLoading({ resume: false, coverLetter: false });
    }
  };

  const previewDocument = async (
    path: string,
    type: "resume" | "cover-letter"
  ) => {
    try {
      const { data, error } = await supabase.storage
        .from("custom_documents")
        .download(path);

      if (error) throw error;

      const content = await data.text();
      setPreviewContent({ type, content });
      setPreviewDialog(true);
    } catch (error) {
      console.error("Error previewing document:", error);
      toast.error("Failed to preview document. Please try again.");
    }
  };

  const downloadDocument = async (
    path: string,
    type: "resume" | "cover-letter"
  ) => {
    try {
      const { data, error } = await supabase.storage
        .from("custom_documents")
        .download(path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-${job.company}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document. Please try again.");
    }
  };

  const handleCustomizeResume = async () => {
    setLoading({ ...loading, resume: true });
    setError(null);
    try {
      const input: ResumeCustomizationInput = {
        originalResume: originalResume!,
        jobTitle: job.job_title,
        company: job.company,
        jobDescription: job.job_description,
        requirements: job.requirements,
      };
      const result = await customizeResume(input);
      setCustomizedResume(result);
    } catch (err) {
      setError("Failed to customize resume. Please try again later.");
      console.error("Resume customization error:", err);
    } finally {
      setLoading({ ...loading, resume: false });
    }
  };

  const handleGenerateCoverLetter = async () => {
    setLoading({ ...loading, coverLetter: true });
    setError(null);
    try {
      const input: CoverLetterInput = {
        jobTitle: job.job_title,
        company: job.company,
        jobDescription: job.job_description,
        requirements: job.requirements,
        userExperience: originalResume!,
      };
      const result = await generateCoverLetter(input);
      setCoverLetter(result);
    } catch (err) {
      setError("Failed to generate cover letter. Please try again later.");
      console.error("Cover letter generation error:", err);
    } finally {
      setLoading({ ...loading, coverLetter: false });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI-Customized Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!customDocuments.resumePath ? (
            <Button
              onClick={customizeDocuments}
              disabled={loading.resume || !originalResume}
            >
              {loading.resume ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Customizing with AI...
                </>
              ) : (
                "Customize Documents with AI"
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            previewDocument(
                              customDocuments.resumePath!,
                              "resume"
                            )
                          }
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Preview Resume
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            downloadDocument(
                              customDocuments.resumePath!,
                              "resume"
                            )
                          }
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        AI-optimized resume with keywords:{" "}
                        {customDocuments.keywordsUsed?.join(", ")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    previewDocument(
                      customDocuments.coverLetterPath!,
                      "cover-letter"
                    )
                  }
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Preview Cover Letter
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    downloadDocument(
                      customDocuments.coverLetterPath!,
                      "cover-letter"
                    )
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>

              <Button
                variant="ghost"
                className="w-full"
                onClick={customizeDocuments}
                disabled={loading.resume || loading.coverLetter}
              >
                {loading.resume || loading.coverLetter ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  "Regenerate with AI"
                )}
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Button
              onClick={handleCustomizeResume}
              disabled={
                loading.resume || !job.job_description || !originalResume
              }
              className="w-full"
            >
              {loading.resume ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Customizing Resume...
                </>
              ) : (
                "Customize Resume"
              )}
            </Button>
            {customizedResume && (
              <Textarea
                value={customizedResume}
                onChange={(e) => setCustomizedResume(e.target.value)}
                className="h-[200px]"
                placeholder="Customized resume will appear here..."
              />
            )}
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleGenerateCoverLetter}
              disabled={
                loading.coverLetter || !job.job_description || !originalResume
              }
              className="w-full"
            >
              {loading.coverLetter ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Cover Letter...
                </>
              ) : (
                "Generate Cover Letter"
              )}
            </Button>
            {coverLetter && (
              <Textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="h-[200px]"
                placeholder="Generated cover letter will appear here..."
              />
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {previewContent?.type === "resume"
                ? "Resume Preview"
                : "Cover Letter Preview"}
            </DialogTitle>
          </DialogHeader>
          <div className="whitespace-pre-wrap font-mono text-sm">
            {previewContent?.content}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
