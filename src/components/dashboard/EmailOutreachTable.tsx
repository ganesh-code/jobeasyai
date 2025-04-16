
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailOutreach {
  id: string;
  recipient_email: string;
  job_title: string;
  sent_at: string;
  status: string;
}

interface EmailOutreachTableProps {
  isLoading: boolean;
}

const EmailOutreachTable = ({ isLoading }: EmailOutreachTableProps) => {
  const [emails, setEmails] = useState<EmailOutreach[]>([]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const { data, error } = await supabase
          .from('email_outreach')
          .select('id, recipient_email, job_title: job_applications(job_title), sent_at, status')
          .order('sent_at', { ascending: false });

        if (error) throw error;
        setEmails(data || []);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchEmails();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading emails...</div>;
  }

  if (emails.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No email outreach attempts yet.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date Sent</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.map((email) => (
            <TableRow key={email.id}>
              <TableCell>{email.job_title}</TableCell>
              <TableCell>{email.recipient_email}</TableCell>
              <TableCell>{new Date(email.sent_at).toLocaleDateString()}</TableCell>
              <TableCell>{email.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmailOutreachTable;
