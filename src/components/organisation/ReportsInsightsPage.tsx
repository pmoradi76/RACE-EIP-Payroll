import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Shield,
  Bell,
  LogOut,
  ArrowLeft,
  Download,
  FileText,
  TrendingUp,
  AlertCircle,
  Clock,
  MapPin,
  BarChart3,
  PieChart,
  ExternalLink
} from 'lucide-react';

interface ReportsInsightsPageProps {
  onBack: () => void;
  onViewResults: () => void;
  onLogout: () => void;
}

export function ReportsInsightsPage({ onBack, onViewResults, onLogout }: ReportsInsightsPageProps) {
  const rootCauses = [
    { cause: 'Evening/out-of-hours paid as ordinary', percentage: 38, count: 8, color: 'bg-red-500' },
    { cause: 'Weekend penalty missing', percentage: 24, count: 5, color: 'bg-orange-500' },
    { cause: 'Allowance not applied', percentage: 18, count: 4, color: 'bg-amber-500' },
    { cause: 'Overtime threshold misapplied', percentage: 12, count: 3, color: 'bg-yellow-500' },
    { cause: 'Classification mismatch', percentage: 8, count: 2, color: 'bg-lime-500' }
  ];

  const payCodeBreakdown = [
    { code: 'Evening Penalty', underpayment: 86.50, cases: 3 },
    { code: 'Saturday Penalty', underpayment: 44.00, cases: 2 },
    { code: 'Casual Loading', underpayment: 32.50, cases: 1 },
    { code: 'Split Shift Allowance', underpayment: 18.50, cases: 1 },
    { code: 'Meal Allowance', underpayment: 6.50, cases: 1 }
  ];

  const dayOfWeekBreakdown = [
    { day: 'Monday', amount: 12.00, height: 15 },
    { day: 'Tuesday', amount: 18.50, height: 23 },
    { day: 'Wednesday', amount: 42.00, height: 53 },
    { day: 'Thursday', amount: 26.50, height: 33 },
    { day: 'Friday', amount: 45.00, height: 56 },
    { day: 'Saturday', amount: 44.00, height: 55 },
    { day: 'Sunday', amount: 0, height: 0 }
  ];

  const siteBreakdown = [
    { site: 'BrightSteps Richmond', employees: 7, underpaid: 2, amount: 128.50 },
    { site: 'BrightSteps Carlton', employees: 5, underpaid: 1, amount: 59.50 }
  ];

  const recommendations = [
    {
      issue: 'Evening penalty windows misapplied',
      impact: 'High',
      recommendation: 'Review pay codes after 6pm to ensure evening penalty rates (110%) are applied correctly',
      action: 'Update payroll system rules for hours after 6pm on weekdays'
    },
    {
      issue: 'Weekend penalties missing',
      impact: 'Medium',
      recommendation: 'Validate Saturday/Sunday penalty rules in payroll system',
      action: 'Add automated validation checks for weekend shifts'
    },
    {
      issue: 'Split shift allowances inconsistent',
      impact: 'Low',
      recommendation: 'Clarify split shift definition in enterprise agreement',
      action: 'Train managers on split shift identification'
    }
  ];

  const exampleCases = [
    {
      id: 'E-014',
      name: 'Case A (Educator)',
      issue: 'Evening hours paid as ordinary',
      underpayment: 72.00,
      explanation: '6 hours worked between 6pm-9pm paid at ordinary rate instead of evening penalty rate (110%)',
      evidence: ['Timesheet: Wed 18:00-21:00', 'Payslip: Ordinary hours @ $28.50', 'Award Clause 25.3']
    },
    {
      id: 'E-041',
      name: 'Case B (Casual Educator)',
      issue: 'Saturday penalty missing',
      underpayment: 44.00,
      explanation: '4 hours on Saturday paid with casual loading only, missing Saturday penalty rate (150%)',
      evidence: ['Timesheet: Sat 09:00-13:00', 'Payslip: Casual ordinary @ $35.63', 'Award Clause 26.2']
    },
    {
      id: 'E-033',
      name: 'Case C (Part-time Educator)',
      issue: 'Split shift allowance',
      underpayment: 18.00,
      explanation: 'Two split shifts worked but meal allowance not paid per award requirements',
      evidence: ['Timesheet: 8am-12pm, 3pm-6pm', 'Award Clause 19.4']
    }
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
                <span>Reports & Insights</span>
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
            Back to Audit Results
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl mb-2">Reports & Insights</h1>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Organisation: <span className="text-foreground">BrightSteps Early Learning (VIC)</span></div>
                <div>Audit Request: <span className="text-foreground font-mono">AUD-2025-004</span></div>
                <div>Pay Period: <span className="text-foreground">01–14 Aug 2025</span></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="size-4" />
                <span className="hidden sm:inline">Executive Summary (PDF)</span>
                <span className="sm:hidden">Summary</span>
              </Button>
              <Button variant="outline" className="gap-2">
                <FileText className="size-4" />
                <span className="hidden sm:inline">Auditor Report (PDF)</span>
                <span className="sm:hidden">Report</span>
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="size-4" />
                <span className="hidden sm:inline">Remediation File (CSV)</span>
                <span className="sm:hidden">CSV</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Total Checked</CardDescription>
              <CardTitle className="text-2xl md:text-3xl">12</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs md:text-sm text-muted-foreground">Employees</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Underpaid</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-red-600">3</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs md:text-sm text-red-600">25% of total</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">Total Underpayment</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-red-600">$188.00</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs md:text-sm text-muted-foreground">Estimated liability</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs md:text-sm">% Needs Review</CardDescription>
              <CardTitle className="text-2xl md:text-3xl text-amber-600">17%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs md:text-sm text-amber-600">2 employees</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Root Cause Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Root Cause Distribution</CardTitle>
              <CardDescription>Most common underpayment issues in this audit</CardDescription>
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

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Average Underpayment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl text-red-600 mb-2">$62.67</div>
                <div className="text-sm text-muted-foreground">Per affected employee</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detection Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl mb-2">25%</div>
                <div className="text-sm text-muted-foreground">Of employees had issues</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Model Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl mb-2">78%</div>
                <div className="text-sm text-muted-foreground">Average across all cases</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Breakdowns */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Underpayment by Pay Code */}
          <Card>
            <CardHeader>
              <CardTitle>Underpayment by Pay Code</CardTitle>
              <CardDescription>Which payment types had the most issues</CardDescription>
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
                      <div className="text-red-600 font-medium">${item.underpayment.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Underpayment by Day of Week */}
          <Card>
            <CardHeader>
              <CardTitle>Underpayment by Day of Week</CardTitle>
              <CardDescription>When most issues occurred</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-end justify-between gap-2">
                {dayOfWeekBreakdown.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-xs text-red-600 font-medium">
                      {item.amount > 0 ? `$${item.amount.toFixed(0)}` : ''}
                    </div>
                    <div 
                      className={`w-full rounded-t transition-all ${
                        item.amount > 0 ? 'bg-red-500' : 'bg-muted'
                      }`}
                      style={{ height: `${item.height}%` }}
                    />
                    <div className="text-xs text-muted-foreground">{item.day.slice(0, 3)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Underpayment by Site */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Underpayment by Site</CardTitle>
            <CardDescription>Breakdown across locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {siteBreakdown.map((site, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="size-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{site.site}</div>
                        <div className="text-sm text-muted-foreground">
                          {site.employees} employees checked
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">Underpaid</div>
                        <div className="text-lg text-red-600 font-medium">{site.underpaid}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">Amount</div>
                        <div className="text-lg text-red-600 font-medium">${site.amount.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Most Common Payroll Mistakes & Recommendations</CardTitle>
            <CardDescription>Actionable insights to prevent future issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertCircle className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="font-medium">{rec.issue}</div>
                        <Badge variant={rec.impact === 'High' ? 'destructive' : rec.impact === 'Medium' ? 'secondary' : 'default'}>
                          {rec.impact} Impact
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        <strong>Recommendation:</strong> {rec.recommendation}
                      </div>
                      <div className="text-sm bg-blue-50 text-blue-900 p-2 rounded">
                        <strong>Action:</strong> {rec.action}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Example Cases */}
        <Card>
          <CardHeader>
            <CardTitle>Reason Examples</CardTitle>
            <CardDescription>3 anonymized cases with detailed explanations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exampleCases.map((example, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-muted-foreground">{example.id}</span>
                        <span className="font-medium">{example.name}</span>
                      </div>
                      <div className="text-sm text-red-700">{example.issue}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg text-red-600 font-medium">
                        −${example.underpayment.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm mb-3 p-3 bg-muted/50 rounded">
                    {example.explanation}
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground mb-2">Evidence:</div>
                    {example.evidence.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <ExternalLink className="size-3 text-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}