
import { useState } from 'react';
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
    jobTitle: string;
    location: string;
    isRemote: boolean;
    portfolioUrl: string;
  }) => void;
}

const CITIES = ["New York", "London", "Mumbai", "Bangalore", "Remote"];

const JobPreferencesForm = ({ onSubmit }: JobPreferencesFormProps) => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !location) {
      return;
    }
    onSubmit({ jobTitle, location, isRemote, portfolioUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
    </form>
  );
};

export default JobPreferencesForm;
