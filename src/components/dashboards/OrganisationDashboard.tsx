import { OrganisationDashboardShell } from '../shells/OrganisationDashboardShell';
import { PageHeader } from '../design-system/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { StatusBadge } from '../design-system/StatusBadge';
import { SeverityBadge } from '../design-system/SeverityBadge';
import { AnomalyScorePill } from '../design-system/AnomalyScorePill';
import { Users, AlertTriangle, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';

export function OrganisationDashboard() {
  const highRiskEmployees = [
    {
      id: '1',
      name: 'Ava Nguyen',
      role: 'Casual Educator',
      department: 'Childcare',
      anomalyScore: 87,
      severity: 'underpaid' as const,
      amount: -72,
      lastChecked: '16 Aug 2025'
    },
    {
      id: '2',
      name: 'Marcus Chen',
      role: 'Lead Educator',
      department: 'Childcare',
      anomalyScore: 78,
      severity: 'needs-review' as const,
      amount: -45,
      lastChecked: '15 Aug 2025'
    },
    {
      id: '3',
      name: 'Sophie Wilson',
      role: 'Assistant Educator',
      department: 'Childcare',
      anomalyScore: 65,
      severity: 'underpaid' as const,
      amount: -28,
      lastChecked: '14 Aug 2025'
    },
    {
      id: '4',
      name: 'James Rodriguez',
      role: 'Casual Educator',
      department: 'Childcare',
      anomalyScore: 52,
      severity: 'needs-review' as const,
      amount: null,
      lastChecked: '13 Aug 2025'
    }
  ];

  return (
    <OrganisationDashboardShell>
      <PageHeader 
        title="Compliance Overview"
        description="Little Learners Childcare Centre • 143 employees"
      />

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardDescription>Total Employees</CardDescription>
            <CardTitle className="text-3xl">143</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="size-4" />
              <span>+5 this quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Underpaid Employees</CardDescription>
            <CardTitle className="text-3xl text-red-600">12</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="size-4" />
              <span>8.4% of workforce</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Review Queue</CardDescription>
            <CardTitle className="text-3xl text-amber-600">8</CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" variant="outline" className="w-full">Review Now</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Total Liability</CardDescription>
            <CardTitle className="text-3xl text-red-600">$2,847</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Across 12 employees</div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Audit Progress</CardTitle>
          <CardDescription>Current audit cycle: August 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Employees Processed</span>
                <span className="text-sm">128 / 143</span>
              </div>
              <Progress value={89} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl text-green-600">115</div>
                <div className="text-xs text-muted-foreground">Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-red-600">12</div>
                <div className="text-xs text-muted-foreground">Underpaid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-amber-600">16</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High Risk Employees */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>High Priority Cases</CardTitle>
              <CardDescription>Employees requiring immediate attention</CardDescription>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {highRiskEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div>
                      <div>{employee.name}</div>
                      <div className="text-sm text-muted-foreground">{employee.role}</div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <AnomalyScorePill score={employee.anomalyScore} showLabel={false} size="sm" />
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={employee.severity} size="sm" />
                  </TableCell>
                  <TableCell>
                    {employee.amount !== null ? (
                      <span className="text-red-600">−${Math.abs(employee.amount)}</span>
                    ) : (
                      <span className="text-muted-foreground">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {employee.lastChecked}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="gap-1">
                      Review
                      <ArrowRight className="size-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Bulk Upload</CardTitle>
            <CardDescription>Process multiple employees at once</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Upload ZIP Archive</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Report</CardTitle>
            <CardDescription>Download compliance summary</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Generate Report</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department View</CardTitle>
            <CardDescription>Filter by department or location</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">View Analytics</Button>
          </CardContent>
        </Card>
      </div>
    </OrganisationDashboardShell>
  );
}
