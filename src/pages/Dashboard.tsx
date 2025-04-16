import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicationsTable from "@/components/dashboard/ApplicationsTable";
import EmailOutreachTable from "@/components/dashboard/EmailOutreachTable";
import { JobMatches } from "@/components/dashboard/JobMatches";
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
import { AddJobApplicationForm } from "@/components/dashboard/AddJobApplicationForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { PostgrestError } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { seedJobMatches } from "@/scripts/seedJobMatches";

type JobApplication = Database["public"]["Tables"]["job_applications"]["Row"];

const statusColors: Record<string, string> = {
  applied: "bg-blue-500",
  interviewing: "bg-yellow-500",
  offered: "bg-green-500",
  rejected: "bg-red-500",
  accepted: "bg-purple-500",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
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
        .order("application_date", { ascending: false })
        .returns<JobApplication[]>();

      if (error) throw error;

      setApplications(data || []);
    } catch (error) {
      const pgError = error as PostgrestError;
      toast.error(pgError.message || "Failed to fetch job applications");
    } finally {
      setLoading(false);
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

  const handleSeedMatches = async () => {
    await seedJobMatches();
  };

  if (showAddForm) {
    return <AddJobApplicationForm onApplicationAdded={fetchApplications} />;
  }

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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Job Applications</h1>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSeedMatches}>
                  Add Sample Matches
                </Button>
                <Button onClick={() => setShowAddForm(true)}>
                  Add Job Application
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Applications Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No job applications yet. Start by adding your first
                    application!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied On</TableHead>
                        <TableHead>Next Follow-up</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell>
                            {app.job_url ? (
                              <a
                                href={app.job_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {app.company_name}
                              </a>
                            ) : (
                              app.company_name
                            )}
                          </TableCell>
                          <TableCell>{app.job_title}</TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                statusColors[app.status.toLowerCase()]
                              } text-white`}
                            >
                              {app.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(
                              new Date(app.application_date),
                              "MMM d, yyyy"
                            )}
                          </TableCell>
                          <TableCell>
                            {app.next_follow_up
                              ? format(
                                  new Date(app.next_follow_up),
                                  "MMM d, yyyy"
                                )
                              : "Not set"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Jobs Applied</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{applications.length}</div>
              </CardContent>
            </Card>

            <JobMatches />

            <Card>
              <CardHeader>
                <CardTitle>Email Outreach</CardTitle>
              </CardHeader>
              <CardContent>
                <EmailOutreachTable isLoading={loading} />
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full md:w-auto" disabled>
              Pause Auto-Apply
            </Button>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
