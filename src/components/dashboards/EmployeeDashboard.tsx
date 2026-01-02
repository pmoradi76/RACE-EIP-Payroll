import { EmployeeDashboardShell } from '../shells/EmployeeDashboardShell';
import { PageHeader } from '../design-system/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { StatusBadge } from '../design-system/StatusBadge';
import { SeverityBadge } from '../design-system/SeverityBadge';
import { AnomalyScorePill } from '../design-system/AnomalyScorePill';
import { Upload, TrendingUp, AlertCircle, CheckCircle2, DollarSign, Calendar, MessageCircle, FileText, Cpu, Clock, Send, Sparkles, BookOpen, Database } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { EmptyState } from '../design-system/EmptyState';
import { useState } from 'react';

export function EmployeeDashboard() {
  const [chatMessage, setChatMessage] = useState('');
  
  // Sample data for Ava Nguyen
  const latestResult = {
    period: '01–14 Aug 2025',
    paid: 540,
    entitled: 612,
    underpayment: -72,
    status: 'done' as const,
    severity: 'underpaid' as const,
    processedDate: '16 Aug 2025, 10:42 AM'
  };

  const requests = [
    {
      id: 'REQ-2025-003',
      payPeriod: '01–14 Aug 2025',
      orgType: 'Childcare',
      status: 'done' as const,
      severity: 'underpaid' as const,
      underpayment: -72,
      submittedDate: '15 Aug 2025'
    },
    {
      id: 'REQ-2025-002',
      payPeriod: '15–31 Jul 2025',
      orgType: 'Childcare',
      status: 'done' as const,
      severity: 'ok' as const,
      underpayment: 0,
      submittedDate: '01 Aug 2025'
    },
    {
      id: 'REQ-2025-001',
      payPeriod: '01–14 Jul 2025',
      orgType: 'Childcare',
      status: 'done' as const,
      severity: 'ok' as const,
      underpayment: 0,
      submittedDate: '16 Jul 2025'
    }
  ];

  const agentActivity = [
    { agent: 'Underpayment Detector', timestamp: '16 Aug 2025, 10:42 AM', status: 'done' as const },
    { agent: 'Calculator Agent', timestamp: '16 Aug 2025, 10:41 AM', status: 'done' as const },
    { agent: 'Payslip Agent', timestamp: '16 Aug 2025, 10:40 AM', status: 'done' as const },
    { agent: 'Worksheet Agent', timestamp: '16 Aug 2025, 10:39 AM', status: 'done' as const }
  ];

  const suggestedQuestions = [
    "What are my entitlements for evening shifts?",
    "How is casual loading calculated?",
    "What's the penalty rate for weekends in childcare?",
    "Am I entitled to meal breaks?"
  ];

  const hasRequests = requests.length > 0;

  return (
    <EmployeeDashboardShell>
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <PageHeader 
            title="Welcome back, Ava"
            description="BrightSteps Early Learning • Casual Educator"
            actions={
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <MessageCircle className="size-4" />
                  Chat with Award Assistant
                </Button>
                <Button className="gap-2">
                  <Upload className="size-4" />
                  New Pay Check Request
                </Button>
              </div>
            }
          />

          {/* Latest Result Card */}
          {hasRequests && (
            <Card className="mb-6 border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Latest Result</CardTitle>
                    <CardDescription>Pay period: {latestResult.period}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge status={latestResult.status} size="sm" />
                    <SeverityBadge severity={latestResult.severity} size="sm" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Paid</div>
                    <div className="text-2xl">${latestResult.paid.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Entitled</div>
                    <div className="text-2xl text-green-600">${latestResult.entitled.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Shortfall</div>
                    <div className="text-2xl text-red-600">{latestResult.underpayment < 0 ? '−' : ''}${Math.abs(latestResult.underpayment).toFixed(2)}</div>
                  </div>
                </div>

                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="size-5 text-red-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <h4 className="mb-1 text-sm">Issue Detected</h4>
                      <p className="text-sm text-muted-foreground">
                        2 hours worked after 6pm on Monday 05 Aug were paid at ordinary rate instead of evening rate (25% loading).
                      </p>
                    </div>
                    <Button size="sm">View Evidence</Button>
                  </div>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  Processed: {latestResult.processedDate}
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Requests Table */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Requests</CardTitle>
                  <CardDescription>Your pay check verification history</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <FileText className="size-4" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {hasRequests ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Pay Period</TableHead>
                      <TableHead>Org Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Underpayment</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <code className="text-sm">{request.id}</code>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-muted-foreground" />
                            {request.payPeriod}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.orgType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <StatusBadge status={request.status} size="sm" />
                            <SeverityBadge severity={request.severity} size="sm" />
                          </div>
                        </TableCell>
                        <TableCell>
                          {request.underpayment !== 0 ? (
                            <span className="text-red-600">
                              −${Math.abs(request.underpayment)}
                            </span>
                          ) : (
                            <span className="text-green-600">$0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {request.submittedDate}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <EmptyState 
                  icon={FileText}
                  title="No requests yet"
                  description="Upload your contract, timesheet, and payslip to verify your pay entitlements"
                  action={
                    <Button className="gap-2">
                      <Upload className="size-4" />
                      Start First Check
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Award Pack Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Award Pack</CardTitle>
                    <CardDescription>Your applicable Fair Work Award</CardDescription>
                  </div>
                  <StatusBadge status="done" label="Ready" size="sm" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Selected Sector</div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-blue-50 p-2">
                      <BookOpen className="size-4 text-blue-600" />
                    </div>
                    <div>
                      <div>Childcare</div>
                      <div className="text-xs text-muted-foreground">Children's Services Award 2010</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Award Source</div>
                    <div className="text-sm">Fair Work Commission</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                    <div className="text-sm">01 Jul 2025</div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="size-4 text-muted-foreground" />
                    <span className="text-sm">Knowledge Base Status</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-green-600" />
                      <span className="text-sm">Ready for queries</span>
                    </div>
                    <span className="text-xs text-muted-foreground">482 clauses indexed</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full gap-2">
                  <MessageCircle className="size-4" />
                  Ask About My Award
                </Button>
              </CardContent>
            </Card>

            {/* Agent Activity Panel */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Agent Activity</CardTitle>
                    <CardDescription>Last run agents for your latest request</CardDescription>
                  </div>
                  <Cpu className="size-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="text-sm mb-1">{activity.agent}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          {activity.timestamp}
                        </div>
                      </div>
                      <StatusBadge status={activity.status} size="sm" showIcon={false} />
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <Button variant="outline" className="w-full text-sm">
                    View Full Pipeline
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardDescription>Total Checks Run</CardDescription>
                <CardTitle className="text-3xl">{requests.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="size-4" />
                  <span>All time</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Issues Detected</CardDescription>
                <CardTitle className="text-3xl text-red-600">1</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="size-4" />
                  <span>Requires attention</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>Total Underpayment</CardDescription>
                <CardTitle className="text-3xl text-red-600">$72</CardTitle>
              </CardHeader>
              <CardContent>
                <Button size="sm" variant="outline" className="w-full">Download Evidence</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar - Chatbot Panel */}
        <div className="w-80 shrink-0 hidden xl:block">
          <Card className="sticky top-6">
            <CardHeader className="border-b border-border bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary p-2">
                  <Sparkles className="size-4 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-base">Award Assistant</CardTitle>
                  <CardDescription className="text-xs">Ask me about your entitlements</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {/* Suggested Questions */}
              <div className="mb-4">
                <div className="text-sm mb-3">💡 Suggested questions:</div>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-3 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors border border-border"
                      onClick={() => setChatMessage(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages Preview */}
              <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border min-h-[200px] max-h-[300px] overflow-y-auto">
                <div className="text-sm text-muted-foreground text-center py-8">
                  No messages yet. Select a question above or type your own.
                </div>
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Input 
                  placeholder="Ask about your award..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon">
                  <Send className="size-4" />
                </Button>
              </div>

              <div className="mt-3 text-xs text-muted-foreground text-center">
                Powered by RAG + Children's Services Award 2010
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EmployeeDashboardShell>
  );
}