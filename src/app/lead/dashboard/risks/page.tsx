"use client"
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ShieldAlert } from 'lucide-react';
import { getTasks, getTeamMemberUpdates } from '@/lib/firebase';
import { assessProjectRisks, type AssessProjectRisksOutput } from '@/ai/flows/assess-project-risks';

export default function RiskAnalysisPage() {
    const [isPending, startTransition] = useTransition();
    const [riskReport, setRiskReport] = useState<AssessProjectRisksOutput | null>(null);

    const handleRunAssessment = () => {
        startTransition(async () => {
            const tasks = await getTasks();
            const teamUpdates = await getTeamMemberUpdates();
            
            const tasksDataForAI = tasks.reduce((acc, task) => {
                acc[task.id] = {
                  taskName: task.taskName,
                  owner: task.owner,
                  priority: task.priority || '',
                  status: task.status || '',
                  startDate: task.startDate,
                  dueDate: task.dueDate,
                  percentComplete: task.percentComplete,
                  dependsOn: task.dependsOn,
                  blockers: task.blockers,
                  nextSteps: task.nextSteps,
                  notes: task.notes,
                };
                return acc;
              }, {} as any);

            const report = await assessProjectRisks({
                tasks: tasksDataForAI,
                teamMemberUpdates: teamUpdates,
            });
            setRiskReport(report);
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">AI Risk Assessment</CardTitle>
                <CardDescription>Analyze task data and team updates to identify potential risks, delays, and blockers.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-6">
                    <Button onClick={handleRunAssessment} disabled={isPending} size="lg">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Assessing Risks...
                            </>
                        ) : (
                             <>
                                <ShieldAlert className="mr-2 h-4 w-4" />
                                Run Risk Assessment
                            </>
                        )}
                    </Button>
                </div>

                {riskReport && (
                    <div className="mt-6 space-y-6 animate-in fade-in-50 duration-500">
                        <Card>
                            <CardHeader>
                                <CardTitle>Assessment Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{riskReport.summary}</p>
                            </CardContent>
                        </Card>
                        <div className="grid md:grid-cols-2 gap-6">
                             <Card className="border-destructive">
                                <CardHeader>
                                    <CardTitle className="text-destructive">Identified Risks</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                        {riskReport.risks.map((risk, i) => <li key={i}>{risk}</li>)}
                                    </ul>
                                </CardContent>
                            </Card>
                             <Card className="border-green-500">
                                <CardHeader>
                                    <CardTitle className="text-green-600">Recommendations</CardTitle>
                                </CardHeader>
                                <CardContent>
                                     <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                        {riskReport.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
