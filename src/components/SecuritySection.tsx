import { Lock, Database, Key, ScrollText, Shield } from 'lucide-react';

export function SecuritySection() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All documents encrypted in transit (TLS 1.3) and at rest (AES-256). Zero-knowledge architecture where possible."
    },
    {
      icon: Database,
      title: "Tenant Isolation",
      description: "Multi-tenant database with strict row-level security. Organisation data is logically and physically separated."
    },
    {
      icon: Key,
      title: "Role-Based Access Control",
      description: "Granular permissions for employees, auditors, HR managers, and system admins. Principle of least privilege enforced."
    },
    {
      icon: ScrollText,
      title: "Comprehensive Audit Logs",
      description: "Immutable logs of every document upload, agent decision, user query, and data access event. GDPR & SOC 2 ready."
    },
    {
      icon: Shield,
      title: "Consent & Privacy First",
      description: "Explicit consent workflows for data processing. Users can download or delete their data at any time. No third-party data sharing."
    }
  ];

  return (
    <section id="security" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-3">Security & Privacy</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade security designed for sensitive payroll data. Your trust is our foundation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {securityFeatures.slice(0, 3).map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-border">
              <div className="rounded-lg bg-green-50 p-3 w-fit mb-4">
                <feature.icon className="size-6 text-green-700" />
              </div>
              <h4 className="mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-6">
          {securityFeatures.slice(3).map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-border">
              <div className="rounded-lg bg-green-50 p-3 w-fit mb-4">
                <feature.icon className="size-6 text-green-700" />
              </div>
              <h4 className="mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200 max-w-3xl mx-auto">
          <p className="text-sm text-amber-900">
            <strong>Important:</strong> PayGuard is a compliance detection tool, not legal advice. Results should be reviewed by qualified employment law professionals before making employment decisions.
          </p>
        </div>
      </div>
    </section>
  );
}
