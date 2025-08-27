import { GanttChartSquare } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <GanttChartSquare className="h-8 w-8 text-primary" />
      <span className="text-2xl font-bold font-headline text-primary">
        ProjectWise
      </span>
    </div>
  );
}
