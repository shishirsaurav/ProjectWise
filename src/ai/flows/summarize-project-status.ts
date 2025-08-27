'use server';

/**
 * @fileOverview Summarizes the overall project status, including progress, risks, and recommendations.
 *
 * - summarizeProjectStatus - A function that summarizes the project status.
 * - SummarizeProjectStatusInput - The input type for the summarizeProjectStatus function.
 * - SummarizeProjectStatusOutput - The return type for the summarizeProjectStatus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeProjectStatusInputSchema = z.object({
  tasks: z.string().describe('JSON string of the project tasks data.'),
  teamUpdates: z.string().describe('JSON string of the daily updates from team members.'),
});
export type SummarizeProjectStatusInput = z.infer<typeof SummarizeProjectStatusInputSchema>;

const SummarizeProjectStatusOutputSchema = z.object({
  summary: z.string().describe('A summary of the overall project status.'),
  risks: z.string().describe('Identified risks and potential delays.'),
  recommendations: z.string().describe('Recommendations for the project lead.'),
});
export type SummarizeProjectStatusOutput = z.infer<typeof SummarizeProjectStatusOutputSchema>;

export async function summarizeProjectStatus(input: SummarizeProjectStatusInput): Promise<SummarizeProjectStatusOutput> {
  return summarizeProjectStatusFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeProjectStatusPrompt',
  input: {schema: SummarizeProjectStatusInputSchema},
  output: {schema: SummarizeProjectStatusOutputSchema},
  prompt: `You are a project management AI assistant. Analyze the provided project data and team updates to summarize the overall project status, identify risks, and provide recommendations to the project lead.

Project Tasks Data: {{{tasks}}}

Team Updates: {{{teamUpdates}}}

Provide a concise summary of the project status, clearly outlining progress, potential risks, and actionable recommendations for the project lead. Focus on identifying tasks that are behind schedule, potential roadblocks, and areas where additional support may be needed.
`,
});

const summarizeProjectStatusFlow = ai.defineFlow(
  {
    name: 'summarizeProjectStatusFlow',
    inputSchema: SummarizeProjectStatusInputSchema,
    outputSchema: SummarizeProjectStatusOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
