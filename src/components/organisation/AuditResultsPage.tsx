import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { SeverityBadge } from '../design-system/SeverityBadge';
import { AnomalyScorePill } from '../design-system/AnomalyScorePill';
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
  ExternalLink,
  Send,
  Flag,
  ChevronRight
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  role: string;
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

interface AuditResultsPageProps {
  onBack: () => void;
  onViewHistory: () => void;
  onViewReports: () => void;
  onViewReviewQueue: () => void;
  onLogout: () => void;
}

export function AuditResultsPage({ onBack, onViewHistory, onViewReports, onViewReviewQueue, onLogout }: AuditResultsPageProps) {
  const [showUnderpaidOnly, setShowUnderpaidOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const allEmployees: Employee[] = [
    {
      id: '1',
      employeeId: 'E-014',
      name: 'Ava Nguyen',
      role: 'Educator (Casual)',
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
    }
  ];

  const filteredEmployees = allEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !showUnderpaidOnly || emp.status === 'underpaid';
    return matchesSearch && matchesFilter;
  });

  const totalEmployees = allEmployees.length;
  const underpaidCount = allEmployees.filter(e => e.status === 'underpaid').length;
  const needsReviewCount = allEmployees.filter(e => e.status === 'needs-review').length;
  const totalUnderpayment = allEmployees
    .filter(e => e.status === 'underpaid')
    .reduce((sum, e) => sum + e.underpayment, 0);

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
                <span>Audit Results</span>
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
            Back to Dashboard
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl">Audit Results</h1>
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="size-3" />
                  Completed
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Organisation: <span className="text-foreground">BrightSteps Early Learning (VIC)</span></div>
                <div>Audit Request ID: <span className="text-foreground font-mono">AUD-2025-004</span></div>
                <div>Pay Period: <span className="text-foreground">01–14 Aug 2025</span></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="size-4" />
                <span className="hidden sm:inline">Export Underpaid (CSV)</span>
                <span className="sm:hidden">CSV</span>
              </Button>
              <Button variant="outline" className="gap-2">
                <FileText className="size-4" />
                <span className="hidden sm:inline">Generate Audit Report (PDF)</span>
                <span className="sm:hidden">PDF</span>
              </Button>
              <Button variant="outline" onClick={onViewHistory} className="gap-2">
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">Back to Audit History</span>
                <span className="sm:hidden">History</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" onClick={onViewReports} className="h-auto py-4 justify-start">
            <div className="text-left">
              <div className="font-medium mb-1">View Reports & Insights</div>
              <div className="text-xs text-muted-foreground">Root causes, breakdowns, recommendations</div>
            </div>
            <ChevronRight className="size-4 ml-auto" />
          </Button>
          <Button variant="outline" onClick={onViewReviewQueue} className="h-auto py-4 justify-start">
            <div className="text-left">
              <div className="font-medium mb-1">Human Review Queue</div>
              <div className="text-xs text-muted-foreground">{needsReviewCount} cases need expert review</div>
            </div>
            <ChevronRight className="size-4 ml-auto" />
          </Button>
          <Button variant="outline" onClick={onViewHistory} className="h-auto py-4 justify-start">
            <div className="text-left">
              <div className="font-medium mb-1">All Audit Requests</div>
              <div className="text-xs text-muted-foreground">View complete audit history</div>
            </div>
            <ChevronRight className="size-4 ml-auto" />
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Total Employees</CardDescription>
              <CardTitle className="text-2xl md:text-3xl">{totalEmployees}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs md:text-sm text-muted-foreground">Checked</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Underpaid</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-red-600">{underpaidCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs md:text-sm text-red-600">
                {((underpaidCount / totalEmployees) * 100).toFixed(0)}% of total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Needs Review</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-amber-600">{needsReviewCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs md:text-sm text-amber-600">
                {((needsReviewCount / totalEmployees) * 100).toFixed(0)}% of total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Total Underpayment</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-red-600">
                ${totalUnderpayment.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs md:text-sm text-muted-foreground">Estimated liability</div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Results Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Employee Results</CardTitle>
                <CardDescription>
                  Showing {filteredEmployees.length} of {totalEmployees} employees
                </CardDescription>
              </div>

              {/* Toggle View */}
              <div className="flex items-center gap-2">
                <Button
                  variant={!showUnderpaidOnly ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowUnderpaidOnly(false)}
                >
                  All Employees
                </Button>
                <Button
                  variant={showUnderpaidOnly ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowUnderpaidOnly(true)}
                >
                  Underpaid Only
                </Button>
              </div>
            </div>

            {/* Search */}
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
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
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
                        <Button size="sm" variant="ghost">
                          <ChevronRight className="size-4" />
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

      {/* Employee Detail Side Drawer */}
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
                    <div>Role: {selectedEmployee.role}</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedEmployee(null)}>
                  <XCircle className="size-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Paid vs Entitled Summary */}
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

              {/* Detailed Calculation Breakdown */}
              {selectedEmployee.status === 'underpaid' && selectedEmployee.employeeId === 'E-014' && (
                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertCircle className="size-5 text-red-600" />
                      Detailed Calculation Breakdown
                    </CardTitle>
                    <CardDescription>Step-by-step analysis of underpayment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Issue 1: Evening Penalty Rates */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                          1
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-red-900 mb-1">Missing Evening Penalty Rates</div>
                          <div className="text-sm text-red-800 mb-3">
                            Evening hours (after 6pm) were paid at ordinary casual rate instead of evening penalty rate
                          </div>
                          
                          {/* Calculation table */}
                          <div className="bg-white border border-red-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-red-100 border-b border-red-200">
                                  <th className="text-left p-2 font-medium">Item</th>
                                  <th className="text-right p-2 font-medium">Paid</th>
                                  <th className="text-right p-2 font-medium">Should Be</th>
                                  <th className="text-right p-2 font-medium">Difference</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-border">
                                  <td className="p-2">
                                    <div>Wed 7 Aug: 18:00-21:00</div>
                                    <div className="text-xs text-muted-foreground">3 hours evening work</div>
                                  </td>
                                  <td className="p-2 text-right">
                                    <div>$28.50/hr</div>
                                    <div className="text-xs text-muted-foreground">Ordinary rate</div>
                                  </td>
                                  <td className="p-2 text-right">
                                    <div>$31.35/hr</div>
                                    <div className="text-xs text-green-700">110% evening rate</div>
                                  </td>
                                  <td className="p-2 text-right text-red-600 font-medium">
                                    −$8.55
                                  </td>
                                </tr>
                                <tr className="border-b border-border">
                                  <td className="p-2">
                                    <div>Fri 9 Aug: 18:30-21:30</div>
                                    <div className="text-xs text-muted-foreground">3 hours evening work</div>
                                  </td>
                                  <td className="p-2 text-right">
                                    <div>$28.50/hr</div>
                                    <div className="text-xs text-muted-foreground">Ordinary rate</div>
                                  </td>
                                  <td className="p-2 text-right">
                                    <div>$31.35/hr</div>
                                    <div className="text-xs text-green-700">110% evening rate</div>
                                  </td>
                                  <td className="p-2 text-right text-red-600 font-medium">
                                    −$8.55
                                  </td>
                                </tr>
                                <tr className="bg-red-50">
                                  <td colSpan={3} className="p-2 font-medium">
                                    Subtotal - Evening Penalty Issue
                                  </td>
                                  <td className="p-2 text-right text-red-600 font-medium">
                                    −$17.10
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-sm text-blue-900">
                              <strong>Award Reference:</strong> Children's Services Award 2010, Clause 25.3
                            </div>
                            <div className="text-sm text-blue-800 mt-1">
                              "An employee working between 6pm and midnight on a weekday shall be paid at 110% of the ordinary hourly rate"
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Issue 2: Casual Loading Application */}
                    <div className="space-y-3 pt-4 border-t border-red-200">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                          2
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-red-900 mb-1">Incorrect Casual Loading Application</div>
                          <div className="text-sm text-red-800 mb-3">
                            25% casual loading should apply to the evening penalty rate, not just the base rate
                          </div>
                          
                          {/* Calculation table */}
                          <div className="bg-white border border-red-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-red-100 border-b border-red-200">
                                  <th className="text-left p-2 font-medium">Calculation</th>
                                  <th className="text-right p-2 font-medium">Paid</th>
                                  <th className="text-right p-2 font-medium">Should Be</th>
                                  <th className="text-right p-2 font-medium">Difference</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-border">
                                  <td className="p-2">
                                    <div>Base rate</div>
                                  </td>
                                  <td className="p-2 text-right">$28.50</td>
                                  <td className="p-2 text-right">$28.50</td>
                                  <td className="p-2 text-right">—</td>
                                </tr>
                                <tr className="border-b border-border">
                                  <td className="p-2">
                                    <div>Evening penalty (110%)</div>
                                  </td>
                                  <td className="p-2 text-right">$31.35</td>
                                  <td className="p-2 text-right">$31.35</td>
                                  <td className="p-2 text-right">—</td>
                                </tr>
                                <tr className="border-b border-border">
                                  <td className="p-2">
                                    <div>Casual loading (25%)</div>
                                    <div className="text-xs text-muted-foreground">Applied to penalty rate</div>
                                  </td>
                                  <td className="p-2 text-right">
                                    <div>$7.13</div>
                                    <div className="text-xs text-muted-foreground">On base only</div>
                                  </td>
                                  <td className="p-2 text-right">
                                    <div>$7.84</div>
                                    <div className="text-xs text-green-700">On penalty rate</div>
                                  </td>
                                  <td className="p-2 text-right text-red-600 font-medium">
                                    −$0.71
                                  </td>
                                </tr>
                                <tr className="bg-red-50">
                                  <td className="p-2 font-medium">
                                    <div>Total effective rate</div>
                                  </td>
                                  <td className="p-2 text-right font-medium">$35.63/hr</td>
                                  <td className="p-2 text-right font-medium text-green-700">$39.19/hr</td>
                                  <td className="p-2 text-right text-red-600 font-medium">
                                    −$3.56/hr
                                  </td>
                                </tr>
                                <tr className="bg-red-100 border-t border-red-200">
                                  <td className="p-2 font-medium">
                                    For 6 evening hours
                                  </td>
                                  <td className="p-2 text-right font-medium">$213.78</td>
                                  <td className="p-2 text-right font-medium text-green-700">$235.14</td>
                                  <td className="p-2 text-right text-red-600 font-medium">
                                    −$21.36
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-sm text-blue-900">
                              <strong>Award Reference:</strong> Children's Services Award 2010, Clause 12.2
                            </div>
                            <div className="text-sm text-blue-800 mt-1">
                              "A casual employee must be paid a loading of 25% of the minimum hourly rate. The casual loading is payable on all purpose rates"
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Context */}
                    <div className="space-y-3 pt-4 border-t border-red-200">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                          ℹ
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-amber-900 mb-1">Additional Context</div>
                          <div className="text-sm text-amber-800 space-y-2">
                            <div>
                              • <strong>Remaining hours:</strong> 23.5 ordinary hours were paid correctly at $35.63/hr (base $28.50 + 25% casual loading)
                            </div>
                            <div>
                              • <strong>Total hours worked:</strong> 29.5 hours in pay period
                            </div>
                            <div>
                              • <strong>Pay period:</strong> 01–14 Aug 2025 (fortnightly)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Total Summary */}
                    <div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Evening penalty shortfall (Issue 1)</span>
                          <span className="text-red-600 font-medium">−$17.10</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Casual loading shortfall (Issue 2)</span>
                          <span className="text-red-600 font-medium">−$21.36</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Ordinary hours (correct)</span>
                          <span className="text-green-600">$0.00</span>
                        </div>
                        <div className="pt-3 border-t-2 border-red-300 flex justify-between">
                          <span className="font-medium">Total Underpayment</span>
                          <span className="text-xl text-red-600 font-medium">−$38.46</span>
                        </div>
                      </div>
                    </div>

                    {/* Correction Needed */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-green-900 mb-1">Recommended Correction</div>
                          <div className="text-sm text-green-800">
                            Pay <strong>$38.46</strong> back-pay to Ava Nguyen for the period 01–14 Aug 2025, plus ensure future evening shifts are correctly calculated with both evening penalty (110%) and casual loading (25%) applied to the penalty rate.
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

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
                    <Button className="w-full gap-2" onClick={onViewReviewQueue}>
                      <Send className="size-4" />
                      Send to Human Review Queue
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