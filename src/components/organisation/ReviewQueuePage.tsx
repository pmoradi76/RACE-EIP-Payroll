import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AnomalyScorePill } from '../design-system/AnomalyScorePill';
import { Progress } from '../ui/progress';
import {
  Shield,
  Bell,
  LogOut,
  ArrowLeft,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Send,
  Flag,
  Eye,
  Edit3
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface ReviewCase {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriod: string;
  issueType: string;
  confidence: number;
  anomalyScore: number;
  uncertainty: string;
  assignedReviewer: string;
  status: 'pending' | 'in-review' | 'completed';
  slaDays: number;
  priority: 'high' | 'medium' | 'low';
}

interface ReviewQueuePageProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ReviewQueuePage({ onBack, onLogout }: ReviewQueuePageProps) {
  const [selectedCase, setSelectedCase] = useState<ReviewCase | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const reviewCases: ReviewCase[] = [
    {
      id: '1',
      employeeId: 'E-033',
      employeeName: 'Mia Chen',
      payPeriod: '01–14 Aug 2025',
      issueType: 'Allowance ambiguity',
      confidence: 0.55,
      anomalyScore: 54,
      uncertainty: 'Meal allowance applicability for part-time split shifts unclear in enterprise agreement',
      assignedReviewer: 'Jane Davis',
      status: 'pending',
      slaDays: 2,
      priority: 'high'
    },
    {
      id: '2',
      employeeId: 'E-052',
      employeeName: 'Sofia Rossi',
      payPeriod: '01–14 Aug 2025',
      issueType: 'Classification unclear',
      confidence: 0.52,
      anomalyScore: 49,
      uncertainty: 'Award level mapping uncertain - mixed duties (admin + educational support)',
      assignedReviewer: 'Jane Davis',
      status: 'in-review',
      slaDays: 3,
      priority: 'medium'
    },
    {
      id: '3',
      employeeId: 'E-028',
      employeeName: 'David Wong',
      payPeriod: '01–14 Aug 2025',
      issueType: 'Overtime calculation',
      confidence: 0.58,
      anomalyScore: 61,
      uncertainty: 'Annualized hours contract - unclear if overtime applies for this pay period',
      assignedReviewer: 'Unassigned',
      status: 'pending',
      slaDays: 4,
      priority: 'low'
    },
    {
      id: '4',
      employeeId: 'E-044',
      employeeName: 'Emma Brown',
      payPeriod: '01–14 Aug 2025',
      issueType: 'Public holiday ambiguity',
      confidence: 0.51,
      anomalyScore: 56,
      uncertainty: 'Public holiday fell on rostered day off - substitute day entitlement unclear',
      assignedReviewer: 'Jane Davis',
      status: 'pending',
      slaDays: 1,
      priority: 'high'
    }
  ];

  const filteredCases = reviewCases.filter(c => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const pendingCount = reviewCases.filter(c => c.status === 'pending').length;
  const inReviewCount = reviewCases.filter(c => c.status === 'in-review').length;
  const highPriorityCount = reviewCases.filter(c => c.priority === 'high').length;

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
                <span>Review Queue</span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
            Back to Audit Results
          </Button>

          <div>
            <h1 className="text-2xl md:text-3xl mb-2">Human Review Queue</h1>
            <p className="text-muted-foreground">
              Cases requiring expert review for audit <span className="font-mono">AUD-2025-004</span>
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Total Queue</CardDescription>
              <CardTitle className="text-2xl md:text-3xl">{reviewCases.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs md:text-sm text-muted-foreground">Cases total</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Pending</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-amber-600">{pendingCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs md:text-sm text-amber-600">Awaiting review</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">In Review</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-blue-600">{inReviewCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs md:text-sm text-blue-600">Being reviewed</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">High Priority</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-red-600">{highPriorityCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs md:text-sm text-red-600">Urgent cases</div>
            </CardContent>
          </Card>
        </div>

        {/* Review Queue Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Review Cases</CardTitle>
                <CardDescription>
                  Showing {filteredCases.length} of {reviewCases.length} cases
                </CardDescription>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead className="hidden lg:table-cell">Pay Period</TableHead>
                    <TableHead>Issue Type</TableHead>
                    <TableHead className="hidden md:table-cell">Confidence</TableHead>
                    <TableHead className="hidden xl:table-cell">Score</TableHead>
                    <TableHead className="hidden lg:table-cell">What's Uncertain</TableHead>
                    <TableHead className="hidden md:table-cell">Reviewer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden xl:table-cell">SLA</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((reviewCase) => (
                    <TableRow
                      key={reviewCase.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedCase(reviewCase)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{reviewCase.employeeName}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {reviewCase.employeeId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {reviewCase.payPeriod}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{reviewCase.issueType}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm">{(reviewCase.confidence * 100).toFixed(0)}%</div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <AnomalyScorePill score={reviewCase.anomalyScore} size="sm" showLabel={false} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell max-w-xs">
                        <div className="text-sm truncate">{reviewCase.uncertainty}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <User className="size-4 text-muted-foreground" />
                          <span className="text-sm">{reviewCase.assignedReviewer}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            reviewCase.status === 'pending'
                              ? 'secondary'
                              : reviewCase.status === 'in-review'
                              ? 'default'
                              : 'default'
                          }
                        >
                          {reviewCase.status === 'pending' && 'Pending'}
                          {reviewCase.status === 'in-review' && 'In Review'}
                          {reviewCase.status === 'completed' && 'Completed'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="flex items-center gap-2">
                          <Clock className={`size-4 ${
                            reviewCase.slaDays <= 2 ? 'text-red-600' : 'text-amber-600'
                          }`} />
                          <span className={`text-sm ${
                            reviewCase.slaDays <= 2 ? 'text-red-600' : 'text-amber-600'
                          }`}>
                            {reviewCase.slaDays}d left
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          <Eye className="size-4" />
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

      {/* Review Workspace Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-7xl my-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle>Review Case: {selectedCase.employeeName}</CardTitle>
                    <Badge variant={selectedCase.priority === 'high' ? 'destructive' : 'secondary'}>
                      {selectedCase.priority} priority
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="size-3 mr-1" />
                      {selectedCase.slaDays}d left
                    </Badge>
                  </div>
                  <CardDescription>
                    {selectedCase.employeeId} • {selectedCase.payPeriod} • {selectedCase.issueType}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedCase(null)}>
                  <XCircle className="size-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Extracted Fields */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Extracted Fields</CardTitle>
                    <CardDescription>With confidence scores</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="base-rate" className="text-xs text-muted-foreground">Base Rate</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input id="base-rate" value="$28.50/hr" readOnly className="flex-1" />
                        <Badge variant="default" className="text-xs">0.92</Badge>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="hours-worked" className="text-xs text-muted-foreground">Hours Worked</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input id="hours-worked" value="24.5" readOnly className="flex-1" />
                        <Badge variant="default" className="text-xs">0.98</Badge>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="split-shifts" className="text-xs text-muted-foreground">Split Shifts</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input id="split-shifts" value="2" className="flex-1" />
                        <Badge variant="secondary" className="text-xs">0.55</Badge>
                      </div>
                      <p className="text-xs text-amber-600 mt-1">⚠️ Low confidence - verify manually</p>
                    </div>

                    <div>
                      <Label htmlFor="allowance" className="text-xs text-muted-foreground">Meal Allowance</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Select defaultValue="uncertain">
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes - Entitled</SelectItem>
                            <SelectItem value="no">No - Not Entitled</SelectItem>
                            <SelectItem value="uncertain">Uncertain</SelectItem>
                          </SelectContent>
                        </Select>
                        <Badge variant="secondary" className="text-xs">0.51</Badge>
                      </div>
                      <p className="text-xs text-red-600 mt-1">❌ Unclear in enterprise agreement</p>
                    </div>

                    <div>
                      <Label htmlFor="classification" className="text-xs text-muted-foreground">Classification</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input id="classification" value="Level 3" readOnly className="flex-1" />
                        <Badge variant="default" className="text-xs">0.89</Badge>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Edit3 className="size-4" />
                        Edit All Fields
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Middle: Calculation Trace */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Calculation Trace</CardTitle>
                    <CardDescription>Paid vs Entitled difference</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-2">Paid Amount</div>
                      <div className="text-2xl font-medium">$672.00</div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="font-medium">Entitled Calculation:</div>
                      <div className="space-y-1 pl-3 border-l-2 border-border">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Base hours (24.5 @ $28.50)</span>
                          <span>$698.25</span>
                        </div>
                        <div className="flex justify-between text-amber-600">
                          <span className="text-muted-foreground">Split shift allowance (2 × ?)</span>
                          <span>?</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-border font-medium">
                          <span>Total Entitled</span>
                          <span className="text-amber-600">$690.00 (?)</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-amber-900 mb-1">Uncertainty Detected</div>
                          <div className="text-sm text-amber-800">
                            {selectedCase.uncertainty}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-900">Potential Underpayment</span>
                        <span className="text-xl text-red-600 font-medium">−$18.00</span>
                      </div>
                      <div className="text-xs text-red-700 mt-1">If allowance applies</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Right: Document Viewer */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Document Evidence</CardTitle>
                    <CardDescription>Highlighted snippets</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Enterprise Agreement</div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                        <div className="text-blue-900 mb-2">Clause 7.4: Meal Allowances</div>
                        <p className="text-blue-800 leading-relaxed">
                          "Employees working <mark className="bg-yellow-200">split shifts</mark> may be 
                          entitled to a meal allowance where applicable..."
                        </p>
                        <div className="text-xs text-blue-600 mt-2">
                          ⚠️ Ambiguous wording for part-time employees
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Award Clause</div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
                        <div className="text-green-900 mb-2">Award Clause 19.4</div>
                        <p className="text-green-800 leading-relaxed">
                          "An employee working a <mark className="bg-yellow-200">split shift</mark> shall 
                          be paid an allowance of $18.50 per shift."
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Timesheet Extract</div>
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded text-sm font-mono">
                        <div className="text-purple-900 mb-2">Week 1 & 2</div>
                        <div className="space-y-1 text-purple-800">
                          <div><mark className="bg-yellow-200">Mon 5 Aug: 8:00-12:00, 15:00-18:00</mark></div>
                          <div><mark className="bg-yellow-200">Thu 8 Aug: 8:00-12:00, 15:00-18:00</mark></div>
                          <div>Tue 6 Aug: 8:00-15:00</div>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <FileText className="size-4" />
                      View Full Documents
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border">
                <Button className="gap-2">
                  <CheckCircle2 className="size-4" />
                  Approve Underpayment
                </Button>
                <Button variant="outline" className="gap-2">
                  <XCircle className="size-4" />
                  Mark OK
                </Button>
                <Button variant="outline" className="gap-2">
                  <Send className="size-4" />
                  Request More Docs
                </Button>
                <Button variant="outline" className="gap-2">
                  <Flag className="size-4" />
                  Escalate to Admin
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}