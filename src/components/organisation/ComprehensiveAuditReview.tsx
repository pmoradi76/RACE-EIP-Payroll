import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { SeverityBadge } from '../design-system/SeverityBadge';
import { AnomalyScorePill } from '../design-system/AnomalyScorePill';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
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
  ExternalLink,
  Send,
  Flag,
  Eye,
  MessageSquare,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  MapPin
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  employmentType: 'Full-time' | 'Part-time' | 'Casual';
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

interface ComprehensiveAuditReviewProps {
  auditId: string;
  onBackToHistory: () => void;
  onViewReviewQueue: () => void;
  onLogout: () => void;
}

export function ComprehensiveAuditReview({ auditId, onBackToHistory, onViewReviewQueue, onLogout }: ComprehensiveAuditReviewProps) {
  const [activeTab, setActiveTab] = useState('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const allEmployees: Employee[] = [
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
      explanation: 'Analysis shows that 6 hours worked between 6pm-9pm on weekdays were paid at the ordinary rate ($28.50/hr) instead of the evening penalty rate ($31.35/hr). This results in an underpayment of $72.00 for the pay period.',
      evidence: {
        contract: 'Contract clause 4.2: Base rate $28.50/hr',
        worksheet: 'Timesheet rows: Wed 7 Aug 18:00-21:00, Fri 9 Aug 18:30-21:30',
        payslip: 'Payslip line 3: Ordinary hours 29.5 @ $28.50',
        awardClauses: [
          'Award Clause 25.3: Evening penalty 110% after 6pm weekdays',
          'Award Clause 12.2: Casual loading 25% applies to all hours'
        ]
      }
    },
    {
      id: '2',
      employeeId: 'E-020',
      name: 'Noah Patel',
      role: 'Room Leader',
      employmentType: 'Full-time',
      status: 'ok',
      underpayment: 0,
      anomalyScore: 12,
      confidence: 0.78,
      hitlRequired: false,
      primaryReason: 'All payments correct',
      paidAmount: 1845.20,
      entitledAmount: 1845.20,
      explanation: 'All hours worked were correctly classified and paid according to the Children\'s Services Award. No discrepancies detected.',
      evidence: {
        contract: 'Contract clause 3.1: Annual salary $96,000',
        worksheet: 'Timesheet: 38 ordinary hours',
        payslip: 'Payslip: Fortnightly pay $1,845.20'
      }
    },
    {
      id: '3',
      employeeId: 'E-033',
      name: 'Mia Chen',
      role: 'Educator',
      employmentType: 'Part-time',
      status: 'needs-review',
      underpayment: 18.00,
      anomalyScore: 54,
      confidence: 0.55,
      hitlRequired: true,
      primaryReason: 'Allowance ambiguity',
      paidAmount: 672.00,
      entitledAmount: 690.00,
      explanation: 'The meal allowance clause in the enterprise agreement is unclear regarding part-time employees working split shifts. Award interpretation required to determine if $18 meal allowance should apply.',
      evidence: {
        contract: 'Enterprise agreement clause 7.4: Meal allowance conditions (ambiguous wording)',
        worksheet: 'Timesheet: 2 split shifts (8am-12pm, 3pm-6pm)',
        payslip: 'Payslip: No meal allowance paid',
        awardClauses: ['Award Clause 19.4: Split shift allowance $18.50']
      }
    },
    {
      id: '4',
      employeeId: 'E-041',
      name: 'Liam O\'Connor',
      role: 'Educator',
      employmentType: 'Casual',
      status: 'underpaid',
      underpayment: 44.00,
      anomalyScore: 81,
      confidence: 0.82,
      hitlRequired: false,
      primaryReason: 'Missed Saturday penalty',
      paidAmount: 456.00,
      entitledAmount: 500.00,
      explanation: '4 hours worked on Saturday 10 Aug were paid at casual ordinary rate instead of Saturday penalty rate. This results in $44.00 underpayment.',
      evidence: {
        contract: 'Contract clause 4.2: Base rate $28.50/hr',
        worksheet: 'Timesheet: Sat 10 Aug 09:00-13:00 (4 hours)',
        payslip: 'Payslip line 2: Casual ordinary 16 @ $35.63',
        awardClauses: ['Award Clause 26.2: Saturday penalty 150%']
      }
    },
    {
      id: '5',
      employeeId: 'E-052',
      name: 'Sofia Rossi',
      role: 'Admin',
      employmentType: 'Full-time',
      status: 'needs-review',
      underpayment: 0,
      anomalyScore: 49,
      confidence: 0.52,
      hitlRequired: true,
      primaryReason: 'Classification uncertain',
      paidAmount: 1520.00,
      entitledAmount: 1520.00,
      explanation: 'The employee performs mixed duties (administrative + educational support). Award classification level uncertain - could be Level 3 or Level 4.',
      evidence: {
        contract: 'Contract: Position description lists mixed duties',
        worksheet: 'Timesheet: 38 ordinary hours',
        payslip: 'Payslip: Paid at Level 3 rate',
        awardClauses: ['Award Schedule A: Level 3 vs Level 4']
      }
    },
    {
      id: '6',
      employeeId: 'E-028',
      name: 'James Wilson',
      role: 'Lead Educator',
      employmentType: 'Full-time',
      status: 'ok',
      underpayment: 0,
      anomalyScore: 15,
      confidence: 0.82,
      hitlRequired: false,
      primaryReason: 'All payments correct',
      paidAmount: 1920.00,
      entitledAmount: 1920.00,
      explanation: 'All hours and entitlements correctly paid.',
      evidence: {}
    },
    {
      id: '7',
      employeeId: 'E-035',
      name: 'Emily Brown',
      role: 'Assistant Educator',
      employmentType: 'Full-time',
      status: 'ok',
      underpayment: 0,
      anomalyScore: 18,
      confidence: 0.79,
      hitlRequired: false,
      primaryReason: 'All payments correct',
      paidAmount: 1680.00,
      entitledAmount: 1680.00,
      explanation: 'All hours and entitlements correctly paid.',
      evidence: {}
    },
    {
      id: '8',
      employeeId: 'E-042',
      name: 'Oliver Martin',
      role: 'Educator',
      employmentType: 'Casual',
      status: 'underpaid',
      underpayment: 54.00,
      anomalyScore: 79,
      confidence: 0.84,
      hitlRequired: false,
      primaryReason: 'Sunday penalty rate missing',
      paidAmount: 380.00,
      entitledAmount: 434.00,
      explanation: '3 hours worked on Sunday paid without Sunday penalty rate.',
      evidence: {}
    },
    {
      id: '9',
      employeeId: 'E-051',
      name: 'Charlotte Davis',
      role: 'Early Childhood Teacher',
      employmentType: 'Full-time',
      status: 'ok',
      underpayment: 0,
      anomalyScore: 10,
      confidence: 0.88,
      hitlRequired: false,
      primaryReason: 'All payments correct',
      paidAmount: 2100.00,
      entitledAmount: 2100.00,
      explanation: 'All hours and entitlements correctly paid.',
      evidence: {}
    },
    {
      id: '10',
      employeeId: 'E-058',
      name: 'Henry Thompson',
      role: 'Assistant Educator',
      employmentType: 'Full-time',
      status: 'ok',
      underpayment: 0,
      anomalyScore: 14,
      confidence: 0.81,
      hitlRequired: false,
      primaryReason: 'All payments correct',
      paidAmount: 1690.00,
      entitledAmount: 1690.00,
      explanation: 'All hours and entitlements correctly paid.',
      evidence: {}
    },
    {
      id: '11',
      employeeId: 'E-062',
      name: 'Amelia Garcia',
      role: 'Lead Educator',
      employmentType: 'Full-time',
      status: 'ok',
      underpayment: 0,
      anomalyScore: 16,
      confidence: 0.80,
      hitlRequired: false,
      primaryReason: 'All payments correct',
      paidAmount: 1950.00,
      entitledAmount: 1950.00,
      explanation: 'All hours and entitlements correctly paid.',
      evidence: {}
    },
    {
      id: '12',
      employeeId: 'E-067',
      name: 'Lucas Anderson',
      role: 'Educator',
      employmentType: 'Casual',
      status: 'ok',
      underpayment: 0,
      anomalyScore: 22,
      confidence: 0.76,
      hitlRequired: false,
      primaryReason: 'All payments correct',
      paidAmount: 525.00,
      entitledAmount: 525.00,
      explanation: 'All hours and entitlements correctly paid.',
      evidence: {}
    }
  ];

  const filteredEmployees = allEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEmployees = allEmployees.length;
  const correctlyPaidCount = allEmployees.filter(e => e.status === 'ok').length;
  const underpaidCount = allEmployees.filter(e => e.status === 'underpaid').length;
  const needsReviewCount = allEmployees.filter(e => e.status === 'needs-review').length;
  const totalUnderpayment = allEmployees
    .filter(e => e.status === 'underpaid')
    .reduce((sum, e) => sum + e.underpayment, 0);
  const avgConfidence = allEmployees.reduce((sum, e) => sum + e.confidence, 0) / allEmployees.length;

  const rootCauses = [
    { cause: 'Evening/out-of-hours paid as ordinary', percentage: 38, count: 8, color: 'bg-red-500' },
    { cause: 'Weekend penalty missing', percentage: 24, count: 5, color: 'bg-orange-500' },
    { cause: 'Allowance not applied', percentage: 18, count: 4, color: 'bg-amber-500' },
    { cause: 'Overtime threshold misapplied', percentage: 12, count: 3, color: 'bg-yellow-500' },
    { cause: 'Classification mismatch', percentage: 8, count: 2, color: 'bg-lime-500' }
  ];

  const dayOfWeekBreakdown = [
    { day: 'Mon', amount: 12.00, height: 15 },
    { day: 'Tue', amount: 18.50, height: 23 },
    { day: 'Wed', amount: 42.00, height: 53 },
    { day: 'Thu', amount: 26.50, height: 33 },
    { day: 'Fri', amount: 45.00, height: 56 },
    { day: 'Sat', amount: 44.00, height: 55 },
    { day: 'Sun', amount: 54.00, height: 68 }
  ];

  const payCodeBreakdown = [
    { code: 'Evening Penalty', amount: 72.00, cases: 1 },
    { code: 'Saturday Penalty', amount: 44.00, cases: 1 },
    { code: 'Sunday Penalty', amount: 54.00, cases: 1 },
    { code: 'Split Shift Allowance', amount: 18.00, cases: 1 }
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
                <span>Comprehensive Audit Review</span>
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
          <Button variant="ghost" onClick={onBackToHistory} className="gap-2 mb-4">
            <ArrowLeft className="size-4" />
            Back to Audit History
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl">Comprehensive Audit Review</h1>
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="size-3" />
                  Completed
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Audit ID: <span className="text-foreground font-mono">{auditId}</span></div>
                <div>Organisation: <span className="text-foreground">BrightSteps Early Learning (VIC)</span></div>
                <div>Pay Period: <span className="text-foreground">01–14 Aug 2025</span></div>
                <div>Completed: <span className="text-foreground">15 Aug 2025, 10:22 AM</span></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="size-4" />
                <span className="hidden sm:inline">Export Remediation CSV</span>
                <span className="sm:hidden">CSV</span>
              </Button>
              <Button className="gap-2">
                <FileText className="size-4" />
                <span className="hidden sm:inline">Generate Audit Report (PDF)</span>
                <span className="sm:hidden">PDF</span>
              </Button>
            </div>
          </div>

          {/* Alert for urgent items */}
          {needsReviewCount > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-amber-900">
                  {needsReviewCount} {needsReviewCount === 1 ? 'case requires' : 'cases require'} human review
                </div>
                <div className="text-sm text-amber-800 mt-1">
                  Low confidence scores detected. Expert review recommended before final determination.
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onViewReviewQueue}>
                Review Now
              </Button>
            </div>
          )}
        </div>

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 md:gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Employees Checked</CardDescription>
              <CardTitle className="text-2xl">{totalEmployees}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="size-3" />
                <span>Total</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Correctly Paid</CardDescription>
              <CardTitle className="text-2xl text-green-600">{correctlyPaidCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-green-600">
                {((correctlyPaidCount / totalEmployees) * 100).toFixed(0)}% of total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Underpaid</CardDescription>
              <CardTitle className="text-2xl text-red-600">{underpaidCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-red-600">
                {((underpaidCount / totalEmployees) * 100).toFixed(0)}% of total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Needs Review</CardDescription>
              <CardTitle className="text-2xl text-amber-600">{needsReviewCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-amber-600">Human review</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Total Underpayment</CardDescription>
              <CardTitle className="text-2xl text-red-600">
                ${totalUnderpayment.toFixed(0)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <DollarSign className="size-3" />
                <span>Liability</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Avg Confidence</CardDescription>
              <CardTitle className="text-2xl">{(avgConfidence * 100).toFixed(0)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <BarChart3 className="size-3" />
                <span>Score</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
            <TabsTrigger value="employees">
              All Employees ({totalEmployees})
            </TabsTrigger>
            <TabsTrigger value="analytics">
              Analytics & Insights
            </TabsTrigger>
            <TabsTrigger value="review">
              Human Review ({needsReviewCount})
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: All Employees */}
          <TabsContent value="employees" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Employee Results</CardTitle>
                    <CardDescription>
                      Complete breakdown of all {totalEmployees} employees in this audit
                    </CardDescription>
                  </div>

                  {/* Search */}
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by ID or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
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
                        <TableHead className="hidden xl:table-cell">Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden md:table-cell">Confidence</TableHead>
                        <TableHead className="hidden lg:table-cell">Anomaly</TableHead>
                        <TableHead className="hidden xl:table-cell">HITL</TableHead>
                        <TableHead className="hidden lg:table-cell">Primary Reason</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((employee) => (
                        <TableRow
                          key={employee.id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-mono text-sm">{employee.employeeId}</TableCell>
                          <TableCell>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground lg:hidden">{employee.role}</div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{employee.role}</TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <Badge variant="outline" className="text-xs">
                              {employee.employmentType}
                            </Badge>
                          </TableCell>
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
                            <div className="text-sm">{(employee.confidence * 100).toFixed(0)}%</div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <AnomalyScorePill score={employee.anomalyScore} size="sm" showLabel={false} />
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
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="gap-1"
                              onClick={() => setSelectedEmployee(employee)}
                            >
                              <Eye className="size-4" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Analytics & Insights */}
          <TabsContent value="analytics" className="mt-6 space-y-6">
            {/* Distribution Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Status Distribution</CardTitle>
                <CardDescription>Breakdown of audit findings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-4xl font-medium text-green-600 mb-2">{correctlyPaidCount}</div>
                    <div className="text-sm text-green-700 mb-1">Correctly Paid</div>
                    <div className="text-xs text-green-600">
                      {((correctlyPaidCount / totalEmployees) * 100).toFixed(0)}% of employees
                    </div>
                  </div>
                  <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-4xl font-medium text-red-600 mb-2">{underpaidCount}</div>
                    <div className="text-sm text-red-700 mb-1">Underpaid</div>
                    <div className="text-xs text-red-600">
                      ${totalUnderpayment.toFixed(2)} total liability
                    </div>
                  </div>
                  <div className="text-center p-6 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="text-4xl font-medium text-amber-600 mb-2">{needsReviewCount}</div>
                    <div className="text-sm text-amber-700 mb-1">Needs Review</div>
                    <div className="text-xs text-amber-600">
                      Low confidence cases
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Root Cause Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Root Cause Breakdown</CardTitle>
                <CardDescription>Most common payroll issues detected</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {rootCauses.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex-1">{item.cause}</span>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span>{item.count} cases</span>
                        <span className="font-medium text-foreground">{item.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Underpayment by Day of Week */}
              <Card>
                <CardHeader>
                  <CardTitle>Underpayment by Day of Week</CardTitle>
                  <CardDescription>When issues occurred</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {dayOfWeekBreakdown.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-xs text-red-600 font-medium min-h-4">
                          {item.amount > 0 ? `$${item.amount.toFixed(0)}` : ''}
                        </div>
                        <div 
                          className={`w-full rounded-t transition-all ${
                            item.amount > 0 ? 'bg-red-500' : 'bg-muted'
                          }`}
                          style={{ height: `${item.height}%` }}
                        />
                        <div className="text-xs text-muted-foreground">{item.day}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Underpayment by Pay Code */}
              <Card>
                <CardHeader>
                  <CardTitle>Underpayment by Pay Code</CardTitle>
                  <CardDescription>Which payment types had issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {payCodeBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{item.code}</div>
                          <div className="text-xs text-muted-foreground">{item.cases} cases</div>
                        </div>
                        <div className="text-right">
                          <div className="text-red-600 font-medium">${item.amount.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Insights Panel */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-blue-600" />
                  High-Risk Patterns & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                      ⚠
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-red-900 mb-1">Most Common Mistake</div>
                      <div className="text-sm text-red-800 mb-2">
                        Evening and weekend penalty rates frequently missed (62% of underpayment cases)
                      </div>
                      <div className="text-sm bg-red-50 p-2 rounded">
                        <strong>Recommendation:</strong> Update payroll system to automatically apply penalty rates based on shift start/end times
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                      📊
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-amber-900 mb-1">High-Risk Pattern Detected</div>
                      <div className="text-sm text-amber-800 mb-2">
                        Casual employees working evening/weekend shifts are 3.2× more likely to be underpaid
                      </div>
                      <div className="text-sm bg-amber-50 p-2 rounded">
                        <strong>Action Required:</strong> Review all casual employee shifts outside ordinary hours (Mon-Fri 7am-6pm)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                      ✓
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-green-900 mb-1">Strength Identified</div>
                      <div className="text-sm text-green-800">
                        Full-time salaried employees show 100% compliance. Standard salary calculations are working correctly.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Human Review Queue */}
          <TabsContent value="review" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Cases Requiring Human Review</CardTitle>
                    <CardDescription>
                      {needsReviewCount} employees with low confidence scores or ambiguous evidence
                    </CardDescription>
                  </div>
                  <Button onClick={onViewReviewQueue} className="gap-2">
                    <MessageSquare className="size-4" />
                    Open Review Workspace
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {needsReviewCount === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="size-12 mx-auto mb-4 text-green-600" />
                    <div className="font-medium mb-2">No cases require review</div>
                    <div className="text-sm">All employees have high confidence determinations</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allEmployees.filter(e => e.hitlRequired).map((employee) => (
                      <div key={employee.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div>
                                <div className="font-medium">{employee.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {employee.employeeId} • {employee.role}
                                </div>
                              </div>
                              <SeverityBadge severity={employee.status} size="sm" />
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Issue:</span>{' '}
                                <span className="font-medium">{employee.primaryReason}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Confidence:</span>{' '}
                                <span className={`font-medium ${
                                  employee.confidence < 0.6 ? 'text-red-600' : 'text-amber-600'
                                }`}>
                                  {(employee.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                              <strong>Why review needed:</strong> {employee.explanation}
                            </div>
                          </div>

                          <Button variant="outline" size="sm" onClick={onViewReviewQueue}>
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Employee Case Detail Drawer */}
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

              {/* Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Analysis</CardTitle>
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
              {(selectedEmployee.evidence.contract || selectedEmployee.evidence.worksheet || 
                selectedEmployee.evidence.payslip || selectedEmployee.evidence.awardClauses) && (
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
                        </div>
                      </div>
                    )}

                    {selectedEmployee.evidence.worksheet && (
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <FileText className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium mb-1">Worksheet</div>
                          <div className="text-sm text-muted-foreground">{selectedEmployee.evidence.worksheet}</div>
                        </div>
                      </div>
                    )}

                    {selectedEmployee.evidence.payslip && (
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <FileText className="size-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium mb-1">Payslip</div>
                          <div className="text-sm text-muted-foreground">{selectedEmployee.evidence.payslip}</div>
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
              )}

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full gap-2">
                    <CheckCircle2 className="size-4" />
                    Confirm {selectedEmployee.status === 'underpaid' ? 'Underpayment' : 'Status'}
                  </Button>
                  {selectedEmployee.hitlRequired && (
                    <Button variant="outline" className="w-full gap-2" onClick={onViewReviewQueue}>
                      <Send className="size-4" />
                      Send to Human Review Queue
                    </Button>
                  )}
                  <Button variant="outline" className="w-full gap-2">
                    <Flag className="size-4" />
                    Mark as {selectedEmployee.status === 'ok' ? 'Incorrect' : 'Correct'}
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <MessageSquare className="size-4" />
                    Add Internal Note
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