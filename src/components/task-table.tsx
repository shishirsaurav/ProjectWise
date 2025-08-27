"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Edit, PlusCircle, AlertCircle, CheckCircle, Clock } from "lucide-react";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "./task-form";

interface TaskTableProps {
  tasks: Task[];
  title: string;
  isLeadView?: boolean;
  onTaskUpdated: () => void;
}

const statusConfig = {
    "Completed": { icon: CheckCircle, color: "bg-green-500", label: "Completed" },
    "In Progress": { icon: Clock, color: "bg-blue-500", label: "In Progress" },
    "On hold": { icon: AlertCircle, color: "bg-yellow-500", label: "On Hold" },
    "Not Started": { icon: PlusCircle, color: "bg-gray-500", label: "Not Started" },
    "Terminated": { icon: Trash2, color: "bg-red-500", label: "Terminated" },
};

export function TaskTable({ tasks, title, isLeadView = false, onTaskUpdated }: TaskTableProps) {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    onTaskUpdated();
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-headline font-semibold">{title}</h2>
          {isLeadView && (
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </DialogTrigger>
          )}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Task Name</TableHead>
                {isLeadView && <TableHead>Owner</TableHead>}
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>% Complete</TableHead>
                {isLeadView && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => {
                const config = statusConfig[task.status!] || { icon: AlertCircle, color: "bg-gray-400", label: task.status || "N/A" };
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.taskName}</TableCell>
                    {isLeadView && <TableCell>{task.owner?.join(", ") || "Unassigned"}</TableCell>}
                    <TableCell>
                      <Badge
                        variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "secondary" : "outline"}
                        className={cn(task.priority === "Low" && "bg-blue-100 text-blue-800", task.priority === "Medium" && "bg-yellow-100 text-yellow-800", "border-none")}
                      >
                        {task.priority || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <config.icon className={cn("h-4 w-4", config.color.replace('bg-','text-'))} />
                        <span>{config.label}</span>
                      </div>
                    </TableCell>
                    <TableCell>{task.dueDate || "N/A"}</TableCell>
                    <TableCell>{task.percentComplete !== null ? `${task.percentComplete}%` : "N/A"}</TableCell>
                    {isLeadView && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEdit(task)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">{selectedTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        <TaskForm task={selectedTask} onFormSubmit={handleFormClose} />
      </DialogContent>
    </Dialog>
  );
}
