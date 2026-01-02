import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Shield, 
  Bell, 
  LogOut, 
  ArrowLeft,
  Server,
  DollarSign,
  Zap,
  AlertTriangle,
  Settings,
  TrendingUp,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';

interface ModelsRoutingPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ModelsRoutingPage({ onBack, onLogout }: ModelsRoutingPageProps) {
  const [activeTab, setActiveTab] = useState('agents');
  const [selectedAgent, setSelectedAgent] = useState('award');

  const agents = [
    { id: 'award', name: 'Award Agent', model: 'GPT-4o', temp: 0.1, maxTokens: 4000, cost: 0.042 },
    { id: 'contract', name: 'Contract Agent', model: 'Claude 3.5 Sonnet', temp: 0.2, maxTokens: 4000, cost: 0.038 },
    { id: 'worksheet', name: 'Worksheet Agent', model: 'GPT-4o', temp: 0.1, maxTokens: 2000, cost: 0.021 },
    { id: 'payslip', name: 'Payslip Agent', model: 'GPT-4o', temp: 0.1, maxTokens: 2000, cost: 0.019 },
    { id: 'calculation', name: 'Calculation Agent', model: 'Claude 3.5 Sonnet', temp: 0.0, maxTokens: 3000, cost: 0.028 },
    { id: 'explanation', name: 'Explanation Agent', model: 'GPT-4o', temp: 0.7, maxTokens: 1500, cost: 0.035 },
    { id: 'evidence', name: 'Evidence Agent', model: 'GPT-4o', temp: 0.2, maxTokens: 3000, cost: 0.031 },
    { id: 'validation', name: 'Validation Agent', model: 'Claude 3.5 Sonnet', temp: 0.0, maxTokens: 2000, cost: 0.024 },
    { id: 'guardrail', name: 'Guardrail Agent', model: 'GPT-4o-mini', temp: 0.0, maxTokens: 1000, cost: 0.008 },
    { id: 'orchestrator', name: 'Orchestrator Agent', model: 'GPT-4o', temp: 0.3, maxTokens: 2000, cost: 0.022 },
  ];

