"use client"
import { useEffect, useState, useTransition } from "react";
import { getMemberTasks, getProjectLead } from "@/lib/firebase";
import { TaskTable } from "@/components/task-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Task, TeamMember } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";


export default function MemberDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lead, setLead] = useState<TeamMember | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, startTransition] = useTransition();
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    const memberTasks = await getMemberTasks("Adhirath"); // Hardcoded for demo
    const projectLead = await getProjectLead();
    setTasks(memberTasks);
    setLead(projectLead);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = () => {
    startTransition(() => {
        // Mock submission
        setTimeout(() => {
            toast({
                title: "Update Submitted",
                description: "Your daily focus and completion status have been logged.",
            });
        }, 1000);
    });
  }
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                 <Skeleton className="h-64 w-full" />
                 <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Daily Update</CardTitle>
                <CardDescription>Log your focus for today and completion status for yesterday.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <Label htmlFor="daily-focus">Today's Focus</Label>
                    <Textarea id="daily-focus" placeholder="What are your main goals for today?" />
                 </div>
                 <div>
                    <Label htmlFor="completion-status">Yesterday's Completion Status</Label>
                    <Textarea id="completion-status" placeholder="What did you accomplish yesterday? Any blockers?" />
                 </div>
                 <Button onClick={handleUpdate} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Update
                 </Button>
            </CardContent>
        </Card>
        <TaskTable tasks={tasks} title="My Assigned Tasks" onTaskUpdated={fetchData} />
      </div>
      <div className="space-y-6">
        {lead && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Project Lead</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{lead.name}</h3>
                <p className="text-sm text-muted-foreground">{lead.role}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
