import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserProfile {
  full_name: string;
  phone_number: string;
  location: string;
  portfolio_url: string;
  linkedin_url: string;
  resume_url: string;
}

interface UserPreferences {
  job_title: string;
  industry: string;
  salary_range: string;
  work_preference: "remote" | "hybrid" | "onsite";
}

export function UserProfileSection() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    full_name: "",
    phone_number: "",
    location: "",
    portfolio_url: "",
    linkedin_url: "",
    resume_url: "",
  });
  const [preferences, setPreferences] = useState<UserPreferences>({
    job_title: "",
    industry: "",
    salary_range: "",
    work_preference: "remote",
  });
  const [email, setEmail] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      setEmail(user.email || "");

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") throw profileError;
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch preferences data
      const { data: preferencesData, error: preferencesError } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (preferencesError && preferencesError.code !== "PGRST116")
        throw preferencesError;
      if (preferencesData) {
        setPreferences(preferencesData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreferencesChange = (
    field: keyof UserPreferences,
    value: string
  ) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const handleResumeUpload = async (file: File) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/resume.${fileExt}`;

      // First, check if the file already exists
      const { data: existingFiles } = await supabase.storage
        .from("resumes")
        .list(user.id);

      // If file exists, remove it first
      if (existingFiles?.some((f) => f.name === `resume.${fileExt}`)) {
        const { error: deleteError } = await supabase.storage
          .from("resumes")
          .remove([fileName]);

        if (deleteError) {
          console.error("Error deleting existing resume:", deleteError);
        }
      }

      // Upload the new file
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("resumes").getPublicUrl(fileName);

      setProfile((prev) => ({ ...prev, resume_url: publicUrl }));
      toast.success("Resume uploaded successfully");
      return publicUrl;
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume. Please try again.");
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let resumeUrl = profile.resume_url;

      // Upload resume if selected
      if (resumeFile) {
        try {
          resumeUrl = await handleResumeUpload(resumeFile);
        } catch (error) {
          console.error("Resume upload failed:", error);
          // Continue with the rest of the profile update even if resume upload fails
        }
      }

      // Update profile
      const { error: profileError } = await supabase
        .from("user_profiles")
        .upsert({
          user_id: user.id,
          ...profile,
          resume_url: resumeUrl,
        });

      if (profileError) throw profileError;

      // Update preferences - only include non-null values
      const preferencesData = {
        user_id: user.id,
        ...(preferences.job_title && { job_title: preferences.job_title }),
        ...(preferences.industry && { industry: preferences.industry }),
        ...(preferences.salary_range && {
          salary_range: preferences.salary_range,
        }),
        ...(preferences.work_preference && {
          work_preference: preferences.work_preference,
        }),
      };

      const { error: preferencesError } = await supabase
        .from("user_preferences")
        .upsert(preferencesData);

      if (preferencesError) {
        console.error("Error updating preferences:", preferencesError);
        throw preferencesError;
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) => handleProfileChange("full_name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              value={profile.phone_number}
              onChange={(e) =>
                handleProfileChange("phone_number", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) => handleProfileChange("location", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio_url">Portfolio URL</Label>
            <Input
              id="portfolio_url"
              value={profile.portfolio_url}
              onChange={(e) =>
                handleProfileChange("portfolio_url", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn Profile URL</Label>
            <Input
              id="linkedin_url"
              value={profile.linkedin_url}
              onChange={(e) =>
                handleProfileChange("linkedin_url", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_title">Preferred Job Title</Label>
            <Input
              id="job_title"
              value={preferences.job_title}
              onChange={(e) =>
                handlePreferencesChange("job_title", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={preferences.industry}
              onChange={(e) =>
                handlePreferencesChange("industry", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary_range">Expected Salary Range</Label>
            <Input
              id="salary_range"
              value={preferences.salary_range}
              onChange={(e) =>
                handlePreferencesChange("salary_range", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="work_preference">Work Preference</Label>
            <Select
              value={preferences.work_preference}
              onValueChange={(value) =>
                handlePreferencesChange("work_preference", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select work preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="onsite">Onsite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Resume</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            />
            {profile.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                View Current Resume
              </a>
            )}
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
