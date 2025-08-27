'use server';
/**
 * @fileOverview Assesses project risks based on task completion status and team member updates.
 *
 * - assessProjectRisks - A function that analyzes project data to identify potential risks.
 * - AssessProjectRisksInput - The input type for the assessProjectRisks function.
 * - AssessProjectRisksOutput - The return type for the assessProjectRisks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessProjectRisksInputSchema = z.object({
  tasks: z.record(z.object({
    taskName: z.string(),
    owner: z.array(z.string()).nullable(),
    priority: z.string().nullable(),
    status: z.string().nullable(),
    startDate: z.string().nullable(),
    dueDate: z.string().nullable(),
    percentComplete: z.number().nullable(),
    dependsOn: z.string().nullable(),
    blockers: z.string().nullable(),
    nextSteps: z.string().nullable(),
    notes: z.string().nullable(),
  })).describe('A map of task IDs to task details.'),
  teamMemberUpdates: z.array(z.object({
    member: z.string(),
    dailyFocus: z.string().nullable(),
    completionStatus: z.string().nullable(),
  })).describe('An array of team member updates.'),
});
export type AssessProjectRisksInput = z.infer<typeof AssessProjectRisksInputSchema>;

const AssessProjectRisksOutputSchema = z.object({
  summary: z.string().describe('A summary of the overall project status, potential risks, and recommendations.'),
  risks: z.array(z.string()).describe('A list of identified risks.'),
  recommendations: z.array(z.string()).describe('A list of recommendations to mitigate the identified risks.'),
});
export type AssessProjectRisksOutput = z.infer<typeof AssessProjectRisksOutputSchema>;

export async function assessProjectRisks(input: AssessProjectRisksInput): Promise<AssessProjectRisksOutput> {
  return assessProjectRisksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessProjectRisksPrompt',
  input: {schema: AssessProjectRisksInputSchema},
  output: {schema: AssessProjectRisksOutputSchema},
  prompt: `You are an AI project manager responsible for assessing project risks and providing recommendations.

Analyze the following project data to identify potential risks, delays, and blockers. Provide a summary of the overall project status, a list of identified risks, and a list of recommendations to mitigate those risks.

Tasks:
{{#each tasks}}
  - Task ID: {{@key}}
    - Task Name: {{this.taskName}}
    - Owner: {{this.owner}}
    - Priority: {{this.priority}}
    - Status: {{this.status}}
    - Due Date: {{this.dueDate}}
    - Percent Complete: {{this.percentComplete}}
    - Blockers: {{this.blockers}}
{{/each}}

Team Member Updates:
{{#each teamMemberUpdates}}
  - Member: {{member}}
    - Daily Focus: {{dailyFocus}}
    - Completion Status: {{completionStatus}}
{{/each}}


Summary:
Risks:
Recommendations: `,
});

const assessProjectRisksFlow = ai.defineFlow(
  {
    name: 'assessProjectRisksFlow',
    inputSchema: AssessProjectRisksInputSchema,
    outputSchema: AssessProjectRisksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
