import { useEffect, useState } from 'react';
import { StatusBadge } from '../../design-system/StatusBadge';
import { Progress } from '../../ui/progress';
import { Info } from 'lucide-react';
import { WizardData } from '../PayCheckWizard';

interface RunAgenticCheckStepProps {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
}

interface Agent {
  name: string;
  description: string;
  status: 'done' | 'running' | 'pending' | 'failed';
  progress: number;
}

export function RunAgenticCheckStep({ data, onNext }: RunAgenticCheckStepProps) {
  const [agents, setAgents] = useState<Agent[]>([
    { name: 'Award Agent', description: 'Identifying applicable Modern Award', status: 'done', progress: 100 },
    { name: 'Contract Agent', description: 'Parsing employment contract', status: 'done', progress: 100 },
    { name: 'Worksheet Agent', description: 'Extracting shift data', status: 'done', progress: 100 },
    { name: 'Payslip Agent', description: 'Reading payment information', status: 'done', progress: 100 },
    { name: 'Retrieval Agent', description: 'Fetching Award facts and clauses', status: 'done', progress: 100 },
    { name: 'Calculator Agent', description: 'Computing entitlements', status: 'running', progress: 45 },
    { name: 'Underpayment Detector', description: 'Comparing paid vs entitled amounts', status: 'pending', progress: 0 },
    { name: 'Explanation Agent', description: 'Generating plain-English summary', status: 'pending', progress: 0 },
    { name: 'Guardrail Agent', description: 'Validating output quality', status: 'pending', progress: 0 }
  ]);

  useEffect(() => {
    // Simulate agent progression
    const interval = setInterval(() => {
      setAgents(prev => {
        const updated = [...prev];
        
        // Find first running or pending agent
        const runningIndex = updated.findIndex(a => a.status === 'running');
        const pendingIndex = updated.findIndex(a => a.status === 'pending');
        
        if (runningIndex !== -1) {
          // Update running agent
          if (updated[runningIndex].progress < 100) {
            updated[runningIndex].progress += 15;
          } else {
            updated[runningIndex].status = 'done';
            // Start next pending agent
            if (pendingIndex !== -1) {
              updated[pendingIndex].status = 'running';
              updated[pendingIndex].progress = 10;
            }
          }
        }
        
        return updated;
      });
    }, 800);

    // Check if all complete
    const checkComplete = setInterval(() => {
      setAgents(current => {
        const allDone = current.every(a => a.status === 'done');
        if (allDone) {
          clearInterval(interval);
          clearInterval(checkComplete);
          // Auto-transition after 1 second
          setTimeout(() => {
            onNext({
              results: {
                status: 'underpaid',
                paid: 540,
                entitled: 612,
                difference: -72,
                anomalyScore: 86,
                confidence: 0.86
              }
            });
          }, 1000);
        }
        return current;
      });
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(checkComplete);
    };
  }, [onNext]);

  const overallProgress = Math.round(
    agents.reduce((sum, agent) => sum + agent.progress, 0) / agents.length
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-lg mb-1">Running Agentic Check</h3>
        <p className="text-sm text-muted-foreground">
          AI agents are analyzing your documents and calculating your entitlements
        </p>
      </div>

      {/* Overall Progress */}
      <div className="border border-border rounded-lg p-5 bg-white">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm">Overall Progress</span>
          <span className="text-sm text-muted-foreground">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      {/* Info Notice */}
      <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          This typically takes 1–2 minutes. The agents work in sequence to ensure accuracy.
          You can safely close this window and we'll email you when complete.
        </div>
      </div>

      {/* Agent Pipeline */}
      <div className="space-y-3">
        {agents.map((agent, index) => (
          <div 
            key={index}
            className="border border-border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-sm">{agent.name}</h4>
                  <StatusBadge status={agent.status} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground">{agent.description}</p>
              </div>
            </div>
            {agent.status === 'running' && (
              <Progress value={agent.progress} className="h-1.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
