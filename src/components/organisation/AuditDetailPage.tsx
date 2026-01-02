import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { SeverityBadge } from '../design-system/SeverityBadge';
import { AnomalyScorePill } from '../design-system/AnomalyScorePill';
import { StatusBadge } from '../design-system/StatusBadge';
import { Progress } from '../ui/progress';
import {
  Shield,
  Bell,
  LogOut,
  ArrowLeft,
  Download,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Package,
  FolderOpen,
  FileSpreadsheet,
  Users,
  TrendingUp,
  Clock,
  Calendar,
  Building2,
  MapPin,
  Award,
  FileCheck,
  Zap,
  Send,
  Flag,
  ExternalLink
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface AuditDetailPageProps {
  auditId: string;
  onBack: () => void;
  onLogout: () => void;
}

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  employmentType: string;
  status: 'ok' | 'underpaid' | 'needs-review';
  underpayment: number;
  anomalyScore: number;
  confidence: number;
  hitlRequired: boolean;
  primaryReason: string;
  paidAmount: number;
  entitledAmount: number;
  explanation: string;
  evidence: {
    contract?: string;
    worksheet?: string;
    payslip?: string;
    awardClauses?: string[];
  };
}

interface AgentStep {
  id: string;
  name: string;
  status: 'done' | 'running' | 'failed';
  completedAt: string;
  duration: string;
  errors: number;
  retries: number;
}

interface HITLDecision {
  id: string;
  employeeName: string;
  issueType: string;
  reviewer: string;
  decision: string;
  notes: string;
  decisionDate: string;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  details: string;
}

