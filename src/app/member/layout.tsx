import { DashboardLayout } from "@/components/dashboard-layout";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
    return <DashboardLayout role="member">{children}</DashboardLayout>;
}
