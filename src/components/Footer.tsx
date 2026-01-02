import { Shield, Mail, Linkedin, Twitter, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="size-6 text-primary" />
              <span className="font-medium">PayGuard</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Explainable AI for payroll compliance and underpayment detection.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="size-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="size-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="size-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="size-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">How it works</a></li>
              <li><a href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#security" className="text-sm text-muted-foreground hover:text-primary transition-colors">Security</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Roadmap</a></li>
            </ul>
          </div>

          {/* Use Cases */}
          <div>
            <h4 className="mb-4">Use Cases</h4>
            <ul className="space-y-2">
              <li><a href="#employees" className="text-sm text-muted-foreground hover:text-primary transition-colors">For Employees</a></li>
              <li><a href="#organisations" className="text-sm text-muted-foreground hover:text-primary transition-colors">For Organisations</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">For Auditors</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">For Regulators</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Industries</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Support</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 PayGuard. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center md:text-left">
            ⚖️ <strong>Disclaimer:</strong> PayGuard provides compliance detection tools, not legal advice. Consult qualified employment law professionals before making employment decisions based on these results.
          </p>
        </div>
      </div>
    </footer>
  );
}
