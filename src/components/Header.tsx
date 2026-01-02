import { Shield } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onSignIn?: () => void;
}

export function Header({ onSignIn }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="size-8 text-primary" />
            <span className="text-xl font-medium">PayGuard</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-6">
            <a href="#product" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Product</a>
            <a href="#how-it-works" className="text-sm text-foreground/80 hover:text-foreground transition-colors">How it works</a>
            <a href="#employees" className="text-sm text-foreground/80 hover:text-foreground transition-colors">For Employees</a>
            <a href="#organisations" className="text-sm text-foreground/80 hover:text-foreground transition-colors">For Organisations</a>
            <a href="#security" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Security</a>
            <a href="#pricing" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Pricing</a>
            <a href="#resources" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Resources</a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onSignIn}>Sign in</Button>
            <Button size="sm">Request Demo</Button>
          </div>
        </nav>
      </div>
    </header>
  );
}