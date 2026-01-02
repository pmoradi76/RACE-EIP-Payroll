import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { StatusBadge } from '../design-system/StatusBadge';
import { 
  Database, 
  Activity, 
  Cpu, 
  Zap, 
  BookOpen, 
  MessageSquare, 
  Shield, 
  Bell, 
  LogOut,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Building2,
  BarChart3,
  Settings,
  FileText,
  Users,
  Server,
  Globe
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

interface AdminDashboardPageProps {
  onLogout: () => void;
  onNavigateToPromptBank?: () => void;
  onNavigateToAwardsLibrary?: () => void;
  onNavigateToModelsRouting?: () => void;
}

export function AdminDashboardPage({ 
  onLogout, 
  onNavigateToPromptBank,
  onNavigateToAwardsLibrary,
  onNavigateToModelsRouting 
}: AdminDashboardPageProps) {
  const [timeRange, setTimeRange] = useState('24h');

  // System KPIs
  const systemKPIs = [
    { label: 'Total Organisations', value: '47', change: '+3', trend: 'up' as const, icon: Building2 },
    { label: 'Total Runs Today', value: '1,234', change: '+18%', trend: 'up' as const, icon: Activity },
    { label: 'Avg Processing Time', value: '2.3s', change: '-0.4s', trend: 'down' as const, icon: Clock },
    { label: 'Failure Rate', value: '0.3%', change: '-0.1%', trend: 'down' as const, icon: AlertTriangle },
    { label: 'HITL Rate', value: '8.2%', change: '+1.2%', trend: 'up' as const, icon: Users },
    { label: 'Cost Estimate (24h)', value: '$847', change: '+$120', trend: 'up' as const, icon: DollarSign },
  ];

  // Model usage by provider
  const modelUsage = [
    { provider: 'OpenAI GPT-4o', requests: 8942, cost: 542.80, percentage: 72 },
    { provider: 'Anthropic Claude 3.5 Sonnet', requests: 2451, cost: 198.40, percentage: 20 },
    { provider: 'AWS Bedrock (Claude)', requests: 987, cost: 106.10, percentage: 8 },
  ];

  // Live Agent Health
  const agentHealth = [
    { name: 'Award Agent', status: 'done' as const, latency: '180ms', errorCount: 2, requests: 3421, uptime: 99.94 },
    { name: 'Contract Agent', status: 'done' as const, latency: '245ms', errorCount: 5, requests: 3421, uptime: 99.85 },
    { name: 'Worksheet Agent', status: 'done' as const, latency: '210ms', errorCount: 1, requests: 3421, uptime: 99.97 },
    { name: 'Payslip Agent', status: 'done' as const, latency: '195ms', errorCount: 3, requests: 3421, uptime: 99.91 },
    { name: 'Calculation Agent', status: 'done' as const, latency: '120ms', errorCount: 0, requests: 3421, uptime: 100.0 },
    { name: 'Explanation Agent', status: 'running' as const, latency: '890ms', errorCount: 8, requests: 2847, uptime: 99.72 },
    { name: 'Evidence Agent', status: 'done' as const, latency: '340ms', errorCount: 4, requests: 3154, uptime: 99.87 },
    { name: 'Validation Agent', status: 'done' as const, latency: '150ms', errorCount: 1, requests: 3421, uptime: 99.97 },
    { name: 'Guardrail Agent', status: 'done' as const, latency: '95ms', errorCount: 0, requests: 3421, uptime: 100.0 },
    { name: 'Orchestrator Agent', status: 'done' as const, latency: '45ms', errorCount: 2, requests: 3421, uptime: 99.94 },
  ];

  // Queue Status
  const queueStatus = [
    { queue: 'Audit Requests', pending: 12, processing: 3, avgWait: '45s' },
    { queue: 'Document Processing', pending: 28, processing: 8, avgWait: '1.2m' },
    { queue: 'HITL Review', pending: 47, processing: 2, avgWait: '8.5m' },
    { queue: 'Export Jobs', pending: 5, processing: 1, avgWait: '20s' },
  ];

  // Recent Incidents
  const recentIncidents = [
    { 
      id: 'INC-2025-042', 
      severity: 'warning' as const, 
      message: 'Explanation Agent high latency (>800ms)', 
      time: '12 mins ago',
      status: 'investigating' 
    },
    { 
      id: 'INC-2025-041', 
      severity: 'resolved' as const, 
      message: 'OpenAI rate limit reached temporarily', 
      time: '2 hours ago',
      status: 'resolved' 
    },
    { 
      id: 'INC-2025-040', 
      severity: 'resolved' as const, 
      message: 'Database connection pool exhausted', 
      time: '5 hours ago',
      status: 'resolved' 
    },
  ];

  // Tenant List
  const tenants = [
    { 
      id: '1', 
      name: 'BrightSteps Early Learning', 
      sector: 'Childcare', 
      state: 'VIC',
      awardPack: 'Children\'s Services Award', 
      lastAudit: '15 Aug 2025',
      employeeCount: 47,
      status: 'active' as const
    },
    { 
      id: '2', 
      name: 'Metro Retail Group', 
      sector: 'Retail', 
      state: 'NSW',
      awardPack: 'Retail Award', 
      lastAudit: '14 Aug 2025',
      employeeCount: 234,
      status: 'active' as const
    },
    { 
      id: '3', 
      name: 'Sunshine Coast Hospitality', 
      sector: 'Hospitality', 
      state: 'QLD',
      awardPack: 'Hospitality Award', 
      lastAudit: '10 Aug 2025',
      employeeCount: 156,
      status: 'active' as const
    },
    { 
      id: '4', 
      name: 'Allied Healthcare Services', 
      sector: 'Healthcare', 
      state: 'VIC',
      awardPack: 'Healthcare Award', 
      lastAudit: '08 Aug 2025',
      employeeCount: 89,
      status: 'active' as const
    },
    { 
      id: '5', 
      name: 'Melbourne Education Centre', 
      sector: 'Education', 
      state: 'VIC',
      awardPack: 'Educational Services Award', 
      lastAudit: '12 Aug 2025',
      employeeCount: 112,
      status: 'active' as const
    },
  ];

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
                <span>System Administration</span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
                <span className="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  2
                </span>
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
        {/* Page Header with Navigation */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl mb-2">System Dashboard</h1>
          <p className="text-muted-foreground mb-4">
            Monitor infrastructure, agents, and tenant activity
          </p>

          {/* Quick Navigation */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={onNavigateToPromptBank}>
              <MessageSquare className="size-4" />
              Prompt Bank
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={onNavigateToAwardsLibrary}>
              <BookOpen className="size-4" />
              Awards Library
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={onNavigateToModelsRouting}>
              <Server className="size-4" />
              Models & Routing
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <BarChart3 className="size-4" />
              Monitoring
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="size-4" />
              Audit Logs
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="size-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* System KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {systemKPIs.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs flex items-center gap-2">
                    <Icon className="size-3" />
                    {kpi.label}
                  </CardDescription>
                  <CardTitle className="text-2xl">{kpi.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-xs flex items-center gap-1 ${
                    kpi.trend === 'up' 
                      ? kpi.label.includes('Failure') || kpi.label.includes('Cost') ? 'text-red-600' : 'text-green-600'
                      : 'text-green-600'
                  }`}>
                    {kpi.trend === 'up' ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    <span>{kpi.change}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Model Usage by Provider */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Model Usage by Provider (Last 24h)</CardTitle>
            <CardDescription>Request volume and costs across LLM providers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {modelUsage.map((model, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="font-medium">{model.provider}</span>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span>{model.requests.toLocaleString()} requests</span>
                    <span className="font-medium text-foreground">${model.cost.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={model.percentage} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground w-10 text-right">{model.percentage}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Queue Status */}
          <Card>
            <CardHeader>
              <CardTitle>Queue Status</CardTitle>
              <CardDescription>Pending jobs across processing queues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {queueStatus.map((queue, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">{queue.queue}</div>
                      <div className="text-xs text-muted-foreground">
                        Avg wait: {queue.avgWait}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-amber-600 font-medium">{queue.pending}</div>
                        <div className="text-xs text-muted-foreground">Pending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-600 font-medium">{queue.processing}</div>
                        <div className="text-xs text-muted-foreground">Processing</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Incidents */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>System alerts and issue tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      incident.severity === 'warning' ? 'bg-amber-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-muted-foreground">{incident.id}</span>
                        <Badge variant={incident.status === 'resolved' ? 'default' : 'secondary'} className="text-xs">
                          {incident.status}
                        </Badge>
                      </div>
                      <div className="text-sm mb-1">{incident.message}</div>
                      <div className="text-xs text-muted-foreground">{incident.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Agent Health */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Live Agent Health</CardTitle>
            <CardDescription>Real-time performance metrics for all 10 agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Error Count (24h)</TableHead>
                    <TableHead className="hidden lg:table-cell">Requests (24h)</TableHead>
                    <TableHead className="hidden xl:table-cell">Uptime %</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agentHealth.map((agent, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>
                        <StatusBadge status={agent.status} size="sm" />
                      </TableCell>
                      <TableCell>
                        <span className={agent.latency.includes('890') ? 'text-amber-600' : 'text-muted-foreground'}>
                          {agent.latency}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={agent.errorCount > 5 ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                          {agent.errorCount}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {agent.requests.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="flex items-center gap-2">
                          <span className={agent.uptime === 100 ? 'text-green-600' : 'text-muted-foreground'}>
                            {agent.uptime.toFixed(2)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          Monitor
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Tenant List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Tenant Organisations</CardTitle>
                <CardDescription>Active organisations using PayGuard</CardDescription>
              </div>
              <Button className="gap-2">
                <Building2 className="size-4" />
                Add Organisation
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead className="hidden md:table-cell">State</TableHead>
                    <TableHead>Award Pack</TableHead>
                    <TableHead className="hidden lg:table-cell">Employees</TableHead>
                    <TableHead className="hidden xl:table-cell">Last Audit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {tenant.sector}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {tenant.state}
                      </TableCell>
                      <TableCell className="text-sm">{tenant.awardPack}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {tenant.employeeCount}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                        {tenant.lastAudit}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-600 text-xs">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
