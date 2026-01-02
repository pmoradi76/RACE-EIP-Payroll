import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Shield, 
  Bell, 
  LogOut, 
  ArrowLeft,
  MessageSquare,
  Play,
  Save,
  Copy,
  Eye,
  BarChart3,
  FileText,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Settings
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

interface PromptBankPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export function PromptBankPage({ onBack, onLogout }: PromptBankPageProps) {
  const [selectedAgent, setSelectedAgent] = useState('award');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const agents = [
    { id: 'award', name: 'Award Agent', color: 'bg-blue-500' },
    { id: 'contract', name: 'Contract Agent', color: 'bg-green-500' },
    { id: 'worksheet', name: 'Worksheet Agent', color: 'bg-purple-500' },
    { id: 'payslip', name: 'Payslip Agent', color: 'bg-orange-500' },
    { id: 'calculation', name: 'Calculation Agent', color: 'bg-cyan-500' },
    { id: 'explanation', name: 'Explanation Agent', color: 'bg-pink-500' },
    { id: 'evidence', name: 'Evidence Agent', color: 'bg-yellow-500' },
    { id: 'validation', name: 'Validation Agent', color: 'bg-red-500' },
    { id: 'guardrail', name: 'Guardrail Agent', color: 'bg-indigo-500' },
    { id: 'orchestrator', name: 'Orchestrator Agent', color: 'bg-teal-500' },
  ];

  const prompts = [
    {
      id: 'award-v3',
      agent: 'award',
      name: 'Award Clause Extraction v3.2',
      version: 'v3.2',
      status: 'active' as const,
      lastUpdated: '15 Aug 2025',
      owner: 'Mark Smith',
      abTest: true,
      notes: 'Improved penalty rate extraction accuracy',
      extractionAccuracy: 97.2,
      citationAccuracy: 98.5,
      hallucinationRate: 0.8,
      falsePositives: 1.2
    },
    {
      id: 'award-v3-1',
      agent: 'award',
      name: 'Award Clause Extraction v3.1',
      version: 'v3.1',
      status: 'draft' as const,
      lastUpdated: '10 Aug 2025',
      owner: 'Sarah Chen',
      abTest: false,
      notes: 'Testing new penalty rate logic',
      extractionAccuracy: 96.8,
      citationAccuracy: 98.2,
      hallucinationRate: 1.1,
      falsePositives: 1.5
    },
    {
      id: 'contract-v2',
      agent: 'contract',
      name: 'Contract Parser v2.4',
      version: 'v2.4',
      status: 'active' as const,
      lastUpdated: '12 Aug 2025',
      owner: 'Mark Smith',
      abTest: false,
      notes: 'Enterprise agreement handling improvements',
      extractionAccuracy: 95.4,
      citationAccuracy: 97.1,
      hallucinationRate: 1.3,
      falsePositives: 2.1
    },
    {
      id: 'explanation-v4',
      agent: 'explanation',
      name: 'Natural Language Explanation v4.0',
      version: 'v4.0',
      status: 'active' as const,
      lastUpdated: '14 Aug 2025',
      owner: 'Alex Johnson',
      abTest: true,
      notes: 'Plain English improvements for employees',
      extractionAccuracy: 94.2,
      citationAccuracy: 96.8,
      hallucinationRate: 2.1,
      falsePositives: 1.8
    },
    {
      id: 'guardrail-v1',
      agent: 'guardrail',
      name: 'Safety Guardrails v1.5',
      version: 'v1.5',
      status: 'active' as const,
      lastUpdated: '13 Aug 2025',
      owner: 'Mark Smith',
      abTest: false,
      notes: 'PII detection and refusal logic',
      extractionAccuracy: 99.1,
      citationAccuracy: 99.8,
      hallucinationRate: 0.2,
      falsePositives: 0.3
    },
  ];

  const filteredPrompts = prompts.filter(p => p.agent === selectedAgent);

  const evaluationDatasets = [
    { id: 'ds-1', name: 'Children\'s Services (200 cases)', cases: 200 },
    { id: 'ds-2', name: 'Retail Award (150 cases)', cases: 150 },
    { id: 'ds-3', name: 'Hospitality Mixed (180 cases)', cases: 180 },
    { id: 'ds-4', name: 'Edge Cases Collection (50 cases)', cases: 50 },
  ];

  const samplePrompt = `You are the Award Agent in PayGuard's agentic AI pipeline for payroll compliance.

**Your Role:**
Extract relevant clauses from Modern Awards that apply to the employee's work conditions.

**Input:**
- Employee contract details (role, employment type, hours)
- Award document (e.g., Children's Services Award MA000120)
- Timesheet data (shift times, dates)

**Task:**
1. Identify applicable Award clauses for:
   - Base classification and pay rate
   - Penalty rates (evening, weekend, public holiday)
   - Allowances (meal, first aid, split shift, etc.)
   - Loading rates (casual, shift penalties)
   - Overtime thresholds

2. Extract exact clause text with citations (clause number, section)

3. Output structured JSON:
{
  "base_rate": { "clause": "...", "citation": "Clause 15.2", "rate": 28.50 },
  "penalties": [
    { "type": "evening", "clause": "...", "citation": "Clause 25.3", "multiplier": 1.10 }
  ],
  "allowances": [...],
  "casual_loading": { ... }
}

**Critical Rules:**
- NEVER hallucinate clause numbers or rates
- ALWAYS cite exact Award section (e.g., "Clause 25.3")
- If ambiguous, flag for HITL review with explanation
- Extract dates and effective ranges for rate changes

**Output Schema Validation:**
Must match AwardExtractionSchema (see safe output preview)`;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
              <div className="flex items-center gap-2">
                <Shield className="size-6 md:size-7 text-primary flex-shrink-0" />
                <span className="text-lg md:text-xl">PayGuard</span>
              </div>
              <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
                <span>/</span>
                <span>Prompt Bank</span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
              </Button>
              
