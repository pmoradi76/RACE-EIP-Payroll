import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { SeverityBadge } from '../design-system/SeverityBadge';
import { AnomalyScorePill } from '../design-system/AnomalyScorePill';
import { StatusBadge } from '../design-system/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { ArrowLeft, Download, FileText, Calendar, Building2, CheckCircle2, Clock, AlertCircle, Shield, Bell, LogOut } from 'lucide-react';

interface RequestDetailPageProps {
  requestId: string;
  onBack: () => void;
}

interface RequestData {
  id: string;
  payPeriod: string;
  orgType: string;
  orgName: string;
  submittedDate: string;
  status: 'done';
  severity: 'underpaid' | 'ok' | 'needs-review';
  paid: number;
  entitled: number;
  difference: number;
  anomalyScore?: number;
  confidence?: number;
  explanation?: string;
  calculationBreakdown: Array<{
    component: string;
    hours?: number;
    rate?: number;
    expected: number;
    paid: number;
    difference: number;
  }>;
  evidence: Array<{
    type: string;
    title: string;
    excerpt: string;
    reference: string;
    confidence: number;
  }>;
  timeline: Array<{
    time: string;
    event: string;
    agent: string;
    status?: 'done' | 'running' | 'pending';
  }>;
}

// Sample data for different request types
const requestDataMap: Record<string, RequestData> = {
  'REQ-2025-003': {
    id: 'REQ-2025-003',
    payPeriod: '01–14 Aug 2025',
    orgType: 'Childcare',
    orgName: 'BrightSteps Early Learning',
    submittedDate: '15 Aug 2025',
    status: 'done',
    severity: 'underpaid',
    paid: 540.00,
    entitled: 612.00,
    difference: -72.00,
    anomalyScore: 86,
    confidence: 0.86,
    explanation: 'You worked 2 hours after 6pm on 05 Aug 2025. These hours should have been paid at the evening rate ($34/hr) according to your contract and the Childcare Award, but your payslip shows they were paid at the ordinary rate ($28/hr).',
    calculationBreakdown: [
      { component: 'Ordinary hours', hours: 16.0, rate: 28.00, expected: 448.00, paid: 448.00, difference: 0 },
      { component: 'Evening hours (after 6pm)', hours: 2.0, rate: 34.00, expected: 68.00, paid: 56.00, difference: -12.00 },
      { component: 'Casual loading (25%)', expected: 129.00, paid: 36.00, difference: -60.00 }
    ],
    evidence: [
      {
        type: 'Contract',
        title: 'Evening rate clause',
        excerpt: 'Ordinary rate $28/hr; Evening rate $34/hr after 6pm',
        reference: 'Page 3, Clause 4.2',
        confidence: 0.93
      },
      {
        type: 'Worksheet',
        title: 'Shift on 05 Aug 2025',
        excerpt: '05 Aug 2025 | 18:00–20:00 (2 hours)',
        reference: 'Row 5',
        confidence: 0.95
      },
      {
        type: 'Payslip',
        title: 'Payment line item',
        excerpt: '18 hrs @ $28.00 = $504.00',
        reference: 'Line 2',
        confidence: 0.96
      },
      {
        type: 'Award',
        title: 'Children\'s Services Award 2010',
        excerpt: 'Evening Penalty – Clause 25.3 (p.12)',
        reference: 'MA000120, Clause 25.3',
        confidence: 0.99
      }
    ],
    timeline: [
      { time: '15 Aug 2025, 14:32:01', event: 'Request submitted', agent: 'System', status: 'done' },
      { time: '15 Aug 2025, 14:32:02', event: 'Documents uploaded', agent: 'System', status: 'done' },
      { time: '15 Aug 2025, 14:32:05', event: 'Award identified: Children\'s Services Award 2010', agent: 'Award Agent', status: 'done' },
      { time: '15 Aug 2025, 14:32:08', event: 'Contract parsed', agent: 'Contract Agent', status: 'done' },
      { time: '15 Aug 2025, 14:32:12', event: 'Shift data extracted', agent: 'Worksheet Agent', status: 'done' },
      { time: '15 Aug 2025, 14:32:15', event: 'Payment data extracted', agent: 'Payslip Agent', status: 'done' },
      { time: '15 Aug 2025, 14:32:20', event: 'Award clauses retrieved', agent: 'Retrieval Agent', status: 'done' },
      { time: '15 Aug 2025, 14:32:28', event: 'Entitlements calculated', agent: 'Calculator Agent', status: 'done' },
      { time: '15 Aug 2025, 14:32:35', event: 'Underpayment detected: -$72.00', agent: 'Underpayment Detector', status: 'done' },
      { time: '15 Aug 2025, 14:32:42', event: 'Explanation generated', agent: 'Explanation Agent', status: 'done' },
      { time: '15 Aug 2025, 14:32:45', event: 'Quality checks passed', agent: 'Guardrail Agent', status: 'done' },
      { time: '15 Aug 2025, 14:32:46', event: 'Analysis complete', agent: 'System', status: 'done' }
    ]
  },
  'REQ-2025-002': {
    id: 'REQ-2025-002',
    payPeriod: '15–31 Jul 2025',
    orgType: 'Childcare',
    orgName: 'BrightSteps Early Learning',
    submittedDate: '01 Aug 2025',
    status: 'done',
    severity: 'ok',
    paid: 1024.00,
    entitled: 1024.00,
    difference: 0,
    explanation: 'Your pay for this period matches your contract and the applicable award. All rates and loadings have been correctly applied.',
    calculationBreakdown: [
      { component: 'Ordinary hours', hours: 20.0, rate: 28.00, expected: 560.00, paid: 560.00, difference: 0 },
      { component: 'Weekend hours (Saturday)', hours: 8.0, rate: 35.00, expected: 280.00, paid: 280.00, difference: 0 },
      { component: 'Casual loading (25%)', expected: 184.00, paid: 184.00, difference: 0 }
    ],
    evidence: [
      {
        type: 'Contract',
        title: 'Rate schedule',
        excerpt: 'Ordinary rate $28/hr; Saturday rate $35/hr',
        reference: 'Page 3, Clause 4.1-4.2',
        confidence: 0.95
      },
      {
        type: 'Worksheet',
        title: 'All shifts for period',
        excerpt: '20 hrs ordinary, 8 hrs Saturday',
        reference: 'Summary',
        confidence: 0.97
      },
      {
        type: 'Payslip',
        title: 'Payment breakdown',
        excerpt: '$1,024.00 total with correct loadings',
        reference: 'Total line',
        confidence: 0.98
      },
      {
        type: 'Award',
        title: 'Children\'s Services Award 2010',
        excerpt: 'Saturday penalty rates – Clause 25.4',
        reference: 'MA000120, Clause 25.4',
        confidence: 0.99
      }
    ],
    timeline: [
      { time: '01 Aug 2025, 09:15:22', event: 'Request submitted', agent: 'System', status: 'done' },
      { time: '01 Aug 2025, 09:15:23', event: 'Documents uploaded', agent: 'System', status: 'done' },
      { time: '01 Aug 2025, 09:15:26', event: 'Award identified', agent: 'Award Agent', status: 'done' },
      { time: '01 Aug 2025, 09:15:29', event: 'Contract parsed', agent: 'Contract Agent', status: 'done' },
      { time: '01 Aug 2025, 09:15:33', event: 'Shift data extracted', agent: 'Worksheet Agent', status: 'done' },
      { time: '01 Aug 2025, 09:15:36', event: 'Payment data extracted', agent: 'Payslip Agent', status: 'done' },
      { time: '01 Aug 2025, 09:15:42', event: 'Entitlements calculated', agent: 'Calculator Agent', status: 'done' },
      { time: '01 Aug 2025, 09:15:48', event: 'Payment verified as correct', agent: 'Underpayment Detector', status: 'done' },
      { time: '01 Aug 2025, 09:15:50', event: 'Quality checks passed', agent: 'Guardrail Agent', status: 'done' },
      { time: '01 Aug 2025, 09:15:51', event: 'Analysis complete', agent: 'System', status: 'done' }
    ]
  },
  'REQ-2025-001': {
    id: 'REQ-2025-001',
    payPeriod: '01–14 Jul 2025',
    orgType: 'Childcare',
    orgName: 'BrightSteps Early Learning',
    submittedDate: '16 Jul 2025',
    status: 'done',
    severity: 'ok',
    paid: 896.00,
    entitled: 896.00,
    difference: 0,
    explanation: 'Your pay for this period matches your contract and the applicable award. All rates and loadings have been correctly applied.',
    calculationBreakdown: [
      { component: 'Ordinary hours', hours: 16.0, rate: 28.00, expected: 448.00, paid: 448.00, difference: 0 },
      { component: 'Casual loading (25%)', expected: 112.00, paid: 112.00, difference: 0 }
    ],
    evidence: [
      {
        type: 'Contract',
        title: 'Rate schedule',
        excerpt: 'Ordinary rate $28/hr',
        reference: 'Page 3, Clause 4.1',
        confidence: 0.94
      },
      {
        type: 'Worksheet',
        title: 'All shifts for period',
        excerpt: '16 hrs ordinary time',
        reference: 'Summary',
        confidence: 0.96
      },
      {
        type: 'Payslip',
        title: 'Payment breakdown',
        excerpt: '$896.00 total with casual loading',
        reference: 'Total line',
        confidence: 0.97
      },
      {
        type: 'Award',
        title: 'Children\'s Services Award 2010',
        excerpt: 'Casual loading 25% – Clause 12.2',
        reference: 'MA000120, Clause 12.2',
        confidence: 0.99
      }
    ],
    timeline: [
      { time: '16 Jul 2025, 11:22:10', event: 'Request submitted', agent: 'System', status: 'done' },
      { time: '16 Jul 2025, 11:22:11', event: 'Documents uploaded', agent: 'System', status: 'done' },
      { time: '16 Jul 2025, 11:22:14', event: 'Award identified', agent: 'Award Agent', status: 'done' },
      { time: '16 Jul 2025, 11:22:17', event: 'Contract parsed', agent: 'Contract Agent', status: 'done' },
      { time: '16 Jul 2025, 11:22:21', event: 'Shift data extracted', agent: 'Worksheet Agent', status: 'done' },
      { time: '16 Jul 2025, 11:22:24', event: 'Payment data extracted', agent: 'Payslip Agent', status: 'done' },
      { time: '16 Jul 2025, 11:22:30', event: 'Entitlements calculated', agent: 'Calculator Agent', status: 'done' },
      { time: '16 Jul 2025, 11:22:36', event: 'Payment verified as correct', agent: 'Underpayment Detector', status: 'done' },
      { time: '16 Jul 2025, 11:22:38', event: 'Quality checks passed', agent: 'Guardrail Agent', status: 'done' },
      { time: '16 Jul 2025, 11:22:39', event: 'Analysis complete', agent: 'System', status: 'done' }
    ]
  }
};

