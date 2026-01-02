import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Shield,
  Bell,
  LogOut,
  ArrowLeft,
  Search,
  ChevronRight,
  Calendar,
  Users,
  AlertCircle,
  DollarSign,
  Upload,
  Download
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface AuditRequest {
  id: string;
  requestId: string;
  payPeriod: string;
  employeesChecked: number;
  underpaidCount: number;
  needsReviewCount: number;
  estimatedUnderpayment: number;
  status: 'completed' | 'in-progress' | 'failed';
  submittedDate: string;
}

interface AuditHistoryPageProps {
  onBack: () => void;
  onViewResults: (requestId: string) => void;
  onViewDetail: (requestId: string) => void;
  onNewAudit: () => void;
  onLogout: () => void;
}

export function AuditHistoryPage({ onBack, onViewResults, onViewDetail, onNewAudit, onLogout }: AuditHistoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [underpaidOnlyFilter, setUnderpaidOnlyFilter] = useState(false);

  const auditRequests: AuditRequest[] = [
    {
      id: '1',
      requestId: 'AUD-2025-004',
      payPeriod: '01–14 Aug 2025',
      employeesChecked: 12,
      underpaidCount: 3,
      needsReviewCount: 2,
      estimatedUnderpayment: 188.00,
      status: 'completed',
      submittedDate: '15 Aug 2025'
    },
    {
      id: '2',
      requestId: 'AUD-2025-003',
      payPeriod: '15–31 Jul 2025',
      employeesChecked: 11,
      underpaidCount: 1,
      needsReviewCount: 1,
      estimatedUnderpayment: 44.00,
      status: 'completed',
      submittedDate: '01 Aug 2025'
    },
    {
      id: '3',
      requestId: 'AUD-2025-002',
      payPeriod: '01–14 Jul 2025',
      employeesChecked: 10,
      underpaidCount: 0,
      needsReviewCount: 1,
      estimatedUnderpayment: 0,
      status: 'completed',
      submittedDate: '16 Jul 2025'
    },
    {
      id: '4',
      requestId: 'AUD-2025-001',
      payPeriod: '15–30 Jun 2025',
      employeesChecked: 10,
      underpaidCount: 2,
      needsReviewCount: 0,
      estimatedUnderpayment: 124.50,
      status: 'completed',
      submittedDate: '02 Jul 2025'
    },
    {
      id: '5',
      requestId: 'AUD-2024-012',
      payPeriod: '01–14 Jun 2025',
      employeesChecked: 9,
      underpaidCount: 1,
      needsReviewCount: 2,
      estimatedUnderpayment: 67.80,
      status: 'completed',
      submittedDate: '18 Jun 2025'
    }
  ];

  const filteredRequests = auditRequests.filter(req => {
    const matchesSearch = req.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.payPeriod.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesUnderpaidOnly = !underpaidOnlyFilter || req.underpaidCount > 0;
    return matchesSearch && matchesStatus && matchesUnderpaidOnly;
  });

  // Calculate summary stats
  const totalAudits = auditRequests.length;
  const totalEmployeesChecked = auditRequests.reduce((sum, req) => sum + req.employeesChecked, 0);
  const totalUnderpaid = auditRequests.reduce((sum, req) => sum + req.underpaidCount, 0);
  const totalLiability = auditRequests.reduce((sum, req) => sum + req.estimatedUnderpayment, 0);

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
                <span>Audit History</span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Button size="sm" onClick={onNewAudit} className="gap-2">
                <Upload className="size-4" />
                <span className="hidden sm:inline">New Audit</span>
              </Button>

              <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-border">
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

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl mb-2">Audit Request History</h1>
              <p className="text-muted-foreground">
                BrightSteps Early Learning (VIC) • All audit requests
              </p>
            </div>

            <Button onClick={onNewAudit} className="gap-2">
              <Upload className="size-4" />
              New Bulk Audit Request
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Total Audits</CardDescription>
              <CardTitle className="text-2xl md:text-3xl">{totalAudits}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <Calendar className="size-4" />
                <span>Since Jun 2025</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Employees Checked</CardDescription>
              <CardTitle className="text-2xl md:text-3xl">{totalEmployeesChecked}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <Users className="size-4" />
                <span>Across all audits</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Total Underpaid</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-red-600">{totalUnderpaid}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs md:text-sm text-red-600">
                <AlertCircle className="size-4" />
                <span>Cases found</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Total Liability</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-red-600">
                ${totalLiability.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <DollarSign className="size-4" />
                <span>Cumulative</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit History Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>All Audit Requests</CardTitle>
                <CardDescription>
                  Showing {filteredRequests.length} of {totalAudits} audits
                </CardDescription>
              </div>

              <Button variant="outline" className="gap-2">
                <Download className="size-4" />
                Export Summary
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              <div className="relative sm:col-span-2 lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Request ID or pay period..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={underpaidOnlyFilter}
                  onChange={(e) => setUnderpaidOnlyFilter(e.target.checked)}
                />
                <span className="text-sm text-muted-foreground">Underpaid Only</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Pay Period</TableHead>
                    <TableHead className="hidden md:table-cell">Employees</TableHead>
                    <TableHead className="hidden lg:table-cell">Underpaid</TableHead>
                    <TableHead className="hidden lg:table-cell">Needs Review</TableHead>
                    <TableHead>Est. Underpayment</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden xl:table-cell">Submitted</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow 
                      key={request.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onViewDetail(request.requestId)}
                    >
                      <TableCell className="font-mono text-sm">{request.requestId}</TableCell>
                      <TableCell>{request.payPeriod}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-muted-foreground" />
                          <span>{request.employeesChecked}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {request.underpaidCount > 0 ? (
                          <span className="text-red-600 font-medium">{request.underpaidCount}</span>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {request.needsReviewCount > 0 ? (
                          <span className="text-amber-600 font-medium">{request.needsReviewCount}</span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {request.estimatedUnderpayment > 0 ? (
                          <span className="text-red-600 font-medium">
                            ${request.estimatedUnderpayment.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-green-600">$0.00</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant={
                            request.status === 'completed'
                              ? 'default'
                              : request.status === 'in-progress'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {request.status === 'completed' && 'Completed'}
                          {request.status === 'in-progress' && 'In Progress'}
                          {request.status === 'failed' && 'Failed'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                        {request.submittedDate}
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
      </main>
    </div>
  );
}