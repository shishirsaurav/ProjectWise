import Link from "next/link";
import {
  Bell,
  Home,
  LineChart,
  Package2,
  Users,
  MessageSquare,
  BarChart
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: 'lead' | 'member';
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const navItems = role === 'lead' ? [
    { href: "/lead/dashboard", icon: Home, label: "Overview" },
    { href: "/lead/dashboard/tasks", icon: BarChart, label: "Tasks" },
    { href: "/lead/dashboard/team", icon: Users, label: "Team Status" },
    { href: "/lead/dashboard/risks", icon: LineChart, label: "Risk Analysis" },
    { href: "/lead/dashboard/chat", icon: MessageSquare, label: "AI Chat" },
  ] : [
    { href: "/member/dashboard", icon: Home, label: "My Tasks" },
    { href: "/member/dashboard/chat", icon: MessageSquare, label: "AI Chat" },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6 text-primary" />
              <span className="font-headline">ProjectWise</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
             <h1 className="text-lg font-semibold md:text-2xl font-headline capitalize">{role} Dashboard</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
