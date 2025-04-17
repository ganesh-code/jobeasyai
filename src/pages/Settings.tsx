import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import DashboardLayout from "@/components/layout/DashboardLayout";

type UserPreferences = Database["public"]["Tables"]["user_preferences"]["Row"];

const Settings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    job_title: "",
    location: "",
    is_remote: false,
    portfolio_url: "",
    resume_url: "",
  });

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  const fetchUserPreferences = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      if (error instanceof PostgrestError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch user preferences");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      const { error } = await supabase.from("user_preferences").upsert({
        user_id: user.id,
        ...preferences,
      });

      if (error) throw error;
      toast.success("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      if (error instanceof PostgrestError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save preferences");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Job Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="job_title">Desired Job Title</Label>
                <Input
                  id="job_title"
                  value={preferences.job_title || ""}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      job_title: e.target.value,
                    })
                  }
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Preferred Location</Label>
                <Input
                  id="location"
                  value={preferences.location || ""}
                  onChange={(e) =>
                    setPreferences({ ...preferences, location: e.target.value })
                  }
                  placeholder="e.g. New York, NY"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_remote"
                  checked={preferences.is_remote || false}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, is_remote: checked })
                  }
                />
                <Label htmlFor="is_remote">Open to Remote Work</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio_url">Portfolio URL</Label>
                <Input
                  id="portfolio_url"
                  type="url"
                  value={preferences.portfolio_url || ""}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      portfolio_url: e.target.value,
                    })
                  }
                  placeholder="https://your-portfolio.com"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
