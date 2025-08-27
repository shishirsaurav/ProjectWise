import Link from "next/link";
import { ArrowRight, BrainCircuit, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function RoleSelectionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <Logo />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
          Welcome to ProjectWise
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered copilot for seamless project management. Choose your role to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <BrainCircuit className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="font-headline text-2xl">Project Lead</CardTitle>
                <CardDescription>Oversee projects and guide your team.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Access the main dashboard to view project summaries, assess risks, and manage all tasks and team members.
            </p>
            <Button asChild className="w-full">
              <Link href="/lead/dashboard">
                Go to Lead Dashboard <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 p-3 rounded-full">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <div>
                <CardTitle className="font-headline text-2xl">Project Member</CardTitle>
                <CardDescription>Focus on your tasks and updates.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              View your assigned tasks, update your progress, and collaborate with the team to meet project goals.
            </p>
            <Button asChild variant="secondary" className="w-full bg-accent/90 hover:bg-accent text-accent-foreground">
              <Link href="/member/dashboard">
                Go to Member Dashboard <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <footer className="mt-16 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} ProjectWise. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
