import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Delete user's resume from storage if exists
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("resume_url")
        .eq("user_id", user.id)
        .single();

      if (profile?.resume_url) {
        const fileName = profile.resume_url.split("/").pop();
        if (fileName) {
          await supabase.storage.from("resumes").remove([fileName]);
        }
      }

      // Delete user data from all tables
      const { error: deleteError } = await supabase
        .from("user_profiles")
        .delete()
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      const { error: preferencesError } = await supabase
        .from("user_preferences")
        .delete()
        .eq("user_id", user.id);

      if (preferencesError) throw preferencesError;

      const { error: applicationsError } = await supabase
        .from("job_applications")
        .delete()
        .eq("user_id", user.id);

      if (applicationsError) throw applicationsError;

      // Sign out the user
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Account deleted successfully");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (platform: string) => {
    // This would be replaced with actual OAuth integration
    toast.info(`${platform} integration coming soon`);
  };

  const platforms = [
    {
      name: "LinkedIn",
      description:
        "Connect your LinkedIn account to import your professional profile and apply to jobs directly.",
      color: "bg-[#0077B5]",
    },
    {
      name: "Indeed",
      description:
        "Link your Indeed account to sync your job applications and profile information.",
      color: "bg-[#003A9B]",
    },
    {
      name: "Glassdoor",
      description:
        "Connect with Glassdoor to access company reviews and salary insights.",
      color: "bg-[#0CAA41]",
    },
    {
      name: "Naukri",
      description:
        "Link your Naukri.com account to expand your job search across India.",
      color: "bg-[#FF7555]",
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-6">
        <h1 className="text-3xl font-bold">Account Settings</h1>

        {/* Platform Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Integrations</CardTitle>
            <CardDescription>
              Connect your accounts from other job platforms to enhance your job
              search experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <h3 className="font-medium">{platform.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {platform.description}
                  </p>
                </div>
                <Button
                  onClick={() => handleConnect(platform.name)}
                  variant="outline"
                >
                  Connect
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Delete Account */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Account"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
