import { User, Building2, Settings } from 'lucide-react';

export function UseCasesByRole() {
  const useCases = [
    {
      icon: User,
      role: "Employees",
      title: "Verify Your Pay Entitlements",
      features: [
        "Upload contract, worksheet, and payslip (PDF/image)",
        "Get instant 'Paid vs Entitled' comparison",
        "See exact reasons with citations to contract clauses and award provisions",
        "Download evidence pack for your records",
        "Ask questions about your award entitlements via chatbot"
      ],
      cta: "Check My Pay",
      bgColor: "bg-blue-50"
    },
    {
      icon: Building2,
      role: "Organisations/Auditors",
      title: "Bulk Compliance Audits",
      features: [
        "Upload ZIP archive of employee documents",
        "Receive list of underpaid employees with anomaly scores",
        "Export CSV reports and PDF evidence packs",
        "Review flagged cases in human-in-the-loop queue",
        "Track compliance metrics across departments"
      ],
      cta: "Request Demo",
      bgColor: "bg-purple-50"
    },
    {
      icon: Settings,
      role: "System Admins",
      title: "Manage & Monitor",
      features: [
        "Configure award library and update provisions",
        "Manage prompt bank for agent instructions",
        "Set up model routing (GPT-4, Claude, local LLMs)",
        "Monitor agent performance and costs",
        "Access full audit logs and compliance reports"
      ],
      cta: "Admin Portal",
      bgColor: "bg-green-50"
    }
  ];

  return (
    <section id="use-cases" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-3">Use Cases by Role</h2>
          <p className="text-muted-foreground">Tailored workflows for employees, organisations, and administrators</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <div key={index} className={`rounded-xl ${useCase.bgColor} p-8 border border-border`}>
              <div className="rounded-lg bg-white p-3 w-fit mb-4">
                <useCase.icon className="size-6 text-primary" />
              </div>
              
              <div className="text-sm text-muted-foreground mb-2">{useCase.role}</div>
              <h3 className="mb-4">{useCase.title}</h3>
              
              <ul className="space-y-3 mb-6">
                {useCase.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-2 px-4 bg-white border border-border rounded-lg hover:bg-muted/50 transition-colors">
                {useCase.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
