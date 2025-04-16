import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type JobMatch = Database["public"]["Tables"]["job_matches"]["Row"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  accepted: "bg-green-500",
  rejected: "bg-red-500",
  applied: "bg-blue-500",
};

export function JobMatches() {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from("job_matches")
        .select("*")
        .order("match_score", { ascending: false })
        .returns<JobMatch[]>();

      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      const pgError = error as PostgrestError;
      toast.error(pgError.message || "Failed to fetch job matches");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (matchId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("job_matches")
        .update({ status: newStatus })
        .eq("id", matchId);

      if (error) throw error;
      toast.success("Status updated successfully");
      fetchMatches();
    } catch (error) {
      const pgError = error as PostgrestError;
      toast.error(pgError.message || "Failed to update status");
    }
  };

  if (loading) {
    return <div>Loading matches...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Matches</CardTitle>
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No job matches found. We'll notify you when we find matches for your
            profile.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Match Score</TableHead>
                <TableHead>Match Reasons</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>
                    {match.job_url ? (
                      <a
                        href={match.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {match.company_name}
                      </a>
                    ) : (
                      match.company_name
                    )}
                  </TableCell>
                  <TableCell>{match.job_title}</TableCell>
                  <TableCell>{match.match_score}%</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {match.match_reasons.map((reason, index) => (
                        <Badge key={index} variant="secondary">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        statusColors[match.status.toLowerCase()]
                      } text-white`}
                    >
                      {match.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {match.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusChange(match.id, "accepted")
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleStatusChange(match.id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {match.status === "accepted" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(match.id, "applied")
                          }
                        >
                          Mark as Applied
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
