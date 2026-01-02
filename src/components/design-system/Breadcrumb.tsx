import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export function Breadcrumb({ items, showHome = true }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      {showHome && (
        <>
          <a href="/" className="hover:text-foreground transition-colors">
            <Home className="size-4" />
          </a>
          <ChevronRight className="size-4" />
        </>
      )}
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <a href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </a>
          ) : (
            <span className={index === items.length - 1 ? 'text-foreground' : ''}>
              {item.label}
            </span>
          )}
          {index < items.length - 1 && <ChevronRight className="size-4" />}
        </div>
      ))}
    </nav>
  );
}
