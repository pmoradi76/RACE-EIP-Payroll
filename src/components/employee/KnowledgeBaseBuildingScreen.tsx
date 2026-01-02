import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { StatusBadge } from '../design-system/StatusBadge';
import { Sparkles, Shield, CheckCircle2 } from 'lucide-react';

interface KnowledgeBaseBuildingScreenProps {
  orgType: string;
  orgName: string;
  onComplete: () => void;
}

interface Agent {
  name: string;
  description: string;
  explanation: string;
  status: 'done' | 'running' | 'pending';
  progress: number;
}

export function KnowledgeBaseBuildingScreen({ orgType, orgName, onComplete }: KnowledgeBaseBuildingScreenProps) {
  const [agents, setAgents] = useState<Agent[]>([
    {
      name: 'Award Indexing Agent',
      description: 'Indexing Children\'s Services Award PDF',
      explanation: 'We are preparing the rules that apply to your workplace.',
      status: 'done',
      progress: 100
    },
    {
      name: 'Chunking Agent',
      description: 'Splitting clauses by topic',
      explanation: 'Breaking down the award into searchable sections.',
      status: 'done',
      progress: 100
    },
    {
      name: 'Embedding Agent',
      description: 'Creating semantic embeddings',
      explanation: 'Making the award searchable using AI.',
      status: 'running',
      progress: 45
    },
    {
      name: 'Guardrail Agent',
      description: 'Enforcing safe and cited outputs',
      explanation: 'Setting up quality and safety checks.',
      status: 'pending',
      progress: 0
    }
  ]);

  const overallProgress = Math.round(
    agents.reduce((sum, agent) => sum + agent.progress, 0) / agents.length
  );

  useEffect(() => {
    // Simulate agent progression
    const interval = setInterval(() => {
      setAgents(prev => {
        const updated = [...prev];
        const runningIndex = updated.findIndex(a => a.status === 'running');
        const pendingIndex = updated.findIndex(a => a.status === 'pending');

        if (runningIndex !== -1) {
          if (updated[runningIndex].progress < 100) {
            updated[runningIndex].progress += 15;
          } else {
            updated[runningIndex].status = 'done';
            if (pendingIndex !== -1) {
              updated[pendingIndex].status = 'running';
              updated[pendingIndex].progress = 10;
            }
          }
        }

        return updated;
      });
    }, 600);

    const checkComplete = setInterval(() => {
      setAgents(current => {
        const allDone = current.every(a => a.status === 'done');
        if (allDone) {
          clearInterval(interval);
          clearInterval(checkComplete);
          setTimeout(() => {
            onComplete();
          }, 1000);
        }
        return current;
      });
    }, 300);

    return () => {
      clearInterval(interval);
      clearInterval(checkComplete);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center animate-pulse">
            <Sparkles className="size-10 text-white" />
          </div>
          <h1 className="text-3xl mb-2">Building your Award Knowledge Base...</h1>
          <p className="text-muted-foreground">
            Setting up personalized AI assistance for {orgName}
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </CardContent>
        </Card>

        {/* Agent Pipeline */}
        <div className="space-y-4">
          {agents.map((agent, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-base">{agent.name}</CardTitle>
                      <StatusBadge status={agent.status} size="sm" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{agent.description}</p>
                    <p className="text-sm text-blue-600 italic">{agent.explanation}</p>
                  </div>
                </div>
              </CardHeader>
              {agent.status === 'running' && (
                <CardContent>
                  <Progress value={agent.progress} className="h-2" />
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-sm">
            <Shield className="size-4 text-primary" />
            <span className="text-muted-foreground">
              Your data is encrypted and only used for this assistant
            </span>
          </div>
        </div>

        {/* Success State */}
        {overallProgress === 100 && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <Card className="max-w-md">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="size-8 text-green-600" />
                </div>
                <h3 className="text-xl mb-2">Knowledge Base Ready!</h3>
                <p className="text-sm text-muted-foreground">
                  You can now ask questions about your workplace rights
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
