import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";
import AddJobApplicationForm from "@/components/jobs/AddJobApplicationForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface JobApplication {
  id: string;
  company_name: string;
  job_title: string;
  application_date: string;
  status: "applied" | "interviewing" | "offered" | "rejected";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchJobApplications();
  }, []);

  const fetchJobApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .order("application_date", { ascending: false })
        .returns<JobApplication[]>();

      if (error) throw error;
      setJobApplications(data || []);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      if (error instanceof PostgrestError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch job applications");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: JobApplication["status"]) => {
    switch (status) {
      case "applied":
        return "default";
      case "interviewing":
        return "secondary";
      case "offered":
        return "outline";
      case "rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  if (showAddForm) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <AddJobApplicationForm />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Job Applications</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => toast.success("Sample matches added!")}
              >
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
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : jobApplications.length === 0 ? (
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
                      <TableHead>Application Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>{application.company_name}</TableCell>
                        <TableCell>{application.job_title}</TableCell>
                        <TableCell>
                          {new Date(
                            application.application_date
                          ).toLocaleDateString()}
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
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Jobs Applied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{jobApplications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Match Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>No matches found</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
