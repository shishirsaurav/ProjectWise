"use client";

import { useEffect, useState } from 'react';
import { TaskTable } from '@/components/task-table';
import { getTasks } from '@/lib/firebase';
import type { Task } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAllTasks = async () => {
        setIsLoading(true);
        const allTasks = await getTasks();
        setTasks(allTasks);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAllTasks();
    }, []);

    if (isLoading) {
        return <Skeleton className="h-[500px] w-full" />;
    }

    return (
        <div>
            <TaskTable
                tasks={tasks}
                title="All Project Tasks"
                isLeadView={true}
                onTaskUpdated={fetchAllTasks}
            />
        </div>
    );
}
