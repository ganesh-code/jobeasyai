import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicationsTable from "@/components/dashboard/ApplicationsTable";
import EmailOutreachTable from "@/components/dashboard/EmailOutreachTable";
import JobMatchingCard from "@/components/dashboard/JobMatchingCard";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Dashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };

    checkSession();
    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/auth");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between px-4">
            <h2 className="text-lg font-semibold">JobEasyAI</h2>
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button onClick={() => navigate("/settings")}>
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Jobs Applied</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{applications.length}</div>
                </CardContent>
              </Card>
              
              <JobMatchingCard onMatchComplete={fetchApplications} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <ApplicationsTable 
                  applications={applications}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Outreach</CardTitle>
              </CardHeader>
              <CardContent>
                <EmailOutreachTable isLoading={isLoading} />
              </CardContent>
            </Card>

            <Button 
              variant="outline" 
              className="w-full md:w-auto"
              disabled
            >
              Pause Auto-Apply
            </Button>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
