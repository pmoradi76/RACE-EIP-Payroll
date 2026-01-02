import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Shield } from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  active?: boolean;
  badge?: string | number;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
  footer?: ReactNode;
  collapsed?: boolean;
}

export function Sidebar({ sections, footer, collapsed = false }: SidebarProps) {
  return (
    <aside className={`
      bg-white border-r border-border h-screen flex flex-col transition-all duration-300
      ${collapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Logo */}
      <div className="h-16 border-b border-border flex items-center px-4 gap-2 shrink-0">
        <Shield className="size-6 text-primary shrink-0" />
        {!collapsed && <span className="font-medium">PayGuard</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {section.title && !collapsed && (
              <div className="px-4 mb-2 text-xs text-muted-foreground uppercase tracking-wider">
                {section.title}
              </div>
            )}
            <ul className="space-y-1 px-2">
              {section.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href || '#'}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                      ${item.active 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <item.icon className="size-5 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="border-t border-border p-4 shrink-0">
          {footer}
        </div>
      )}
    </aside>
  );
}
