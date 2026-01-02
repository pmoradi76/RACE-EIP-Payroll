import { AppShell } from '../layouts/AppShell';
import { Home, Upload, FileText, AlertCircle, MessageCircle, Settings, HelpCircle } from 'lucide-react';
import { SidebarSection } from '../design-system/Sidebar';
import { ReactNode } from 'react';

interface EmployeeDashboardShellProps {
  children: ReactNode;
  topBarTitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const employeeSidebarSections: SidebarSection[] = [
  {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/employee', active: true },
      { id: 'upload', label: 'Check My Pay', icon: Upload, href: '/employee/upload' },
      { id: 'history', label: 'My Reports', icon: FileText, href: '/employee/history' },
      { id: 'issues', label: 'Issues Found', icon: AlertCircle, href: '/employee/issues', badge: 2 }
    ]
  },
  {
    title: 'Support',
    items: [
      { id: 'chatbot', label: 'Ask About Awards', icon: MessageCircle, href: '/employee/chatbot' },
      { id: 'help', label: 'Help & Guides', icon: HelpCircle, href: '/employee/help' },
      { id: 'settings', label: 'Settings', icon: Settings, href: '/employee/settings' }
    ]
  }
];

const employeeSidebarFooter = (
  <div className="space-y-2">
    <div className="text-xs text-muted-foreground">Logged in as</div>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm">
        AN
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate">Ava Nguyen</div>
        <div className="text-xs text-muted-foreground truncate">ava@example.com</div>
      </div>
    </div>
  </div>
);

export function EmployeeDashboardShell({ 
  children, 
  topBarTitle = 'Employee Dashboard',
  breadcrumbs 
}: EmployeeDashboardShellProps) {
  return (
    <AppShell
      sidebarSections={employeeSidebarSections}
      topBarTitle={topBarTitle}
      topBarIcon={Home}
      breadcrumbs={breadcrumbs}
      sidebarFooter={employeeSidebarFooter}
    >
      {children}
    </AppShell>
  );
}
