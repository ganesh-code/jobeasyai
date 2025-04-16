
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Application {
  id: string;
  job_title: string;
  company: string;
  platform: string;
  date: string;
  status: string;
}

interface ApplicationsTableProps {
  applications: Application[];
  isLoading: boolean;
}

const ApplicationsTable = ({ applications, isLoading }: ApplicationsTableProps) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading applications...</div>;
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No applications yet. Use AI Job Matching to apply to jobs that match your preferences.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>{app.job_title}</TableCell>
              <TableCell>{app.company}</TableCell>
              <TableCell>{app.platform}</TableCell>
              <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
              <TableCell>{app.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationsTable;