export function RequestDetailPage({ requestId, onBack }: RequestDetailPageProps) {
  const request = requestDataMap[requestId] || requestDataMap['REQ-2025-003'];
  const isUnderpaid = request.severity === 'underpaid';

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="size-7 text-primary" />
                <span className="text-xl">PayGuard</span>
              </div>
              <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
                <span>/</span>
                <span>Request Details</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
              </Button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="text-right hidden sm:block">
                  <div className="text-sm">Ava Nguyen</div>
                  <div className="text-xs text-muted-foreground">Employee</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                  AN
                </div>
                <Button variant="ghost" size="icon">
                  <LogOut className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4 gap-2">
            <ArrowLeft className="size-4" />
            Back to My Requests
          </Button>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl mb-2">Pay Check Verification – Request Details</h1>
              <p className="text-muted-foreground">Review the complete analysis for this pay period</p>
            </div>
          </div>

          {/* Metadata Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Request ID</div>
                  <code className="text-sm">{request.id}</code>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Organisation</div>
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-muted-foreground" />
                    <span className="text-sm">{request.orgType}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Pay Period</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-sm">{request.payPeriod}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Submitted</div>
                  <div className="text-sm">{request.submittedDate}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <div className="flex gap-2">
                    <StatusBadge status={request.status} size="sm" />
                    <SeverityBadge severity={request.severity} size="sm" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="calculation">Calculation Details</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            {/* Comparison Card */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <div className="text-sm text-muted-foreground mb-1">You Were Paid</div>
                  <CardTitle className="text-3xl">${request.paid.toFixed(2)}</CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="text-sm text-muted-foreground mb-1">You're Entitled To</div>
                  <CardTitle className={`text-3xl ${isUnderpaid ? 'text-green-600' : ''}`}>
                    ${request.entitled.toFixed(2)}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className={isUnderpaid ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                <CardHeader>
                  <div className={`text-sm mb-1 ${isUnderpaid ? 'text-red-900' : 'text-green-900'}`}>
                    Difference
                  </div>
                  <CardTitle className={`text-3xl ${isUnderpaid ? 'text-red-600' : 'text-green-600'}`}>
                    {request.difference < 0 ? '−' : ''}${Math.abs(request.difference).toFixed(2)}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <SeverityBadge severity={request.severity} size="sm" />
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Anomaly Score (only for underpaid) */}
            {isUnderpaid && request.anomalyScore && request.confidence && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Detection Confidence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Anomaly Score</span>
                    <AnomalyScorePill score={request.anomalyScore} showLabel={true} size="md" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">AI Confidence</span>
                      <span className="text-sm">{(request.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={request.confidence * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Explanation */}
            <Card className={isUnderpaid ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  {isUnderpaid ? (
                    <>
                      <AlertCircle className="size-5 text-red-600" />
                      <span>What We Found</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-5 text-green-600" />
                      <span>Payment Verified</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm leading-relaxed ${isUnderpaid ? 'text-red-900' : 'text-green-900'}`}>
                  {request.explanation}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculation Details Tab */}
          <TabsContent value="calculation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Line-Item Calculation Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pay Component</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Expected Amount</TableHead>
                      <TableHead className="text-right">Paid Amount</TableHead>
                      <TableHead className="text-right">Difference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {request.calculationBreakdown.map((item, index) => (
                      <TableRow 
                        key={index}
                        className={item.difference < 0 ? 'bg-red-50' : ''}
                      >
                        <TableCell>
                          {item.difference < 0 && (
                            <AlertCircle className="inline size-4 text-red-600 mr-2" />
                          )}
                          {item.component}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.hours ? item.hours.toFixed(1) : '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.rate ? `$${item.rate.toFixed(2)}` : '—'}
                        </TableCell>
                        <TableCell className="text-right">${item.expected.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${item.paid.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          {item.difference !== 0 ? (
                            <span className={item.difference < 0 ? 'text-red-600' : 'text-green-600'}>
                              {item.difference < 0 ? '−' : '+'}${Math.abs(item.difference).toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">$0.00</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2">
                      <TableCell><strong>Total</strong></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right"><strong>${request.entitled.toFixed(2)}</strong></TableCell>
                      <TableCell className="text-right"><strong>${request.paid.toFixed(2)}</strong></TableCell>
                      <TableCell className="text-right">
                        <strong className={request.difference < 0 ? 'text-red-600' : 'text-green-600'}>
                          {request.difference < 0 ? '−' : ''}${Math.abs(request.difference).toFixed(2)}
                        </strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <p className="text-sm text-amber-900">
                  <strong>Note:</strong> All calculations are based on your employment contract, 
                  the Children's Services Award 2010 (MA000120), and Victorian legislation. 
                  Rates shown include applicable loadings and penalties.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evidence Tab */}
          <TabsContent value="evidence" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Evidence List */}
              <div className="space-y-3">
                <h4 className="text-sm mb-3">Evidence Items</h4>
                {request.evidence.map((item, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                              {item.type}
                            </span>
                            <span className="text-xs text-muted-foreground">{item.reference}</span>
                          </div>
                          <div className="text-sm mb-2">{item.title}</div>
                          <div className="text-xs text-muted-foreground italic mb-2">
                            "{item.excerpt}"
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-3 text-green-600" />
                            <span className="text-xs text-green-600">
                              {(item.confidence * 100).toFixed(0)}% confident
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Document Viewer */}
              <div>
                <h4 className="text-sm mb-3">Document Viewer</h4>
                <div className="border border-border rounded-lg bg-muted/30 aspect-[3/4] flex items-center justify-center sticky top-24">
                  <div className="text-center text-muted-foreground">
                    <FileText className="size-12 mx-auto mb-2" />
                    <p className="text-sm">Click an evidence item to view</p>
                    <p className="text-xs mt-1">Highlighted sections will be shown</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Agent Execution Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {request.timeline.map((entry, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                      <div className="text-xs text-muted-foreground w-32 flex-shrink-0 pt-0.5">
                        {entry.time}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm mb-1">{entry.event}</div>
                        <div className="text-xs text-muted-foreground">{entry.agent}</div>
                      </div>
                      {entry.event.includes('complete') || entry.event.includes('passed') || entry.event.includes('verified') ? (
                        <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : entry.event.includes('detected') && isUnderpaid ? (
                        <AlertCircle className="size-4 text-red-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Clock className="size-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={isUnderpaid ? 'border-amber-200 bg-amber-50' : 'border-green-200 bg-green-50'}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  {isUnderpaid ? (
                    <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className={`text-sm ${isUnderpaid ? 'text-amber-900' : 'text-green-900'}`}>
                    <strong>Analysis Complete:</strong> All agents completed successfully and 
                    the Guardrail Agent confirmed the analysis meets quality standards.
                    Processing time: {Math.floor(Math.random() * 30 + 30)} seconds.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-border mt-6">
          <Button size="lg" className="gap-2">
            <Download className="size-4" />
            Download Evidence Pack (PDF)
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Download className="size-4" />
            Download Calculation (CSV)
          </Button>
          <Button variant="outline" size="lg" onClick={onBack} className="gap-2">
            <ArrowLeft className="size-4" />
            Back to My Requests
          </Button>
        </div>
      </main>
    </div>
  );
}