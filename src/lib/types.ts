export interface Task {
  id: string;
  taskName: string;
  owner: string[] | null;
  priority: 'High' | 'Medium' | 'Low' | null;
  status: 'Completed' | 'In Progress' | 'On hold' | 'Not Started' | 'Terminated' | null;
  startDate: string | null;
  dueDate: string | null;
  percentComplete: number | null;
  dependsOn: string | null;
  blockers: string | null;
  nextSteps: string | null;
  notes: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Project Lead' | 'Project Member';
  dailyUpdate?: DailyUpdate;
}

export interface DailyUpdate {
  id: string;
  memberId: string;
  date: string;
  dailyFocus: string | null;
  completionStatus: string | null;
}
