import { DashboardLayout } from "@/components/dashboard-layout";

export default function LeadLayout({ children }: { children: React.ReactNode }) {
    return <DashboardLayout role="lead">{children}</DashboardLayout>;
}
