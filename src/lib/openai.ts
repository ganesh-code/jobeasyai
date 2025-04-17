import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Note: In production, you should use a backend API
});

export interface ResumeCustomizationInput {
    originalResume: string;
    jobTitle: string;
    company: string;
    jobDescription: string;
    requirements: string;
}

export interface CoverLetterInput {
    jobTitle: string;
    company: string;
    jobDescription: string;
    requirements: string;
    userExperience: string;
}

export async function customizeResume(input: ResumeCustomizationInput): Promise<string> {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a professional resume writer who specializes in customizing resumes for specific job applications."
                },
                {
                    role: "user",
                    content: `Please customize this resume for a ${input.jobTitle} position at ${input.company}.
                    
Job Description:
${input.jobDescription}

Requirements:
${input.requirements}

Original Resume:
${input.originalResume}

Instructions:
1. Analyze the job description and requirements
2. Identify key skills and experiences that match
3. Rewrite the resume summary and experience sections to highlight relevant experience
4. Use industry-specific keywords from the job description
5. Maintain a professional tone
6. Format the output as a clean text document`
                }
            ],
            temperature: 0.7,
        });

        return completion.choices[0].message.content || 'Failed to generate resume';
    } catch (error) {
        console.error('Error customizing resume:', error);
        throw new Error('Failed to customize resume. Please check your OpenAI API key and try again.');
    }
}

export async function generateCoverLetter(input: CoverLetterInput): Promise<string> {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a professional cover letter writer who creates compelling, personalized cover letters."
                },
                {
                    role: "user",
                    content: `Write a compelling cover letter for a ${input.jobTitle} position at ${input.company}.

Job Description:
${input.jobDescription}

Requirements:
${input.requirements}

Candidate's Relevant Experience:
${input.userExperience}

Instructions:
1. Write a professional cover letter
2. Address the key requirements from the job description
3. Highlight specific experiences that match the role
4. Show enthusiasm for the company and role
5. Keep it concise (max 400 words)
6. Use a professional business letter format`
                }
            ],
            temperature: 0.7,
        });

        return completion.choices[0].message.content || 'Failed to generate cover letter';
    } catch (error) {
        console.error('Error generating cover letter:', error);
        throw new Error('Failed to generate cover letter. Please check your OpenAI API key and try again.');
    }
} 