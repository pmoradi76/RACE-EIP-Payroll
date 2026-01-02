import { Upload, MessageSquareText, TrendingUp, UserCheck, FileDown, MessageCircle } from 'lucide-react';

export function KeyFeatures() {
  const features = [
    {
      icon: Upload,
      title: "Multi-format Ingestion",
      description: "Upload contracts, timesheets, and payslips in PDF, images (JPG/PNG), or Excel format. OCR and intelligent parsing extract structured data automatically."
    },
    {
      icon: MessageSquareText,
      title: "Explainable Compliance Reasoning",
      description: "Every decision includes citations to specific contract clauses, award provisions, and timesheet entries. No black-box AI."
    },
    {
      icon: TrendingUp,
      title: "Underpayment Anomaly Scoring",
      description: "ML-powered scoring identifies high-risk cases. Prioritize reviews by severity and confidence level."
    },
    {
      icon: UserCheck,
      title: "Human-in-the-Loop Review Queue",
      description: "AI flags uncertain cases for expert validation. Approve, reject, or modify findings before finalizing reports."
    },
    {
      icon: FileDown,
      title: "Reports & Exports",
      description: "Download CSV summaries, PDF evidence packs with highlighted documents, and audit-ready compliance reports."
    },
    {
      icon: MessageCircle,
      title: "Award Q&A Chatbot (RAG)",
      description: "Ask questions about Modern Awards. Get accurate answers with references to specific clauses using retrieval-augmented generation."
    }
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-3">Key Features</h2>
          <p className="text-muted-foreground">Enterprise-grade capabilities for payroll compliance</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="rounded-lg bg-primary/5 p-3 w-fit mb-4">
                <feature.icon className="size-6 text-primary" />
              </div>
              <h3 className="mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
