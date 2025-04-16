import { useState } from "react";
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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AddJobApplicationForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    job_title: "",
    status: "applied",
    application_date: new Date().toISOString().split("T")[0], // Default to today
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      const { error } = await supabase.from("job_applications").insert({
        user_id: user.id,
        company_name: formData.company_name,
        job_title: formData.job_title,
        status: formData.status,
        application_date: formData.application_date,
      });

      if (error) throw error;

      toast.success("Job application added successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding job application:", error);
      toast.error("Failed to add job application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="company_name">Company Name</Label>
        <Input
          id="company_name"
          value={formData.company_name}
          onChange={(e) =>
            setFormData({ ...formData, company_name: e.target.value })
          }
          placeholder="Enter company name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="job_title">Job Title</Label>
        <Input
          id="job_title"
          value={formData.job_title}
          onChange={(e) =>
            setFormData({ ...formData, job_title: e.target.value })
          }
          placeholder="Enter job title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="application_date">Application Date</Label>
        <Input
          id="application_date"
          type="date"
          value={formData.application_date}
          onChange={(e) =>
            setFormData({ ...formData, application_date: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Application Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="interviewing">Interviewing</SelectItem>
            <SelectItem value="offered">Offered</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/dashboard")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Application"}
        </Button>
      </div>
    </form>
  );
};

export default AddJobApplicationForm;