              <div className="text-right hidden lg:block">
                <div className="text-sm">Mark Smith</div>
                <div className="text-xs text-muted-foreground">System Admin</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                MS
              </div>
              <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={onLogout}>
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2 mb-4">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl mb-2">Prompt Bank</h1>
              <p className="text-muted-foreground">
                Manage and evaluate agent instruction templates
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={() => setShowEvaluation(!showEvaluation)}>
                <BarChart3 className="size-4" />
                {showEvaluation ? 'Hide' : 'Show'} Evaluation
              </Button>
              <Button className="gap-2">
                <MessageSquare className="size-4" />
                New Prompt
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Agent Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Select Agent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {agents.map((agent) => {
                  const agentPrompts = prompts.filter(p => p.agent === agent.id);
                  return (
                    <button
                      key={agent.id}
                      onClick={() => {
                        setSelectedAgent(agent.id);
                        setSelectedPrompt(null);
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedAgent === agent.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${agent.color}`} />
                        <span className="font-medium text-sm">{agent.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {agentPrompts.length} {agentPrompts.length === 1 ? 'version' : 'versions'}
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Prompts List */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {agents.find(a => a.id === selectedAgent)?.name} Prompts
                </CardTitle>
                <CardDescription>
                  {filteredPrompts.length} {filteredPrompts.length === 1 ? 'version' : 'versions'} available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">A/B Test</TableHead>
                        <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
                        <TableHead className="hidden xl:table-cell">Owner</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPrompts.map((prompt) => (
                        <TableRow 
                          key={prompt.id}
                          className={selectedPrompt === prompt.id ? 'bg-muted/50' : ''}
                        >
                          <TableCell className="font-medium">{prompt.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-xs">
                              {prompt.version}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={prompt.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {prompt.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {prompt.abTest && (
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                A/B Testing
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                            {prompt.lastUpdated}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                            {prompt.owner}
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setSelectedPrompt(prompt.id)}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Prompt Editor */}
            {selectedPrompt && (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Prompt Editor</CardTitle>
                      <CardDescription>
                        {prompts.find(p => p.id === selectedPrompt)?.name}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Copy className="size-4" />
                        Duplicate
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Eye className="size-4" />
                        Preview
                      </Button>
                      <Button size="sm" className="gap-2">
                        <Save className="size-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Metadata */}
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="space-y-2">
                      <Label>Version</Label>
                      <Input defaultValue={prompts.find(p => p.id === selectedPrompt)?.version} />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select defaultValue={prompts.find(p => p.id === selectedPrompt)?.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="deprecated">Deprecated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Owner</Label>
                      <Input defaultValue={prompts.find(p => p.id === selectedPrompt)?.owner} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Enable A/B Testing</Label>
                        <Switch defaultChecked={prompts.find(p => p.id === selectedPrompt)?.abTest} />
                      </div>
                    </div>
                  </div>

                  {/* Prompt Text */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Prompt Template</Label>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="size-3 text-green-600" />
                        <span>Valid syntax</span>
                      </div>
                    </div>
                    <Textarea 
                      defaultValue={samplePrompt}
                      className="font-mono text-sm min-h-[400px]"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input 
                      defaultValue={prompts.find(p => p.id === selectedPrompt)?.notes}
                      placeholder="Brief description of changes..."
                    />
                  </div>

                  {/* Output Schema Preview */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <Settings className="size-4 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-blue-900">Safe Output Schema</div>
                        <div className="text-xs text-blue-700">
                          Expected JSON structure for this prompt
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        View Schema
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Evaluation Panel */}
            {showEvaluation && (
              <Card className="border-purple-200 bg-purple-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="size-5 text-purple-600" />
                    Batch Evaluation
                  </CardTitle>
                  <CardDescription>
                    Test prompt performance against evaluation datasets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dataset Selection */}
                  <div className="space-y-2">
                    <Label>Select Evaluation Dataset</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose dataset..." />
                      </SelectTrigger>
                      <SelectContent>
                        {evaluationDatasets.map((ds) => (
                          <SelectItem key={ds.id} value={ds.id}>
                            {ds.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full gap-2">
                    <Play className="size-4" />
                    Run Batch Evaluation
                  </Button>

                  {/* Metrics Display */}
                  {selectedPrompt && (
                    <div className="grid md:grid-cols-4 gap-4 pt-4 border-t border-purple-200">
                      <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                        <div className="text-2xl font-medium text-purple-600">
                          {prompts.find(p => p.id === selectedPrompt)?.extractionAccuracy}%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Extraction Accuracy
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                        <div className="text-2xl font-medium text-purple-600">
                          {prompts.find(p => p.id === selectedPrompt)?.citationAccuracy}%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Citation Accuracy
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                        <div className="text-2xl font-medium text-red-600">
                          {prompts.find(p => p.id === selectedPrompt)?.hallucinationRate}%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Hallucination Rate
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                        <div className="text-2xl font-medium text-amber-600">
                          {prompts.find(p => p.id === selectedPrompt)?.falsePositives}%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          False Positives
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