  const modelOptions = [
    { id: 'gpt-4o', name: 'OpenAI GPT-4o', provider: 'OpenAI', costPer1k: 0.015, performance: 95 },
    { id: 'gpt-4o-mini', name: 'OpenAI GPT-4o-mini', provider: 'OpenAI', costPer1k: 0.003, performance: 88 },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', costPer1k: 0.012, performance: 96 },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', costPer1k: 0.005, performance: 85 },
    { id: 'bedrock-claude', name: 'AWS Bedrock Claude', provider: 'AWS', costPer1k: 0.014, performance: 94 },
  ];

  const fallbackConfig = [
    { primary: 'OpenAI GPT-4o', fallback: 'Anthropic Claude 3.5 Sonnet', condition: 'Rate limit or timeout' },
    { primary: 'Anthropic Claude 3.5 Sonnet', fallback: 'AWS Bedrock Claude', condition: 'Service unavailable' },
    { primary: 'AWS Bedrock Claude', fallback: 'OpenAI GPT-4o-mini', condition: 'All primary models down' },
  ];

  const guardrailsConfig = [
    { 
      name: 'PII Redaction',
      description: 'Automatically redact personal identifiable information',
      enabled: true,
      patterns: ['Email addresses', 'Phone numbers', 'Tax file numbers', 'Addresses']
    },
    { 
      name: 'Citation Requirement',
      description: 'Enforce citation of Award clauses in all outputs',
      enabled: true,
      patterns: ['Award clause numbers', 'Section references', 'Legal citations']
    },
    { 
      name: 'Refusal Logic',
      description: 'Refuse to answer questions outside payroll compliance scope',
      enabled: true,
      patterns: ['Legal advice', 'Tax advice', 'Immigration questions', 'Medical advice']
    },
    { 
      name: 'Hallucination Prevention',
      description: 'Flag outputs without proper evidence or citations',
      enabled: true,
      patterns: ['Unsupported claims', 'Missing citations', 'Confidence thresholds']
    },
  ];

  const costPerformance = {
    totalCostToday: 847.20,
    avgLatency: 234,
    requestsToday: 12456,
    errorRate: 0.3
  };

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
                <span>Models & Routing</span>
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
              <h1 className="text-2xl md:text-3xl mb-2">Models & Routing</h1>
              <p className="text-muted-foreground">
                Configure LLM models, routing logic, and guardrails for each agent
              </p>
            </div>
          </div>
        </div>

        {/* Cost/Performance Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Total Cost (24h)</CardDescription>
              <CardTitle className="text-2xl">${costPerformance.totalCostToday.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-red-600 flex items-center gap-1">
                <TrendingUp className="size-3" />
                +14% vs yesterday
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Avg Latency</CardDescription>
              <CardTitle className="text-2xl">{costPerformance.avgLatency}ms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-green-600">
                Within SLA target
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Requests (24h)</CardDescription>
              <CardTitle className="text-2xl">{costPerformance.requestsToday.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Across all agents
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Error Rate</CardDescription>
              <CardTitle className="text-2xl">{costPerformance.errorRate}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-green-600">
                Below 1% threshold
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="agents">Agent Models</TabsTrigger>
            <TabsTrigger value="models">Model Library</TabsTrigger>
            <TabsTrigger value="fallback">Fallback Logic</TabsTrigger>
            <TabsTrigger value="guardrails">Guardrails</TabsTrigger>
          </TabsList>

          {/* Tab 1: Agent Models Configuration */}
          <TabsContent value="agents" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Per-Agent Model Configuration</CardTitle>
                <CardDescription>
                  Configure model, temperature, and token limits for each agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead className="hidden lg:table-cell">Temperature</TableHead>
                        <TableHead className="hidden xl:table-cell">Max Tokens</TableHead>
                        <TableHead className="hidden md:table-cell">Cost/Request</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agents.map((agent) => (
                        <TableRow key={agent.id}>
                          <TableCell className="font-medium">{agent.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {agent.model}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground">
                            {agent.temp.toFixed(1)}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-muted-foreground">
                            {agent.maxTokens}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            ${agent.cost.toFixed(3)}
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setSelectedAgent(agent.id)}
                            >
                              Configure
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Agent Configuration Panel */}
            {selectedAgent && (
              <Card>
                <CardHeader>
                  <CardTitle>Configure {agents.find(a => a.id === selectedAgent)?.name}</CardTitle>
                  <CardDescription>
                    Adjust model parameters and tool permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Model Selection */}
                    <div className="space-y-2">
                      <Label>Model Provider</Label>
                      <Select defaultValue="gpt-4o">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {modelOptions.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name} ({model.provider})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Max Tokens */}
                    <div className="space-y-2">
                      <Label>Max Tokens</Label>
                      <Input 
                        type="number" 
                        defaultValue={agents.find(a => a.id === selectedAgent)?.maxTokens}
                      />
                    </div>
                  </div>

                  {/* Temperature Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Temperature</Label>
                      <span className="text-sm text-muted-foreground">
                        {agents.find(a => a.id === selectedAgent)?.temp.toFixed(1)}
                      </span>
                    </div>
                    <Slider 
                      defaultValue={[agents.find(a => a.id === selectedAgent)?.temp ?? 0.1 * 100]}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Deterministic (0.0)</span>
                      <span>Creative (1.0)</span>
                    </div>
                  </div>

                  {/* Tool Permissions */}
                  <div className="space-y-3">
                    <Label>Tool Permissions</Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Server className="size-4 text-muted-foreground" />
                          <span className="text-sm">Award Database Access</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Settings className="size-4 text-muted-foreground" />
                          <span className="text-sm">Calculation Tools</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Eye className="size-4 text-muted-foreground" />
                          <span className="text-sm">Document OCR</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Lock className="size-4 text-muted-foreground" />
                          <span className="text-sm">External API Calls</span>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  {/* Safe Mode Toggle */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="size-5 text-amber-600" />
                        <div>
                          <div className="font-medium text-amber-900">Safe Mode</div>
                          <div className="text-sm text-amber-800">
                            Enforce stricter validation and guardrails
                          </div>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">Save Configuration</Button>
                    <Button variant="outline" onClick={() => setSelectedAgent('')}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab 2: Model Library */}
          <TabsContent value="models" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Models</CardTitle>
                <CardDescription>
                  Compare pricing and performance across LLM providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Model Name</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead className="hidden md:table-cell">Cost per 1K tokens</TableHead>
                        <TableHead className="hidden lg:table-cell">Performance Score</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modelOptions.map((model) => (
                        <TableRow key={model.id}>
                          <TableCell className="font-medium">{model.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {model.provider}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <DollarSign className="size-3" />
                              {model.costPer1k.toFixed(3)}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                <div 
                                  className="bg-green-600 h-full"
                                  style={{ width: `${model.performance}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-12">
                                {model.performance}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default" className="bg-green-600 text-xs">
                              Active
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Fallback Logic */}
          <TabsContent value="fallback" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Fallback Configuration</CardTitle>
                <CardDescription>
                  Define backup models when primary models fail or reach rate limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fallbackConfig.map((config, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="default" className="text-xs">Primary</Badge>
                          <span className="font-medium">{config.primary}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          ↓
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">Fallback</Badge>
                          <span className="font-medium">{config.fallback}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-2">Trigger:</div>
                        <div className="text-sm">{config.condition}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <CheckCircle2 className="size-3" />
                      <span>Active</span>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  + Add Fallback Rule
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Guardrails */}
          <TabsContent value="guardrails" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Guardrails Configuration</CardTitle>
                <CardDescription>
                  Safety controls, PII redaction, and refusal logic
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {guardrailsConfig.map((guardrail, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-medium">{guardrail.name}</div>
                          <Badge 
                            variant={guardrail.enabled ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {guardrail.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {guardrail.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {guardrail.patterns.map((pattern, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {pattern}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Switch defaultChecked={guardrail.enabled} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
