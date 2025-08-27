
'use server';
/**
 * @fileOverview Tools for the AI to interact with project data.
 */

import { ai } from '@/ai/genkit';
import { getTasks, getTeamMembers, getProjectLead, getMemberTasks, getDailyUpdates, updateTask, addTask, deleteTask, getTeamMemberUpdates } from '@/lib/firebase';
import { summarizeProjectStatus } from '../flows/summarize-project-status';
import { z } from 'zod';

export const getProjectTasks = ai.defineTool(
  {
    name: 'getProjectTasks',
    description: 'Get a list of all tasks in the project.',
    outputSchema: z.any(),
  },
  async () => {
    return await getTasks();
  }
);

export const getTasksByOwner = ai.defineTool(
    {
      name: 'getTasksByOwner',
      description: 'Get a list of tasks assigned to a specific team member.',
      inputSchema: z.object({
        ownerName: z.string().describe('The name of the team member.'),
      }),
      outputSchema: z.any(),
    },
    async ({ ownerName }) => {
      return await getMemberTasks(ownerName);
    }
  );

export const getAllTeamMembers = ai.defineTool(
  {
    name: 'getAllTeamMembers',
    description: 'Get a list of all team members.',
    outputSchema: z.any(),
  },
  async () => {
    return await getTeamMembers();
  }
);

export const getTheProjectLead = ai.defineTool(
  {
    name: 'getTheProjectLead',
    description: 'Get the team member who is the project lead.',
    outputSchema: z.any(),
  },
  async () => {
    return await getProjectLead();
  }
);

export const getTeamMemberDailyUpdates = ai.defineTool(
    {
        name: 'getTeamMemberDailyUpdates',
        description: 'Get the daily updates for all team members.',
        outputSchema: z.any(),
    },
    async () => {
        return await getDailyUpdates();
    }
);

export const createProjectTask = ai.defineTool(
    {
        name: 'createProjectTask',
        description: 'Create a new task in the project.',
        inputSchema: z.object({
            taskName: z.string().describe("The name of the new task."),
            owner: z.array(z.string()).optional().describe("A list of owners for the task."),
            priority: z.enum(["High", "Medium", "Low"]).optional().nullable().describe("The priority of the task."),
            status: z.enum(["Completed", "In Progress", "On hold", "Not Started", "Terminated"]).optional().nullable().describe("The status of the task."),
            dueDate: z.string().optional().describe('Date in YYYY-MM-DD format.'),
        }),
        outputSchema: z.any(),
    },
    async (taskData) => {
        const fullTaskData = {
            ...taskData,
            startDate: new Date().toISOString().split('T')[0],
            percentComplete: taskData.status === 'Completed' ? 100 : 0,
            dependsOn: null,
            blockers: null,
            nextSteps: null,
            notes: null,
        };
        return await addTask(fullTaskData);
    }
);

export const updateProjectTask = ai.defineTool(
    {
        name: 'updateProjectTask',
        description: 'Update an existing task in the project.',
        inputSchema: z.object({
            taskId: z.string().describe('The ID of the task to update. For example, T001.'),
            updates: z.object({
                taskName: z.string().optional(),
                owner: z.array(z.string()).optional(),
                priority: z.enum(["High", "Medium", "Low"]).optional().nullable(),
                status: z.enum(["Completed", "In Progress", "On hold", "Not Started", "Terminated"]).optional().nullable(),
                dueDate: z.string().optional().describe('Date in YYYY-MM-DD format.'),
                percentComplete: z.number().min(0).max(100).optional().nullable(),
                notes: z.string().optional(),
                blockers: z.string().optional().nullable(),
                nextSteps: z.string().optional().nullable(),
            }).describe('The fields of the task to update.'),
        }),
        outputSchema: z.any(),
    },
    async ({ taskId, updates }) => {
        return await updateTask(taskId, updates);
    }
);

export const deleteProjectTask = ai.defineTool(
    {
        name: 'deleteProjectTask',
        description: 'Delete a task from the project.',
        inputSchema: z.object({
            taskId: z.string().describe('The ID of the task to delete. For example, T001.'),
        }),
        outputSchema: z.any(),
    },
    async ({ taskId }) => {
        return await deleteTask(taskId);
    }
);

export const getBlockedTasks = ai.defineTool(
    {
        name: 'getBlockedTasks',
        description: 'Get all tasks that have blockers or are blocked.',
        outputSchema: z.any(),
    },
    async () => {
        const allTasks = await getTasks();
        return allTasks.filter(task => task.blockers !== null && task.blockers !== '');
    }
);

export const assessProjectStatus = ai.defineTool(
    {
        name: 'assessProjectStatus',
        description: 'Assess if the project is on track, identify risks, and provide recommendations.',
        outputSchema: z.any(),
    },
    async () => {
        const tasks = await getTasks();
        const teamUpdates = await getTeamMemberUpdates();
        
        const tasksJson = JSON.stringify(tasks);
        const teamUpdatesJson = JSON.stringify(teamUpdates);
        
        return await summarizeProjectStatus({
            tasks: tasksJson,
            teamUpdates: teamUpdatesJson
        });
    }
);
