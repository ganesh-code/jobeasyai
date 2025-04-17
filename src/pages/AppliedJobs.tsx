import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface JobApplication {
  id: string;
  company: string;
  job_title: string;
  platform: string;
  status: "applied" | "interviewing" | "offered" | "rejected";
  date: string;
  last_updated: string;
  notes?: string;
}

export default function AppliedJobs() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .returns<JobApplication[]>();

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your job applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: JobApplication["status"]) => {
    const variants = {
      applied: "default",
      interviewing: "secondary",
      offered: "outline",
      rejected: "destructive",
    } as const;
    return variants[status];
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      linkedin: "bg-[#0077B5] text-white",
      glassdoor: "bg-[#0CAA41] text-white",
      indeed: "bg-[#003A9B] text-white",
      naukri: "bg-[#FF7555] text-white",
      google: "bg-gray-100 text-gray-800",
    } as const;
    return (
      colors[platform as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applied Jobs</h1>
            <p className="text-gray-500 mt-1">
              Track and manage your job applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Total Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{applications.length}</div>
              </CardContent>
            </Card>
            {(["applied", "interviewing", "offered", "rejected"] as const).map(
              (status) => (
                <Card key={status}>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium capitalize">
                      {status}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        applications.filter((app) => app.status === status)
                          .length
                      }
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>

          {applications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-gray-500">No job applications yet.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start applying to jobs from the Find Jobs page!
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Application History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>{application.company}</TableCell>
                        <TableCell>{application.job_title}</TableCell>
                        <TableCell>
                          <Badge
                            className={getPlatformColor(
                              application.platform || ""
                            )}
                          >
                            {application.platform
                              ? application.platform.charAt(0).toUpperCase() +
                                application.platform.slice(1)
                              : "Other"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(application.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadgeVariant(application.status)}
                          >
                            {application.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
