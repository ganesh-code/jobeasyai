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
import { Checkbox } from "@/components/ui/checkbox";

interface JobPreferencesFormProps {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    location: string;
    isRemote: boolean;
    portfolioUrl: string;
  }) => void;
  isSubmitting: boolean;
  onBack: () => void;
}

const CITIES = ["New York", "London", "Mumbai", "Bangalore", "Remote"];

const JobPreferencesForm = ({
  onSubmit,
  isSubmitting,
  onBack,
}: JobPreferencesFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !jobTitle || !location) {
      return;
    }
    onSubmit({
      firstName,
      lastName,
      jobTitle,
      location,
      isRemote,
      portfolioUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="e.g. John"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="e.g. Doe"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input
          id="jobTitle"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Software Engineer"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Select value={location} onValueChange={setLocation} required>
          <SelectTrigger id="location">
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="remote"
          checked={isRemote}
          onCheckedChange={(checked) => setIsRemote(checked as boolean)}
        />
        <Label htmlFor="remote">Open to remote work</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolioUrl">Portfolio URL (Optional)</Label>
        <Input
          id="portfolioUrl"
          type="url"
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
          placeholder="https://your-portfolio.com"
        />
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Complete Setup"}
        </Button>
      </div>
    </form>
  );
};

export default JobPreferencesForm;
