import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const sampleMatches = [
    {
        job_title: "Senior Frontend Developer",
        company_name: "TechCorp Inc.",
        job_url: "https://example.com/job/1",
        match_score: 95,
        match_reasons: ["React experience", "TypeScript proficiency", "5+ years experience"],
        status: "pending"
    },
    {
        job_title: "Full Stack Engineer",
        company_name: "StartupX",
        job_url: "https://example.com/job/2",
        match_score: 88,
        match_reasons: ["Node.js experience", "AWS knowledge", "Team lead experience"],
        status: "pending"
    },
    {
        job_title: "Software Engineer",
        company_name: "GlobalTech",
        job_url: "https://example.com/job/3",
        match_score: 82,
        match_reasons: ["Python experience", "Machine learning basics", "Agile methodology"],
        status: "pending"
    },
    {
        job_title: "DevOps Engineer",
        company_name: "CloudSolutions",
        job_url: "https://example.com/job/4",
        match_score: 75,
        match_reasons: ["Docker experience", "CI/CD knowledge", "Linux administration"],
        status: "pending"
    }
];

export async function seedJobMatches() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("No authenticated user found");
            return;
        }

        // First, clear existing matches for the user
        const { error: deleteError } = await supabase
            .from("job_matches")
            .delete()
            .eq("user_id", user.id);

        if (deleteError) throw deleteError;

        // Insert new matches
        const matchesWithUserId = sampleMatches.map(match => ({
            ...match,
            user_id: user.id
        }));

        const { error: insertError } = await supabase
            .from("job_matches")
            .insert(matchesWithUserId);

        if (insertError) throw insertError;

        toast.success("Sample job matches added successfully!");
    } catch (error) {
        console.error("Error seeding job matches:", error);
        toast.error("Failed to add sample job matches");
    }
} 