export function AuditDetailPage({ auditId, onBack, onLogout }: AuditDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'inputs' | 'processing' | 'employees' | 'analytics' | 'hitl' | 'timeline'>('inputs');
  const [expandedAgents, setExpandedAgents] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample audit data based on AUD-2025-004
  const auditData = {
    requestId: 'AUD-2025-004',
    organisation: 'BrightSteps Early Learning',
    state: 'VIC',
    payPeriod: '01–14 Aug 2025',
    submittedDate: '15 Aug 2025',
    status: 'completed',
    employeesChecked: 12,
    underpaidCount: 3,
    needsReviewCount: 2,
    estimatedUnderpayment: 188.00
  };

  // Original request inputs
  const requestInputs = {
    organisationType: 'Childcare',
    organisationName: 'BrightSteps Early Learning',
    state: 'VIC',
    award: 'Children\'s Services Award 2010',
    enterpriseAgreement: 'None uploaded',
    payPeriod: '01–14 Aug 2025',
    humanReviewThreshold: 'Confidence < 0.70',
    auditMode: 'Show all employees',
    zipFile: 'BrightSteps_Aug_Payroll.zip',
    detectedStructure: {
      contracts: 12,
      worksheets: 12,
      payslips: 12
    }
  };

  // Agent execution data
  const agentSteps: AgentStep[] = [
    { id: '1', name: 'Batch Coordinator Agent', status: 'done', completedAt: '15 Aug 2025 10:02', duration: '2m', errors: 0, retries: 0 },
    { id: '2', name: 'Award Agent', status: 'done', completedAt: '15 Aug 2025 10:04', duration: '2m', errors: 0, retries: 0 },
    { id: '3', name: 'Contract Agent', status: 'done', completedAt: '15 Aug 2025 10:07', duration: '3m', errors: 0, retries: 0 },
    { id: '4', name: 'Worksheet Agent', status: 'done', completedAt: '15 Aug 2025 10:10', duration: '3m', errors: 0, retries: 0 },
    { id: '5', name: 'Payslip Agent', status: 'done', completedAt: '15 Aug 2025 10:13', duration: '3m', errors: 0, retries: 0 },
    { id: '6', name: 'Retrieval Agent', status: 'done', completedAt: '15 Aug 2025 10:15', duration: '2m', errors: 0, retries: 0 },
    { id: '7', name: 'Calculation Agent', status: 'done', completedAt: '15 Aug 2025 10:20', duration: '5m', errors: 0, retries: 0 },
    { id: '8', name: 'Underpayment Detection Agent', status: 'done', completedAt: '15 Aug 2025 10:23', duration: '3m', errors: 0, retries: 0 },
    { id: '9', name: 'Explanation Agent', status: 'done', completedAt: '15 Aug 2025 10:26', duration: '3m', errors: 0, retries: 0 },
    { id: '10', name: 'Guardrail Agent', status: 'done', completedAt: '15 Aug 2025 10:28', duration: '2m', errors: 0, retries: 0 }
  ];

  // Employee results
  const employees: Employee[] = [
    {
      id: '1',
      employeeId: 'E-014',
      name: 'Ava Nguyen',
      role: 'Educator',
      employmentType: 'Casual',
      status: 'underpaid',
      underpayment: 72.00,
      anomalyScore: 86,
      confidence: 0.86,
      hitlRequired: false,
      primaryReason: 'Evening hours paid as ordinary',
      paidAmount: 842.50,
      entitledAmount: 914.50,
      explanation: 'Evening hours between 6pm-9pm were paid at ordinary rate instead of evening penalty rate, resulting in underpayment.',
      evidence: {
        contract: 'Contract clause 4.2: Base rate $28.50/hr',
        worksheet: 'Timesheet: Wed 7 Aug 18:00-21:00, Fri 9 Aug 18:30-21:30',
        payslip: 'Payslip line 3: Ordinary hours 29.5 @ $28.50',
        awardClauses: [
          'Award Clause 25.3: Evening penalty 110% after 6pm weekdays',
          'Award Clause 12.2: Casual loading 25% applies to all hours'
        ]
      }
    },
    {
      id: '2',
      employeeId: 'E-003',
      name: 'Noah Patel',
      role: 'Educator',
      employmentType: 'Full-time',
      status: 'ok',
      underpayment: 0,
      anomalyScore: 12,
      confidence: 0.94,
      hitlRequired: false,
      primaryReason: 'All calculations correct',
      paidAmount: 1825.00,
      entitledAmount: 1825.00,
      explanation: 'All hours correctly calculated at standard hourly rate with no penalty rates applicable.',
      evidence: {
        contract: 'Contract clause 3.1: Annual salary $47,450',
        worksheet: 'Timesheet: Standard 76 hours fortnight',
        payslip: 'Payslip: Fortnight salary $1,825.00'
      }
    },
    {
      id: '3',
      employeeId: 'E-007',
      name: 'Mia Chen',
      role: 'Assistant Educator',
      employmentType: 'Part-time',
      status: 'needs-review',
      underpayment: 18.00,
      anomalyScore: 65,
      confidence: 0.55,
      hitlRequired: true,
      primaryReason: 'First aid allowance ambiguity',
      paidAmount: 945.00,
      entitledAmount: 963.00,
      explanation: 'Potential missing first aid allowance - requires human review to verify qualification status.',
      evidence: {
        contract: 'Contract clause 5.1: Part-time 60 hrs/fortnight',
        worksheet: 'Timesheet: 60 hours @ $15.75/hr',
        payslip: 'Payslip: No first aid allowance listed'
      }
    }
  ];

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // HITL decisions
  const hitlDecisions: HITLDecision[] = [
    {
      id: '1',
      employeeName: 'Mia Chen',
      issueType: 'Allowance ambiguity',
      reviewer: 'Jane Davis',
      decision: 'Approved underpayment',
      notes: 'Verified first aid qualification valid - allowance should be paid',
      decisionDate: '18 Aug 2025'
    },
    {
      id: '2',
      employeeName: 'Sofia Rossi',
      issueType: 'Classification unclear',
      reviewer: 'Jane Davis',
      decision: 'Marked correct',
      notes: 'Level 3 classification confirmed via HR records',
      decisionDate: '18 Aug 2025'
    }
  ];

  // Timeline events
  const timelineEvents: TimelineEvent[] = [
    { id: '1', timestamp: '15 Aug 2025 10:00', event: 'Request created', actor: 'Jane Davis', details: 'Bulk audit request submitted' },
    { id: '2', timestamp: '15 Aug 2025 10:01', event: 'Files uploaded', actor: 'System', details: 'BrightSteps_Aug_Payroll.zip (12 employees)' },
    { id: '3', timestamp: '15 Aug 2025 10:02', event: 'Agent pipeline started', actor: 'System', details: '10 agents queued for execution' },
    { id: '4', timestamp: '15 Aug 2025 10:28', event: 'Agent pipeline completed', actor: 'System', details: 'All agents finished successfully' },
    { id: '5', timestamp: '15 Aug 2025 10:29', event: 'Results generated', actor: 'System', details: '3 underpaid, 2 needs review' },
    { id: '6', timestamp: '18 Aug 2025 09:15', event: 'Human review started', actor: 'Jane Davis', details: 'Reviewing 2 flagged cases' },
    { id: '7', timestamp: '18 Aug 2025 09:45', event: 'Human review completed', actor: 'Jane Davis', details: 'All reviews resolved' },
    { id: '8', timestamp: '19 Aug 2025 14:20', event: 'Report exported', actor: 'Jane Davis', details: 'PDF audit report generated' }
  ];

  // Analytics data
  const statusData = [
    { name: 'Correct', value: 7, color: '#22c55e' },
    { name: 'Underpaid', value: 3, color: '#ef4444' },
    { name: 'Needs Review', value: 2, color: '#f59e0b' }
  ];

  const rootCauseData = [
    { name: 'Evening penalty missing', count: 38, color: '#ef4444' },
    { name: 'Weekend penalty missing', count: 24, color: '#f97316' },
    { name: 'Allowances missed', count: 18, color: '#f59e0b' },
    { name: 'Incorrect classification', count: 12, color: '#eab308' },
    { name: 'Other', count: 8, color: '#84cc16' }
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
                <span>Audit Detail</span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
              </Button>
              
              <div className="text-right hidden lg:block">
                <div className="text-sm">Jane Davis</div>
                <div className="text-xs text-muted-foreground">HR Manager</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                JD
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
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2 mb-4">
            <ArrowLeft className="size-4" />
            Back to Audit History
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl">Audit Request Detail</h1>
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="size-3" />
                  {auditData.status === 'completed' && 'Completed'}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4" />
                  Organisation: <span className="text-foreground">{auditData.organisation} (VIC)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="size-4" />
                  Audit Request ID: <span className="text-foreground font-mono">{auditData.requestId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  Pay Period: <span className="text-foreground">{auditData.payPeriod}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  Submitted: <span className="text-foreground">{auditData.submittedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="size-4" />
                <span className="hidden sm:inline">Export Remediation CSV</span>
                <span className="sm:hidden">CSV</span>
              </Button>
              <Button variant="outline" className="gap-2">
                <FileText className="size-4" />
                <span className="hidden sm:inline">Generate Audit Report (PDF)</span>
                <span className="sm:hidden">PDF</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Employees Checked</CardDescription>
              <CardTitle className="text-2xl md:text-3xl">{auditData.employeesChecked}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs md:text-sm text-muted-foreground">Processed</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Underpaid</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-red-600">{auditData.underpaidCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs md:text-sm text-red-600">
                {((auditData.underpaidCount / auditData.employeesChecked) * 100).toFixed(0)}% of total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Needs Review</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-amber-600">{auditData.needsReviewCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs md:text-sm text-amber-600">
                {((auditData.needsReviewCount / auditData.employeesChecked) * 100).toFixed(0)}% of total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Est. Underpayment</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-red-600">
                ${auditData.estimatedUnderpayment.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs md:text-sm text-muted-foreground">Total liability</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-1 mb-6 overflow-x-auto border-b border-border">
          <Button
            variant={activeTab === 'inputs' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('inputs')}
            className="rounded-b-none"
          >
            Original Inputs
          </Button>
          <Button
            variant={activeTab === 'processing' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('processing')}
            className="rounded-b-none"
          >
            Processing & Agents
          </Button>
          <Button
            variant={activeTab === 'employees' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('employees')}
            className="rounded-b-none"
          >
            Employee Results
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('analytics')}
            className="rounded-b-none"
          >
            Analytics & Insights
          </Button>
          <Button
            variant={activeTab === 'hitl' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('hitl')}
            className="rounded-b-none"
          >
            Human Review
          </Button>
          <Button
            variant={activeTab === 'timeline' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('timeline')}
            className="rounded-b-none"
          >
            Audit Timeline
          </Button>
        </div>

        {/* Tab Content: Original Inputs */}
        {activeTab === 'inputs' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organisation & Audit Setup</CardTitle>
                <CardDescription>Configuration used for this audit request</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Organisation Type</div>
                      <div className="font-medium">{requestInputs.organisationType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Organisation Name</div>
                      <div className="font-medium">{requestInputs.organisationName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">State</div>
                      <div className="font-medium">{requestInputs.state}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Award Used</div>
                      <div className="font-medium">{requestInputs.award}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Enterprise Agreement</div>
                      <div className="font-medium">{requestInputs.enterpriseAgreement}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Pay Period</div>
                      <div className="font-medium">{requestInputs.payPeriod}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Human Review Threshold</div>
                      <div className="font-medium">{requestInputs.humanReviewThreshold}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Audit Mode</div>
                      <div className="font-medium">{requestInputs.auditMode}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uploaded Data</CardTitle>
                <CardDescription>Files and structure detected from ZIP upload</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Package className="size-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium mb-1">ZIP File</div>
                    <div className="text-sm text-muted-foreground font-mono">{requestInputs.zipFile}</div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-medium mb-3 flex items-center gap-2">
                    <FolderOpen className="size-4" />
                    Detected Structure
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <FileSpreadsheet className="size-4 text-blue-600" />
                        contracts/
                      </span>
                      <Badge variant="secondary">{requestInputs.detectedStructure.contracts} files</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <FileSpreadsheet className="size-4 text-green-600" />
                        worksheets/
                      </span>
                      <Badge variant="secondary">{requestInputs.detectedStructure.worksheets} files</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <FileSpreadsheet className="size-4 text-purple-600" />
                        payslips/
                      </span>
                      <Badge variant="secondary">{requestInputs.detectedStructure.payslips} files</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Content: Processing & Agents */}
        {activeTab === 'processing' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Agent Pipeline Execution</CardTitle>
                    <CardDescription>10 agents executed sequentially</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedAgents(!expandedAgents)}
                    className="gap-2"
                  >
                    {expandedAgents ? (
                      <>
                        <ChevronUp className="size-4" />
                        Collapse
                      </>
                    ) : (
                      <>
                        <ChevronDown className="size-4" />
                        Expand
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agentSteps.map((agent, index) => (
                    <div
                      key={agent.id}
                      className={`p-4 rounded-lg border ${
                        expandedAgents ? 'bg-white' : 'bg-muted/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="size-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium mb-1">{agent.name}</div>
                            {expandedAgents && (
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div>Completed: {agent.completedAt}</div>
                                <div>Duration: {agent.duration}</div>
                                <div>Errors: {agent.errors} • Retries: {agent.retries}</div>
                              </div>
                            )}
                          </div>
                        </div>
                        <StatusBadge status="done" size="sm" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-green-900">
                    <CheckCircle2 className="size-5" />
                    <span className="font-medium">Pipeline completed successfully</span>
                  </div>
                  <div className="text-sm text-green-800 mt-1">
                    Total execution time: 28 minutes • No errors • No retries required
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Content: Employee Results */}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Employee Results</CardTitle>
                    <CardDescription>
                      Showing {filteredEmployees.length} of {employees.length} employees
                    </CardDescription>
                  </div>
                </div>

                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by employee ID or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>

              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden lg:table-cell">Role</TableHead>
                        <TableHead className="hidden lg:table-cell">Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Underpayment</TableHead>
                        <TableHead className="hidden md:table-cell">Score</TableHead>
                        <TableHead className="hidden xl:table-cell">Confidence</TableHead>
                        <TableHead className="hidden xl:table-cell">HITL</TableHead>
                        <TableHead className="hidden lg:table-cell">Primary Reason</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((employee) => (
                        <TableRow
                          key={employee.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedEmployee(employee)}
                        >
                          <TableCell className="font-mono text-sm">{employee.employeeId}</TableCell>
                          <TableCell>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground lg:hidden">{employee.role}</div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{employee.role}</TableCell>
                          <TableCell className="hidden lg:table-cell">{employee.employmentType}</TableCell>
                          <TableCell>
                            <SeverityBadge severity={employee.status} size="sm" />
                          </TableCell>
                          <TableCell>
                            {employee.underpayment > 0 ? (
                              <span className="text-red-600 font-medium">
                                −${employee.underpayment.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-green-600">$0.00</span>
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <AnomalyScorePill score={employee.anomalyScore} size="sm" showLabel={false} />
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <div className="text-sm">{(employee.confidence * 100).toFixed(0)}%</div>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            {employee.hitlRequired ? (
                              <Badge variant="secondary" className="text-xs">Yes</Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">No</span>
                            )}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell max-w-xs">
                            <div className="text-sm truncate">{employee.primaryReason}</div>
                          </TableCell>
                          <TableCell>
                            <ChevronRight className="size-4 text-muted-foreground" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Content: Analytics & Insights */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                  <CardDescription>Employee payment status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Root Cause Analysis</CardTitle>
                  <CardDescription>Common underpayment patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={rootCauseData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>Analysis summary and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-red-900 mb-1">Evening Penalty Rates</div>
                      <div className="text-sm text-red-800">
                        38% of underpayments stem from evening hours (after 6pm) being paid at ordinary rates instead of the 110% penalty rate.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="size-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-orange-900 mb-1">Weekend Penalties</div>
                      <div className="text-sm text-orange-800">
                        24% of issues relate to missing weekend penalty rates on Saturday and Sunday shifts.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-amber-900 mb-1">Allowances</div>
                      <div className="text-sm text-amber-800">
                        18% of cases involve missing allowances (first aid, qualifications, etc.).
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-blue-900 mb-1">Recommendations</div>
                      <ul className="text-sm text-blue-800 space-y-1 mt-2">
                        <li>• Update payroll system to automatically apply evening penalty rates</li>
                        <li>• Create roster templates that flag penalty rate eligibility</li>
                        <li>• Implement pre-pay validation checks for weekend shifts</li>
                        <li>• Maintain central register of employee qualifications for allowances</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Content: Human Review */}
        {activeTab === 'hitl' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Human-in-the-Loop Decisions</CardTitle>
                <CardDescription>
                  Expert review outcomes for flagged cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hitlDecisions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Issue Type</TableHead>
                          <TableHead className="hidden md:table-cell">Reviewer</TableHead>
                          <TableHead>Decision</TableHead>
                          <TableHead className="hidden lg:table-cell">Notes</TableHead>
                          <TableHead className="hidden xl:table-cell">Decision Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hitlDecisions.map((decision) => (
                          <TableRow key={decision.id}>
                            <TableCell className="font-medium">{decision.employeeName}</TableCell>
                            <TableCell>{decision.issueType}</TableCell>
                            <TableCell className="hidden md:table-cell">{decision.reviewer}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  decision.decision.includes('Approved')
                                    ? 'destructive'
                                    : 'default'
                                }
                              >
                                {decision.decision}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell max-w-xs">
                              <div className="text-sm truncate">{decision.notes}</div>
                            </TableCell>
                            <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                              {decision.decisionDate}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="size-12 mx-auto mb-3 opacity-50" />
                    <div>No human review required for this audit</div>
                    <div className="text-sm">All cases had confidence scores above threshold</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Content: Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Timeline</CardTitle>
                <CardDescription>Chronological history of this audit request</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {timelineEvents.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Clock className="size-5 text-primary" />
                        </div>
                        {index < timelineEvents.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="font-medium mb-1">{event.event}</div>
                        <div className="text-sm text-muted-foreground mb-1">{event.details}</div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{event.timestamp}</span>
                          <span>•</span>
                          <span>{event.actor}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Employee Detail Modal (when clicking on employee row) */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/50">
          <div className="w-full max-w-2xl h-full bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white border-b border-border p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl">{selectedEmployee.name}</h2>
                    <SeverityBadge severity={selectedEmployee.status} size="sm" />
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Employee ID: {selectedEmployee.employeeId}</div>
                    <div>Role: {selectedEmployee.role} ({selectedEmployee.employmentType})</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedEmployee(null)}>
                  <XCircle className="size-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Paid</div>
                      <div className="text-2xl">${selectedEmployee.paidAmount.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Entitled</div>
                      <div className="text-2xl">${selectedEmployee.entitledAmount.toFixed(2)}</div>
                    </div>
                  </div>
                  {selectedEmployee.underpayment > 0 && (
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Underpayment</span>
                        <span className="text-xl text-red-600 font-medium">
                          −${selectedEmployee.underpayment.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Analysis Summary</CardTitle>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      Anomaly Score: <AnomalyScorePill score={selectedEmployee.anomalyScore} size="sm" />
                    </div>
                    <div>
                      Confidence: <span className="font-medium">{(selectedEmployee.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{selectedEmployee.explanation}</p>
                </CardContent>
              </Card>

              {/* Evidence */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Evidence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedEmployee.evidence.contract && (
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <FileText className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium mb-1">Contract</div>
                        <div className="text-sm text-muted-foreground">{selectedEmployee.evidence.contract}</div>
                        <Button variant="link" size="sm" className="h-auto p-0 mt-1">
                          <ExternalLink className="size-3 mr-1" />
                          View document
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedEmployee.evidence.worksheet && (
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <FileText className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium mb-1">Worksheet</div>
                        <div className="text-sm text-muted-foreground">{selectedEmployee.evidence.worksheet}</div>
                        <Button variant="link" size="sm" className="h-auto p-0 mt-1">
                          <ExternalLink className="size-3 mr-1" />
                          View document
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedEmployee.evidence.payslip && (
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <FileText className="size-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium mb-1">Payslip</div>
                        <div className="text-sm text-muted-foreground">{selectedEmployee.evidence.payslip}</div>
                        <Button variant="link" size="sm" className="h-auto p-0 mt-1">
                          <ExternalLink className="size-3 mr-1" />
                          View document
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedEmployee.evidence.awardClauses && selectedEmployee.evidence.awardClauses.length > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <FileText className="size-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium mb-2">Award Clauses</div>
                        <ul className="space-y-1">
                          {selectedEmployee.evidence.awardClauses.map((clause, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              • {clause}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedEmployee.hitlRequired && (
                    <Button className="w-full gap-2" disabled>
                      <Send className="size-4" />
                      Already in Review Queue
                    </Button>
                  )}
                  <Button variant="outline" className="w-full gap-2">
                    <CheckCircle2 className="size-4" />
                    Confirm Underpayment
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Flag className="size-4" />
                    Mark as False Positive
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
