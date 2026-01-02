import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { SeverityBadge } from '../design-system/SeverityBadge';
import { BulkAuditWizard } from '../organisation/BulkAuditWizard';
import { 
  Shield, 
  Bell, 
  LogOut, 
  Upload, 
  Download, 
  Filter, 
  Search,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Users,
  DollarSign,
  BarChart3,
  MessageSquare,
  ChevronRight,
  Clock,
  FileText
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface Employee {
  id: string;
  name: string;
  role: string;
  site: string;
  status: 'ok' | 'underpaid' | 'needs-review';
  amount?: number;
  payPeriod: string;
  award: string;
}

interface OrganisationDashboardPageProps {
  onNewBulkAudit?: () => void;
  onViewAuditHistory?: () => void;
  onViewReviewQueue?: () => void;
  onLogout?: () => void;
}

export function OrganisationDashboardPage({
  onNewBulkAudit,
  onViewAuditHistory,
  onViewReviewQueue,
  onLogout
}: OrganisationDashboardPageProps = {}) {
  const [showUnderpaidOnly, setShowUnderpaidOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSite, setSelectedSite] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedPayPeriod, setSelectedPayPeriod] = useState('all');
  const [showBulkAuditWizard, setShowBulkAuditWizard] = useState(false);

  const handleNewAudit = () => {
    if (onNewBulkAudit) {
      onNewBulkAudit();
    } else {
      setShowBulkAuditWizard(true);
    }
  };

  // Sample data for BrightSteps Early Learning (VIC)
  const allEmployees: Employee[] = [
    {
      id: '1',
      name: 'Ava Nguyen',
      role: 'Casual Educator',
      site: 'BrightSteps Richmond',
      status: 'underpaid',
      amount: -142.50,
      payPeriod: '01-14 Aug 2025',
      award: 'Children\'s Services Award'
    },
    {
      id: '2',
      name: 'Marcus Chen',
      role: 'Lead Educator',
      site: 'BrightSteps Richmond',
      status: 'underpaid',
      amount: -87.20,
      payPeriod: '01-14 Aug 2025',
      award: 'Children\'s Services Award'
    },
    {
      id: '3',
      name: 'Sophie Wilson',
      role: 'Assistant Educator',
      site: 'BrightSteps Carlton',
      status: 'underpaid',
      amount: -56.80,
      payPeriod: '01-14 Aug 2025',
      award: 'Children\'s Services Award'
    },
    {
      id: '4',
      name: 'Emma Thompson',
      role: 'Early Childhood Teacher',
      site: 'BrightSteps Richmond',
      status: 'needs-review',
      amount: -23.40,
      payPeriod: '01-14 Aug 2025',
      award: 'Children\'s Services Award'
    },
    {
      id: '5',
      name: 'Liam O\'Brien',
      role: 'Casual Educator',
      site: 'BrightSteps Carlton',
      status: 'needs-review',
      amount: undefined,
      payPeriod: '01-14 Aug 2025',
      award: 'Children\'s Services Award'
    },
    {
      id: '6',
      name: 'Olivia Martin',
      role: 'Educational Leader',
      site: 'BrightSteps Richmond',
      status: 'ok',
      payPeriod: '01-14 Aug 2025',
      award: 'Children\'s Services Award'
    },
    {
      id: '7',
      name: 'Noah Anderson',
      role: 'Assistant Educator',
      site: 'BrightSteps Carlton',
      status: 'ok',
      payPeriod: '01-14 Aug 2025',
      award: 'Children\'s Services Award'
    },
    {
      id: '8',
      name: 'Isabella Garcia',
      role: 'Lead Educator',
      site: 'BrightSteps Richmond',
      status: 'ok',
      payPeriod: '01-14 Aug 2025',
      award: 'Children\'s Services Award'
    },
    {
      id: '9',
      name: 'William Lee',
      role: 'Casual Educator',
      site: 'BrightSteps Carlton',
      status: 'ok',
      payPeriod: '01-14 Aug 2025',
      award: 'Children\'s Services Award'
    },
    {
      id: '10',
      name: 'Charlotte Kim',
      role: 'Early Childhood Teacher',
      site: 'BrightSteps Richmond',
      status: 'ok',
      payPeriod: '01-14 Aug 2025',
      award: 'Children\'s Services Award'
    },
    {
      id: '11',
      name: 'James Taylor',
      role: 'Assistant Educator',
      site: 'BrightSteps Carlton',
      status: 'ok',
      payPeriod: '01-14 Aug 2025',
      award: 'Children\'s Services Award'
    },
    {
      id: '12',
      name: 'Mia Rodriguez',
      role: 'Educational Leader',
      site: 'BrightSteps Richmond',
      status: 'ok',
      payPeriod: '01-14 Aug 2025',
      award: 'Children\'s Services Award'
    }
  ];

  // Filter employees
  const filteredEmployees = allEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnderpaid = !showUnderpaidOnly || emp.status === 'underpaid';
    const matchesSite = selectedSite === 'all' || emp.site === selectedSite;
    const matchesRole = selectedRole === 'all' || emp.role === selectedRole;
    const matchesPayPeriod = selectedPayPeriod === 'all' || emp.payPeriod === selectedPayPeriod;
    
    return matchesSearch && matchesUnderpaid && matchesSite && matchesRole && matchesPayPeriod;
  });

  // Calculate KPIs
  const totalEmployees = allEmployees.length;
  const underpaidCount = allEmployees.filter(e => e.status === 'underpaid').length;
  const needsReviewCount = allEmployees.filter(e => e.status === 'needs-review').length;
  const totalUnderpayment = allEmployees
    .filter(e => e.status === 'underpaid' && e.amount)
    .reduce((sum, e) => sum + Math.abs(e.amount || 0), 0);
  const reviewPercentage = ((needsReviewCount / totalEmployees) * 100).toFixed(1);

  // Root causes data
  const rootCauses = [
    { cause: 'Missing evening penalty rates', count: 8, percentage: 67 },
    { cause: 'Incorrect casual loading', count: 3, percentage: 25 },
    { cause: 'Split shift allowance not paid', count: 2, percentage: 17 },
    { cause: 'Public holiday rates', count: 1, percentage: 8 }
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Bulk Audit Wizard Modal */}
      {showBulkAuditWizard && (
        <BulkAuditWizard onClose={() => setShowBulkAuditWizard(false)} />
      )}
      
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
                <span>Organisation Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
                <Download className="size-4" />
                <span className="hidden lg:inline">Export</span>
              </Button>
              <Button size="sm" className="gap-2" onClick={handleNewAudit}>
                <Upload className="size-4" />
                <span className="hidden sm:inline">New Bulk Audit</span>
              </Button>
              
              <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-border">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <h1 className="text-2xl md:text-3xl">Compliance Dashboard</h1>
            <Button variant="outline" className="gap-2" onClick={onViewAuditHistory}>
              <FileText className="size-4" />
              View Audit History
            </Button>
          </div>
          <p className="text-muted-foreground">
            BrightSteps Early Learning (VIC) • Pay Period: 01–14 Aug 2025
          </p>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Total Checked</CardDescription>
              <CardTitle className="text-2xl md:text-3xl">{totalEmployees}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <Users className="size-4" />
                <span>Employees</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm"># Underpaid</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-red-600">{underpaidCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs md:text-sm text-red-600">
                <TrendingDown className="size-4" />
                <span>{((underpaidCount / totalEmployees) * 100).toFixed(1)}% of total</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Est. Underpayment</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-red-600">
                ${totalUnderpayment.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <DollarSign className="size-4" />
                <span>Total liability</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Needs Review</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-amber-600">{reviewPercentage}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs md:text-sm text-amber-600">
                <AlertCircle className="size-4" />
                <span>{needsReviewCount} employees</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6 md:mb-8">
          {/* Top Root Causes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Root Causes</CardTitle>
              <CardDescription>Most common underpayment issues detected</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rootCauses.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex-1">{item.cause}</span>
                    <span className="text-muted-foreground ml-4">{item.count} cases</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            {/* Human-in-the-loop Queue */}
            <Card>
              <CardHeader>
                <CardTitle>Human Review Queue</CardTitle>
                <CardDescription>Cases needing expert review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-4xl mb-2 text-amber-600">{needsReviewCount}</div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Employees awaiting review
                  </div>
                  <Button className="w-full gap-2" onClick={onViewReviewQueue}>
                    <Clock className="size-4" />
                    Review Queue
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Trend Over Time</CardTitle>
                <CardDescription>Last 6 pay periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-end justify-between gap-2">
                  {[2, 3, 1, 4, 2, 3].map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-red-500 rounded-t"
                        style={{ height: `${(value / 4) * 100}%` }}
                      />
                      <div className="text-xs text-muted-foreground">P{index + 1}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <div className="text-sm text-muted-foreground">
                    Average: <span className="text-red-600">2.5 issues/period</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Award Assistant Entry */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-base">Award Assistant</CardTitle>
                <CardDescription>Get help with award interpretations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full gap-2 bg-white">
                  <MessageSquare className="size-4" />
                  Chat with Assistant
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Employee Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Employee Pay Check Results</CardTitle>
                <CardDescription>
                  Showing {filteredEmployees.length} of {totalEmployees} employees
                </CardDescription>
              </div>
              
              {/* Underpaid Only Toggle */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Label htmlFor="underpaid-only" className="cursor-pointer text-sm">
                  Underpaid only
                </Label>
                <Switch
                  id="underpaid-only"
                  checked={showUnderpaidOnly}
                  onCheckedChange={setShowUnderpaidOnly}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger>
                  <SelectValue placeholder="Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  <SelectItem value="BrightSteps Richmond">BrightSteps Richmond</SelectItem>
                  <SelectItem value="BrightSteps Carlton">BrightSteps Carlton</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Casual Educator">Casual Educator</SelectItem>
                  <SelectItem value="Lead Educator">Lead Educator</SelectItem>
                  <SelectItem value="Assistant Educator">Assistant Educator</SelectItem>
                  <SelectItem value="Early Childhood Teacher">Early Childhood Teacher</SelectItem>
                  <SelectItem value="Educational Leader">Educational Leader</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPayPeriod} onValueChange={setSelectedPayPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Pay Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Periods</SelectItem>
                  <SelectItem value="01-14 Aug 2025">01-14 Aug 2025</SelectItem>
                  <SelectItem value="15-31 Jul 2025">15-31 Jul 2025</SelectItem>
                  <SelectItem value="01-14 Jul 2025">01-14 Jul 2025</SelectItem>
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
                    <TableHead className="hidden md:table-cell">Site</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden lg:table-cell">Pay Period</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No employees match your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">{employee.role}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm">{employee.site}</div>
                        </TableCell>
                        <TableCell>
                          <SeverityBadge severity={employee.status} size="sm" />
                        </TableCell>
                        <TableCell>
                          {employee.status === 'underpaid' && employee.amount !== undefined ? (
                            <span className="text-red-600">−${Math.abs(employee.amount).toFixed(2)}</span>
                          ) : employee.status === 'needs-review' ? (
                            <span className="text-amber-600">Review needed</span>
                          ) : (
                            <span className="text-green-600">$0.00</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {employee.payPeriod}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="gap-1">
                            <span className="hidden sm:inline">View</span>
                            <ChevronRight className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}