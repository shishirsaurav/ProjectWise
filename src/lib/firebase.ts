import type { Task, TeamMember, DailyUpdate } from './types';

// Mock data based on Book1.xlsx
const tasks: Task[] = [
  { id: "T001", taskName: "Develop a function to classify text content", owner: ["Adhirath", "Prasanna", "Yogeswara"], priority: "High", status: "Completed", startDate: "2025-01-08", dueDate: "2025-06-08", percentComplete: 100, dependsOn: null, blockers: null, nextSteps: "Convert the function into API", notes: null },
  { id: "T002", taskName: "Convert the classification function into an API (Task ID 1)", owner: ["Adhirath", "Prasanna", "Yogeswara"], priority: "High", status: "Completed", startDate: "2025-06-08", dueDate: "2025-07-08", percentComplete: 100, dependsOn: "T001", blockers: null, nextSteps: "Deploy the developed API in Cloud Run", notes: null },
  { id: "T003", taskName: "Deploy the developed API in Cloud Run (Task ID 2)", owner: ["Adhirath", "Prasanna", "Yogeswara"], priority: "High", status: "Completed", startDate: "2025-07-08", dueDate: "2025-08-08", percentComplete: 100, dependsOn: "T002", blockers: null, nextSteps: null, notes: null },
  { id: "T004", taskName: "Write a function to generate quizzes using gemini-2.5-pro, save the quizzes in relevant format in the existing database", owner: ["Aanandhini"], priority: "High", status: "Completed", startDate: "2025-08-08", dueDate: "2025-11-08", percentComplete: 100, dependsOn: null, blockers: null, nextSteps: null, notes: null },
  { id: "T005", taskName: "Convert the quiz generation function into an API", owner: ["Aanandhini"], priority: "High", status: "Completed", startDate: "2025-12-08", dueDate: "2025-08-13", percentComplete: 100, dependsOn: "T004", blockers: null, nextSteps: null, notes: null },
  { id: "T006", taskName: "Deploy and test the API (Task ID 5)", owner: ["Aanandhini"], priority: "High", status: "Completed", startDate: "2025-08-13", dueDate: "2025-08-13", percentComplete: 100, dependsOn: "T005", blockers: null, nextSteps: null, notes: null },
  { id: "T007", taskName: "Optimize the Dockerfile to reduce the image size and decrease time to deploy without missing necessary modules", owner: ["Adhirath"], priority: "High", status: "Completed", startDate: "2025-08-14", dueDate: "2025-08-14", percentComplete: 100, dependsOn: null, blockers: null, nextSteps: null, notes: "Requested access to work" },
  { id: "T008", taskName: "Create a working trigger to activate whenever a document is created in tcs-salsa/(default)/user_posts", owner: ["Adhirath"], priority: "High", status: "On hold", startDate: "2025-08-13", dueDate: null, percentComplete: 50, dependsOn: null, blockers: "Require relevant permissions from Manoj to execute the task", nextSteps: null, notes: null },
  { id: "T009", taskName: "User activity based personalization (share, like, comment, dislike)", owner: ["Adhirath", "Prasanna", "Yogeswara"], priority: "High", status: "On hold", startDate: "2025-11-08", dueDate: null, percentComplete: 0, dependsOn: "T001", blockers: null, nextSteps: null, notes: "Basic approach implementation prioritized" },
  { id: "T010", taskName: "Creation and finalization of frontend design", owner: ["C4L Team"], priority: "High", status: "Terminated", startDate: null, dueDate: null, percentComplete: 0, dependsOn: null, blockers: null, nextSteps: null, notes: "Native changes required" },
  { id: "T011", taskName: "Implement a reward system for quiz to encourage regular user visit", owner: ["Aanandhini"], priority: "Medium", status: "In Progress", startDate: "2025-08-19", dueDate: "2025-08-23", percentComplete: 0, dependsOn: null, blockers: null, nextSteps: null, notes: null },
  { id: "T012", taskName: "Create a logic for push notification to user whenever a new quiz goes live", owner: ["Aanandhini"], priority: "Medium", status: "In Progress", startDate: "2025-08-20", dueDate: "2025-08-25", percentComplete: 0, dependsOn: null, blockers: "Need guidance from Sitanshu on sending push notifications", nextSteps: null, notes: null },
  { id: "T013", taskName: "Developing Web View (Personalied Blogs, replacing My Timeline)", owner: ["Srinath"], priority: "High", status: "Not Started", startDate: null, dueDate: null, percentComplete: 0, dependsOn: null, blockers: null, nextSteps: null, notes: null },
];

const teamMembers: TeamMember[] = [
    { id: 'M001', name: 'Praveen', role: 'Project Lead' },
    { id: 'M002', name: 'Adhirath', role: 'Project Member' },
    { id: 'M003', name: 'Prasanna', role: 'Project Member' },
    { id: 'M004', name: 'Yogeswara', role: 'Project Member' },
    { id: 'M005', name: 'Aanandhini', role: 'Project Member' },
    { id: 'M006', name: 'C4L Team', role: 'Project Member' },
    { id: 'M007', name: 'Srinath', role: 'Project Member' },
];

const dailyUpdates: DailyUpdate[] = [
    { id: 'U001', memberId: 'M002', date: new Date().toISOString().split('T')[0], dailyFocus: 'Working on Dockerfile optimization.', completionStatus: '40% done, facing some issues with build size.' },
    { id: 'U002', memberId: 'M005', date: new Date().toISOString().split('T')[0], dailyFocus: 'Developing quiz generation API.', completionStatus: 'API structure is complete, need to integrate Gemini.' },
];

// Mock Firestore functions
const mockApi = <T>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), 500));

export const getTasks = () => mockApi(tasks);
export const getTeamMembers = () => mockApi(teamMembers);
export const getDailyUpdates = () => mockApi(dailyUpdates);
export const getProjectLead = () => mockApi(teamMembers.find(m => m.role === 'Project Lead'));
export const getMemberTasks = (memberName: string) => mockApi(tasks.filter(t => t.owner?.includes(memberName)));

export const getTeamMemberUpdates = async (): Promise<any[]> => {
    const members = await getTeamMembers();
    const updates = await getDailyUpdates();
    const today = new Date().toISOString().split('T')[0];

    return members.filter(m => m.role === 'Project Member').map(member => {
        const update = updates.find(u => u.memberId === member.id && u.date === today);
        return {
            member: member.name,
            dailyFocus: update?.dailyFocus ?? 'No update provided.',
            completionStatus: update?.completionStatus ?? 'No update provided.',
        };
    });
};

// Mock CRUD operations
export const addTask = async (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: `T${String(tasks.length + 1).padStart(3, '0')}` };
    tasks.push(newTask);
    return mockApi(newTask);
};

export const updateTask = async (taskId: string, updatedData: Partial<Task>) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };
        return mockApi(tasks[taskIndex]);
    }
    return Promise.reject(new Error('Task not found'));
};

export const deleteTask = async (taskId: string) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        return mockApi({ success: true });
    }
    return Promise.reject(new Error('Task not found'));
};
