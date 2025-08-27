import { getTeamMembers, getDailyUpdates } from '@/lib/firebase';
import type { TeamMember, DailyUpdate } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default async function TeamPage() {
    const members = await getTeamMembers();
    const updates = await getDailyUpdates();
    const today = new Date().toISOString().split('T')[0];

    const membersWithUpdates = members
        .filter(m => m.role === 'Project Member')
        .map(member => {
            const update = updates.find(u => u.memberId === member.id && u.date === today);
            return { ...member, update };
        });

    return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-6">Team Status</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {membersWithUpdates.map(member => (
                    <Card key={member.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle>{member.name}</CardTitle>
                                        <CardDescription>{member.role}</CardDescription>
                                    </div>
                                </div>
                                <Badge variant={member.update ? 'default' : 'destructive'} className={member.update ? 'bg-green-500 hover:bg-green-600' : ''}>
                                    {member.update ? 'Updated' : 'No Update'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <h4 className="text-sm font-semibold">Daily Focus</h4>
                                <p className="text-sm text-muted-foreground">{member.update?.dailyFocus || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold">Completion Status</h4>
                                <p className="text-sm text-muted-foreground">{member.update?.completionStatus || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
