import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, X, Menu, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface Job {
  id: string;
  title: string;
  company: string;
  platform: string;
}

const Dashboard = () => {
  const [jobTitle, setJobTitle] = useState("UX designer");
  const [showResults, setShowResults] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [totalJobs] = useState("300 jobs");

  // Mock jobs data
  const jobs: Job[] = [
    {
      id: "1",
      title: "UX Designer III",
      company: "intelliguard",
      platform: "Rippling",
    },
    {
      id: "2",
      title: "UX Designer",
      company: "qu-careers",
      platform: "Rippling",
    },
    {
      id: "3",
      title: "Senior Staff UI/UX Designer",
      company: "mytra",
      platform: "Rippling",
    },
  ];

  const handleSearch = () => {
    setShowResults(true);
  };

  const handleSelectAll = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobs.map((job) => job.id));
    }
  };

  const handleJobSelect = (jobId: string) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const clearAll = () => {
    setShowResults(false);
    setSelectedJobs([]);
  };

  if (showResults) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Search Bar */}
            <div className="bg-white rounded-full shadow-lg p-2 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="pl-10 h-12 border-0 focus-visible:ring-0"
                />
              </div>
              <div className="flex items-center gap-2 px-4 border-l">
                <Menu className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{totalJobs}</span>
              </div>
              <Button size="lg" className="h-12 px-8 rounded-full">
                Find Jobs
              </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px] rounded-full bg-white">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="secondary"
                className="rounded-full bg-zinc-900 text-white hover:bg-zinc-800"
              >
                UX/UI designer <span className="text-red-500 ml-1">*</span>
              </Button>

              <Button
                variant="secondary"
                className="rounded-full bg-zinc-900 text-white hover:bg-zinc-800"
              >
                Remote
              </Button>

              <Select>
                <SelectTrigger className="w-[130px] rounded-full">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[130px] rounded-full">
                  <SelectValue placeholder="Work Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[160px] rounded-full">
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedJobs.length === jobs.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600">
                  {selectedJobs.length} selected
                </span>
              </div>
              {selectedJobs.length > 0 && (
                <Button variant="outline" onClick={clearAll}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Selection
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <Checkbox
                        checked={selectedJobs.includes(job.id)}
                        onCheckedChange={() => handleJobSelect(job.id)}
                      />
                      <div>
                        <Briefcase className="h-10 w-10 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{job.platform}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Apply Jobs Across Platforms</h1>
            <p className="text-lg text-gray-600">
              Find and apply to jobs from LinkedIn, Indeed, and more all in one
              place, with a single search.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="UX designer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex items-center gap-2 px-4 border-l">
              <Menu className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{totalJobs}</span>
            </div>
            <Button size="lg" className="h-12 px-8" onClick={handleSearch}>
              Find Jobs
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="indeed">Indeed</SelectItem>
                <SelectItem value="glassdoor">Glassdoor</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profile1">Profile 1</SelectItem>
                <SelectItem value="profile2">Profile 2</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="eu">Europe</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Work Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
