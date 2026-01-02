import { ReactNode, useState } from 'react';
import { Sidebar, SidebarSection } from '../design-system/Sidebar';
import { TopBar } from '../design-system/TopBar';
import { Breadcrumb, BreadcrumbItem } from '../design-system/Breadcrumb';
import { LucideIcon } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
  sidebarSections: SidebarSection[];
  topBarTitle: string;
  topBarIcon?: LucideIcon;
  topBarActions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  sidebarFooter?: ReactNode;
}

export function AppShell({
  children,
  sidebarSections,
  topBarTitle,
  topBarIcon,
  topBarActions,
  breadcrumbs,
  sidebarFooter
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar sections={sidebarSections} footer={sidebarFooter} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 z-50 lg:hidden">
            <Sidebar sections={sidebarSections} footer={sidebarFooter} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          title={topBarTitle}
          icon={topBarIcon}
          actions={topBarActions}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-6">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="mb-6">
                <Breadcrumb items={breadcrumbs} />
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
