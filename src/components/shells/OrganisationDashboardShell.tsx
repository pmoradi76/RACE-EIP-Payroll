import { AppShell } from '../layouts/AppShell';
import { LayoutDashboard, Users, Upload, FileText, AlertTriangle, BarChart3, Download, Settings } from 'lucide-react';
import { SidebarSection } from '../design-system/Sidebar';
import { ReactNode } from 'react';
import { Button } from '../ui/button';

interface OrganisationDashboardShellProps {
  children: ReactNode;
  topBarTitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const organisationSidebarSections: SidebarSection[] = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/organisation', active: true },
      { id: 'employees', label: 'Employees', icon: Users, href: '/organisation/employees', badge: '143' }
    ]
  },
  {
    title: 'Audits',
    items: [
      { id: 'bulk-upload', label: 'Bulk Upload', icon: Upload, href: '/organisation/bulk-upload' },
      { id: 'reports', label: 'Audit Reports', icon: FileText, href: '/organisation/reports' },
      { id: 'review-queue', label: 'Review Queue', icon: AlertTriangle, href: '/organisation/review-queue', badge: 8 }
    ]
  },
  {
    title: 'Insights',
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/organisation/analytics' },
      { id: 'exports', label: 'Exports', icon: Download, href: '/organisation/exports' }
    ]
  },
  {
    title: 'System',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings, href: '/organisation/settings' }
    ]
  }
];

const organisationSidebarFooter = (
  <div className="space-y-2">
    <div className="text-xs text-muted-foreground">Logged in as</div>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm">
        JD
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate">Jane Davis</div>
        <div className="text-xs text-muted-foreground truncate">HR Manager</div>
      </div>
    </div>
  </div>
);

export function OrganisationDashboardShell({ 
  children, 
  topBarTitle = 'Organisation Dashboard',
  breadcrumbs 
}: OrganisationDashboardShellProps) {
  const topBarActions = (
    <>
      <Button size="sm" variant="outline">Export Report</Button>
      <Button size="sm">New Audit</Button>
    </>
  );

  return (
    <AppShell
      sidebarSections={organisationSidebarSections}
      topBarTitle={topBarTitle}
      topBarIcon={LayoutDashboard}
      topBarActions={topBarActions}
      breadcrumbs={breadcrumbs}
      sidebarFooter={organisationSidebarFooter}
    >
      {children}
    </AppShell>
  );
}
