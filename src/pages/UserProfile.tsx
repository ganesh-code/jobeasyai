import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Building,
  Save,
  FileText,
  Upload,
  X,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserProfile {
  first_name: string;
  last_name: string;
  phone_number: string;
  location: string;
  portfolio_url: string | null;
  linkedin_url: string | null;
  resume_url: string | null;
}

interface UserPreferences {
  job_title: string;
  industry: string;
  salary_range: string;
  work_preference: "remote" | "hybrid" | "onsite";
}

interface JobApplication {
  id: string;
  user_id: string;
  job_id: string | null;
  company_name: string;
  job_title: string;
  job_url: string | null;
  status: string;
  notes: string | null;
  applied_date: string;
  next_follow_up: string | null;
  created_at: string;
  updated_at: string;
}

interface UploadedDocument {
  name: string;
  url: string;
  type: "resume" | "cover_letter";
  uploaded_at: string;
}

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Marketing",
  "Design",
  "Sales",
  "Other",
];

const salaryRanges = [
  "0-3 LPA",
  "3-6 LPA",
  "6-10 LPA",
  "10-15 LPA",
  "15-25 LPA",
  "25+ LPA",
];

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    first_name: "",
    last_name: "",
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
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

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
      if (profileData) setProfile(profileData);

      // Fetch preferences data
      const { data: preferencesData, error: preferencesError } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (preferencesError && preferencesError.code !== "PGRST116")
        throw preferencesError;
      if (preferencesData) setPreferences(preferencesData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update profile
      const { error: profileError } = await supabase
        .from("user_profiles")
        .upsert({
          user_id: user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // Update preferences
      const { error: preferencesError } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString(),
        });

      if (preferencesError) throw preferencesError;

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={profile.first_name}
                    onChange={(e) =>
                      setProfile({ ...profile, first_name: e.target.value })
                    }
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={profile.last_name}
                    onChange={(e) =>
                      setProfile({ ...profile, last_name: e.target.value })
                    }
                    placeholder="Doe"
                  />
                </div>
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
                    setProfile({ ...profile, phone_number: e.target.value })
                  }
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                  placeholder="Enter your location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio_url">Portfolio URL</Label>
                <Input
                  id="portfolio_url"
                  value={profile.portfolio_url || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, portfolio_url: e.target.value })
                  }
                  placeholder="Enter your portfolio URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  value={profile.linkedin_url || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, linkedin_url: e.target.value })
                  }
                  placeholder="Enter your LinkedIn URL"
                />
              </div>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Resume Section */}
                  <div>
                    <h3 className="font-medium mb-2">Resume</h3>
                    {profile.resume_url ? (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            resume{profile.resume_url.split(".").pop()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(profile.resume_url, "_blank")
                            }
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Upload className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Update Resume</DialogTitle>
                                <DialogDescription>
                                  Upload a new version of your resume. Supported
                                  formats: PDF, DOC, DOCX
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Input
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    try {
                                      const user = (
                                        await supabase.auth.getUser()
                                      ).data.user;
                                      if (!user)
                                        throw new Error("Not authenticated");

                                      // Upload new resume
                                      const fileExt = file.name
                                        .split(".")
                                        .pop();
                                      const fileName = `${
                                        user.id
                                      }-${Date.now()}.${fileExt}`;
                                      const { error: uploadError } =
                                        await supabase.storage
                                          .from("resumes")
                                          .upload(fileName, file);

                                      if (uploadError) throw uploadError;

                                      // Get the public URL
                                      const {
                                        data: { publicUrl },
                                      } = supabase.storage
                                        .from("resumes")
                                        .getPublicUrl(fileName);

                                      // Delete old resume if exists
                                      if (profile.resume_url) {
                                        await supabase.storage
                                          .from("resumes")
                                          .remove([
                                            profile.resume_url
                                              .split("/")
                                              .pop()!,
                                          ]);
                                      }

                                      // Update profile with new resume URL
                                      const { error: updateError } =
                                        await supabase
                                          .from("user_profiles")
                                          .update({ resume_url: publicUrl })
                                          .eq("user_id", user.id);

                                      if (updateError) throw updateError;

                                      setProfile({
                                        ...profile,
                                        resume_url: publicUrl,
                                      });
                                      toast.success(
                                        "Resume updated successfully"
                                      );
                                    } catch (error) {
                                      console.error(
                                        "Error updating resume:",
                                        error
                                      );
                                      toast.error("Failed to update resume");
                                    }
                                  }}
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              try {
                                const user = (await supabase.auth.getUser())
                                  .data.user;
                                if (!user) throw new Error("Not authenticated");

                                await supabase.storage
                                  .from("resumes")
                                  .remove([
                                    profile.resume_url.split("/").pop()!,
                                  ]);

                                await supabase
                                  .from("user_profiles")
                                  .update({ resume_url: null })
                                  .eq("user_id", user.id);

                                setProfile({ ...profile, resume_url: "" });
                                toast.success("Resume deleted successfully");
                              } catch (error) {
                                console.error("Error deleting resume:", error);
                                toast.error("Failed to delete resume");
                              }
                            }}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg">
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop your resume here or click to browse
                          </p>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            id="resume-upload"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              try {
                                const user = (await supabase.auth.getUser())
                                  .data.user;
                                if (!user) throw new Error("Not authenticated");

                                // Upload resume
                                const fileExt = file.name.split(".").pop();
                                const fileName = `${
                                  user.id
                                }-${Date.now()}.${fileExt}`;
                                const { error: uploadError } =
                                  await supabase.storage
                                    .from("resumes")
                                    .upload(fileName, file);

                                if (uploadError) throw uploadError;

                                // Get the public URL
                                const {
                                  data: { publicUrl },
                                } = supabase.storage
                                  .from("resumes")
                                  .getPublicUrl(fileName);

                                // Update profile with resume URL
                                const { error: updateError } = await supabase
                                  .from("user_profiles")
                                  .update({ resume_url: publicUrl })
                                  .eq("user_id", user.id);

                                if (updateError) throw updateError;

                                setProfile({
                                  ...profile,
                                  resume_url: publicUrl,
                                });
                                toast.success("Resume uploaded successfully");
                              } catch (error) {
                                console.error("Error uploading resume:", error);
                                toast.error("Failed to upload resume");
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            onClick={() =>
                              document.getElementById("resume-upload")?.click()
                            }
                          >
                            Upload Resume
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Job Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Job Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job_title">Desired Job Title</Label>
                <Input
                  id="job_title"
                  value={preferences.job_title}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      job_title: e.target.value,
                    })
                  }
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={preferences.industry}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, industry: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_range">Expected Salary</Label>
                <Select
                  value={preferences.salary_range}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, salary_range: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select salary range" />
                  </SelectTrigger>
                  <SelectContent>
                    {salaryRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="work_preference">Work Preference</Label>
                <Select
                  value={preferences.work_preference}
                  onValueChange={(value) =>
                    setPreferences({
                      ...preferences,
                      work_preference: value as "remote" | "hybrid" | "onsite",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select work preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
