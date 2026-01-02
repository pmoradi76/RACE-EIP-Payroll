import { AppShell } from '../layouts/AppShell';
import { Settings, BookOpen, MessageSquare, Database, Activity, Users, Key, FileCode } from 'lucide-react';
import { SidebarSection } from '../design-system/Sidebar';
import { ReactNode } from 'react';
import { Button } from '../ui/button';

interface AdminDashboardShellProps {
  children: ReactNode;
  topBarTitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const adminSidebarSections: SidebarSection[] = [
  {
    title: 'Configuration',
    items: [
      { id: 'dashboard', label: 'System Overview', icon: Activity, href: '/admin', active: true },
      { id: 'awards', label: 'Award Library', icon: BookOpen, href: '/admin/awards', badge: '12' },
      { id: 'prompts', label: 'Prompt Bank', icon: MessageSquare, href: '/admin/prompts' },
      { id: 'models', label: 'Model Routing', icon: Database, href: '/admin/models' }
    ]
  },
  {
    title: 'Monitoring',
    items: [
      { id: 'audit-logs', label: 'Audit Logs', icon: FileCode, href: '/admin/audit-logs' },
      { id: 'performance', label: 'Performance', icon: Activity, href: '/admin/performance' }
    ]
  },
  {
    title: 'Access',
    items: [
      { id: 'users', label: 'User Management', icon: Users, href: '/admin/users', badge: '156' },
      { id: 'api-keys', label: 'API Keys', icon: Key, href: '/admin/api-keys' }
    ]
  },
  {
    title: 'System',
    items: [
      { id: 'settings', label: 'System Settings', icon: Settings, href: '/admin/settings' }
    ]
  }
];

const adminSidebarFooter = (
  <div className="space-y-2">
    <div className="text-xs text-muted-foreground">Logged in as</div>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm">
        MS
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate">Mark Smith</div>
        <div className="text-xs text-muted-foreground truncate">System Admin</div>
      </div>
    </div>
  </div>
);

export function AdminDashboardShell({ 
  children, 
  topBarTitle = 'System Administration',
  breadcrumbs 
}: AdminDashboardShellProps) {
  const topBarActions = (
    <>
      <Button size="sm" variant="outline">View Logs</Button>
      <Button size="sm">Add Award</Button>
    </>
  );

  return (
    <AppShell
      sidebarSections={adminSidebarSections}
      topBarTitle={topBarTitle}
      topBarIcon={Settings}
      topBarActions={topBarActions}
      breadcrumbs={breadcrumbs}
      sidebarFooter={adminSidebarFooter}
    >
      {children}
    </AppShell>
  );
}
