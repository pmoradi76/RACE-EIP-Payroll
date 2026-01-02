import { FileCheck, Calculator, Users, ClipboardList } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    {
      icon: FileCheck,
      title: "Evidence-cited explanations",
      description: "Every finding references specific contract clauses, award provisions, and timesheet entries"
    },
    {
      icon: Calculator,
      title: "Deterministic entitlement calculator",
      description: "Transparent, auditable calculations based on Australian Fair Work Awards"
    },
    {
      icon: Users,
      title: "Human-in-the-loop for uncertain cases",
      description: "AI flags edge cases for expert review before finalizing decisions"
    },
    {
      icon: ClipboardList,
      title: "Audit logs",
      description: "Complete traceability of every decision, query, and data access event"
    }
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-3">
              <div className="rounded-full bg-primary/5 p-3">
                <badge.icon className="size-6 text-primary" />
              </div>
              <div>
                <h4 className="mb-1">{badge.title}</h4>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
