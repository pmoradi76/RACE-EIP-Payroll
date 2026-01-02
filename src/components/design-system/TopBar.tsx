import { ReactNode } from 'react';
import { LucideIcon, X } from 'lucide-react';
import { Button } from '../ui/button';

interface TopBarProps {
  title: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  showNotifications?: boolean;
  userAvatar?: ReactNode;
  onMenuToggle?: () => void;
}

export function TopBar({ 
  title, 
  icon: Icon, 
  actions, 
  showNotifications = true,
  userAvatar,
  onMenuToggle 
}: TopBarProps) {
  return (
    <div className="h-16 border-b border-border bg-white sticky top-0 z-40 flex items-center px-6 gap-4">
      {/* Mobile menu toggle */}
      <button 
        onClick={onMenuToggle}
        className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
      >
        <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Title */}
      <div className="flex items-center gap-2 flex-1">
        {Icon && <Icon className="size-5 text-primary" />}
        <h2 className="text-lg">{title}</h2>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {actions}
        
        {showNotifications && (
          <Button variant="ghost" size="icon" className="relative">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
        )}

        {userAvatar || (
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
            U
          </div>
        )}
      </div>
    </div>
  );
}
