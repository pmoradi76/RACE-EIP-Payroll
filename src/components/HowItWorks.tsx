import { FileText, FileCheck, Calendar, DollarSign, Database, Calculator, AlertTriangle, MessageSquare, ShieldCheck, Activity, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';

export function HowItWorks() {
  const agents = [
    { icon: FileCheck, name: "Award Agent", description: "Extracts relevant Fair Work Award provisions", status: "done" },
    { icon: FileText, name: "Contract Agent", description: "Parses employment contract terms", status: "done" },
    { icon: Calendar, name: "Worksheet Agent", description: "Processes timesheets & shift records", status: "running" },
    { icon: DollarSign, name: "Payslip Agent", description: "Extracts payment line items", status: "running" },
    { icon: Database, name: "Retrieval Agent (RAG)", description: "Finds relevant award clauses", status: "done" },
    { icon: Calculator, name: "Calculator Agent", description: "Computes entitlements deterministically", status: "running" },
    { icon: AlertTriangle, name: "Underpayment Detector", description: "Flags discrepancies", status: "pending" },
    { icon: MessageSquare, name: "Explanation Agent", description: "Generates evidence-cited reasons", status: "pending" },
    { icon: ShieldCheck, name: "Guardrail Agent", description: "Validates outputs for hallucinations", status: "pending" },
    { icon: Activity, name: "Monitoring Agent", description: "Logs all agent actions", status: "done" }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'done':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="size-3 mr-1" /> Done</Badge>;
      case 'running':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Loader2 className="size-3 mr-1 animate-spin" /> Running</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><AlertCircle className="size-3 mr-1" /> Needs review</Badge>;
      default:
        return null;
    }
  };

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-3">How it works: Agentic AI Pipeline</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our multi-agent system orchestrates specialized AI agents to analyze your payroll data with transparency and precision
          </p>
        </div>

        <div className="relative">
          {/* Horizontal timeline connector */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-border" style={{marginLeft: '2%', marginRight: '2%'}} />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {agents.map((agent, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="rounded-lg bg-primary/5 p-3 w-fit mb-4 relative z-10">
                    <agent.icon className="size-6 text-primary" />
                  </div>
                  <h4 className="mb-2">{agent.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{agent.description}</p>
                  <div className="mt-auto">
                    {getStatusBadge(agent.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
