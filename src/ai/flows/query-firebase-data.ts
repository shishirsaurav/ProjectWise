
'use server';

/**
 * @fileOverview An AI agent that translates natural language queries into Firebase queries and retrieves the data.
 *
 * - queryFirebaseData - A function that handles the query process.
 * - QueryFirebaseDataInput - The input type for the queryFirebaseData function.
 * - QueryFirebaseDataOutput - The return type for the queryFirebaseData function.
 */

import {ai} from '@/ai/genkit';
import {Message, Part} from 'genkit';
import {z} from 'zod';
import { assessProjectStatus, createProjectTask, deleteProjectTask, getAllTeamMembers, getBlockedTasks, getProjectTasks, getTasksByOwner, getTeamMemberDailyUpdates, getTheProjectLead, updateProjectTask } from '../tools/project-data-tools';

const QueryFirebaseDataInputSchema = z.object({
  query: z.string().describe('The natural language query about the project data.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() }))
  })).optional().describe('The chat history.'),
});
export type QueryFirebaseDataInput = z.infer<typeof QueryFirebaseDataInputSchema>;

const QueryFirebaseDataOutputSchema = z.object({
  firebaseQuery: z.string().describe('The Firebase query generated from the natural language query. If a tool was used, this can be the tool name.'),
  results: z.string().describe('The results from the Firebase query or tool call.'),
});
export type QueryFirebaseDataOutput = z.infer<typeof QueryFirebaseDataOutputSchema>;

export async function queryFirebaseData(input: QueryFirebaseDataInput): Promise<QueryFirebaseDataOutput> {
  return queryFirebaseDataFlow(input);
}

const systemInstruction = `You are an expert project management assistant. Your role is to answer questions about projects, tasks, and team members based on the provided data. You can also create, update, and delete tasks.

Use the available tools to answer the user's questions. If you don't have a tool that can answer the question, say so. Do not make up information.

When you use a tool, briefly explain what you are doing. For example, if you use the 'getProjectTasks' tool, say something like "I am looking up the project tasks...". If you create, update, or delete a task, confirm that the action was successful.

After you have the information from the tool, present it to the user in a clear and concise way. Format lists as bullet points.`;


const queryFirebaseDataFlow = ai.defineFlow(
  {
    name: 'queryFirebaseDataFlow',
    inputSchema: QueryFirebaseDataInputSchema,
    outputSchema: QueryFirebaseDataOutputSchema,
  },
  async ({ query, history }) => {
    const llmResponse = await ai.generate({
      prompt: query,
      model: ai.model,
      tools: [getProjectTasks, getAllTeamMembers, getTheProjectLead, getTasksByOwner, getTeamMemberDailyUpdates, getBlockedTasks, assessProjectStatus, createProjectTask, updateProjectTask, deleteProjectTask],
      history: history as Message[],
      system: systemInstruction,
    });

    const toolRequest = llmResponse.toolRequest;
    if (toolRequest) {
        const toolResponse = await toolRequest.run();
        const responseWithToolResult = await ai.generate({
            prompt: query,
            model: ai.model,
            tools: [getProjectTasks, getAllTeamMembers, getTheProjectLead, getTasksByOwner, getTeamMemberDailyUpdates, getBlockedTasks, assessProjectStatus, createProjectTask, updateProjectTask, deleteProjectTask],
            history: history as Message[],
            context: [
                llmResponse.request,
                llmResponse.response,
                { role: 'tool', content: toolResponse },
            ],
            system: systemInstruction,
        });


      return {
        firebaseQuery: toolRequest.name,
        results: responseWithToolResult.text,
      }
    } else {
        return {
            firebaseQuery: 'No query generated',
            results: llmResponse.text,
        }
    }
  }
);
