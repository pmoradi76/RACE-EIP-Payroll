import { ArrowRight, FileText, Cpu, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HeroSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl">
              Check your pay. Prove compliance. Prevent underpayments.
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload your employment contract, timesheets, and payslips. PayGuard's explainable AI agents verify compliance against Fair Work Awards, detect underpayments, and provide evidence-cited explanations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="gap-2">
                I'm an Employee
                <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                I'm an Organisation/Auditor
                <ArrowRight className="size-4" />
              </Button>
            </div>
            
            <div className="pt-2">
              <a href="#admin" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                I'm a System Admin
                <ArrowRight className="size-3" />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-xl overflow-hidden border border-border bg-muted/30 p-8">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1661069387786-0f0245565e22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXlyb2xsJTIwZG9jdW1lbnRzJTIwd29ya2Zsb3d8ZW58MXx8fHwxNzY2NjcxODU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Payroll workflow"
                className="w-full h-64 object-cover rounded-lg"
              />
              
              <div className="mt-6 flex items-center justify-center gap-6">
                <div className="flex flex-col items-center">
                  <FileText className="size-8 text-primary/60 mb-2" />
                  <span className="text-xs text-muted-foreground">Documents</span>
                </div>
                <ArrowRight className="size-6 text-muted-foreground" />
                <div className="flex flex-col items-center">
                  <Cpu className="size-8 text-primary/80 mb-2" />
                  <span className="text-xs text-muted-foreground">AI Agents</span>
                </div>
                <ArrowRight className="size-6 text-muted-foreground" />
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="size-8 text-green-600 mb-2" />
                  <span className="text-xs text-muted-foreground">Results</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
