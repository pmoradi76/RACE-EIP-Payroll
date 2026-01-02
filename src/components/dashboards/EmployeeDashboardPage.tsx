import { useState } from 'react';
import { PageHeader } from '../design-system/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { StatusBadge } from '../design-system/StatusBadge';
import { SeverityBadge } from '../design-system/SeverityBadge';
import { Upload, AlertCircle, CheckCircle2, Calendar, MessageCircle, FileText, Cpu, Clock, Send, Sparkles, BookOpen, Database, TrendingUp, Shield, Bell, LogOut } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { EmptyState } from '../design-system/EmptyState';
import { PayCheckWizard } from '../employee/PayCheckWizard';
import { RequestDetailPage } from '../employee/RequestDetailPage';
import { AwardChatPage } from '../employee/AwardChatPage';

interface EmployeeDashboardPageProps {
  onLogout: () => void;
}

export function EmployeeDashboardPage({ onLogout }: EmployeeDashboardPageProps) {
  const [chatMessage, setChatMessage] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [viewingRequestId, setViewingRequestId] = useState<string | null>(null);
  const [showAwardChat, setShowAwardChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>>([
    {
      role: 'assistant',
      content: 'Hi Ava! I\'m your Award Assistant. I can help you understand your entitlements under the Children\'s Services Award 2010. What would you like to know?',
      timestamp: '10:30 AM'
    }
  ]);
  
  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: chatMessage,
      timestamp: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = getAIResponse(chatMessage);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 800);
  };
  
  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('evening') || lowerQuestion.includes('after 6pm')) {
      return '**Evening Penalty Rates** (After 6pm on weekdays):\n\nUnder the Children\'s Services Award 2010, Clause 25.3:\n\n• **Casual employees** working after 6pm on weekdays receive **110% of the ordinary rate**\n• This is **in addition** to your 25% casual loading\n• So your evening rate = Base rate × 1.10 × 1.25\n\n**Example for you:**\nIf your base rate is $28.50/hr:\n• Evening rate: $28.50 × 1.10 × 1.25 = **$39.22/hr**\n\n📎 Source: Clause 25.3 - Evening work penalties';
    }
    
    if (lowerQuestion.includes('casual loading') || lowerQuestion.includes('casual')) {
      return '**Casual Loading** under Children\'s Services Award:\n\nAs a casual employee, you\'re entitled to:\n• **25% loading** on all hours worked\n• This compensates for no paid leave entitlements\n\n**Applied to all rates:**\n✓ Ordinary hours: Base + 25%\n✓ Evening work: (Base × 1.10) + 25%\n✓ Weekend work: (Base × penalty) + 25%\n\n📎 Source: Clause 12.2 - Casual employment';
    }
    
    if (lowerQuestion.includes('weekend') || lowerQuestion.includes('saturday') || lowerQuestion.includes('sunday')) {
      return '**Weekend Penalty Rates** for Casual Educators:\n\n**Saturday:**\n• 150% of ordinary rate + 25% casual loading\n• For you: $28.50 × 1.50 × 1.25 = **$53.44/hr**\n\n**Sunday:**\n• 200% of ordinary rate + 25% casual loading  \n• For you: $28.50 × 2.00 × 1.25 = **$71.25/hr**\n\n**Public Holidays:**\n• 250% of ordinary rate + 25% casual loading\n• For you: $28.50 × 2.50 × 1.25 = **$89.06/hr**\n\n📎 Source: Clauses 25.4, 25.5, 26.1 - Penalty rates';
    }
    
    if (lowerQuestion.includes('meal break') || lowerQuestion.includes('break')) {
      return '**Meal Breaks & Allowances:**\n\n**Unpaid meal breaks:**\n• 30-60 minutes after 5 hours of work\n• You don\'t get paid during this time\n\n**Meal allowance:**\n• If working overtime and not given reasonable notice\n• Allowance: **$15.20** per occasion\n\n**Paid rest breaks:**\n• 10 minutes for shifts 4+ hours\n• 20 minutes for shifts 7+ hours\n\n📎 Source: Clause 28 - Breaks and allowances';
    }
    
    if (lowerQuestion.includes('split shift')) {
      return '**Split Shift Allowance:**\n\nIf you work 2 separate shifts in one day with a break of more than 1 hour between them:\n\n• You\'re entitled to **$18.50 per day** split shift allowance\n• This is **in addition** to your normal pay and loadings\n\n**Example:**\nIf you work:\n• 7am-11am (4 hours)\n• Break from 11am-3pm\n• 3pm-6pm (3 hours)\n\nYou get: 7 hours pay + casual loading + penalties + **$18.50 split shift allowance**\n\n📎 Source: Clause 19.4 - Split shift allowance';
    }
    
    // Default response
    return `Great question! Based on the Children\'s Services Award 2010, here\'s what I found:\n\nI can help you with specific information about:\n• Penalty rates (evening, weekend, public holiday)\n• Casual loading calculations\n• Allowances (meal, split shift, first aid)\n• Break entitlements\n• Minimum shift lengths\n• Notice periods\n\nCould you be more specific about what aspect you\'d like to know? For example:\n• "What are my entitlements for evening shifts?"\n• "How is casual loading calculated?"\n• "What breaks am I entitled to?"\n\n📎 All answers are sourced from the official Fair Work Award.`;
  };
  
  const handleQuestionClick = (question: string) => {
    setChatMessage(question);
    handleSendMessage();
  };
  
  // If showing award chat, render that page
  if (showAwardChat) {
    return <AwardChatPage onBack={() => setShowAwardChat(false)} />;
  }
  
  // If viewing a request, show the detail page
  if (viewingRequestId) {
    return (
      <RequestDetailPage 
        requestId={viewingRequestId}
        onBack={() => setViewingRequestId(null)}
      />
    );
  }

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
                <span>Employee Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="text-right hidden sm:block">
                  <div className="text-sm">Ava Nguyen</div>
                  <div className="text-xs text-muted-foreground">Employee</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                  AN
                </div>
                <Button variant="ghost" size="icon" onClick={onLogout}>
                  <LogOut className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <PageHeader 
              title="Welcome back, Ava"
              description="BrightSteps Early Learning • Casual Educator"
              actions={
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2" onClick={() => setShowAwardChat(true)}>
                    <MessageCircle className="size-4" />
                    Chat with Award Assistant
                  </Button>
                  <Button className="gap-2" onClick={() => setShowWizard(true)}>
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
                            <Button size="sm" variant="ghost" onClick={() => setViewingRequestId(request.id)}>View</Button>
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
            <Card className="sticky top-24">
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
                        onClick={() => handleQuestionClick(question)}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Messages Preview */}
                <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border min-h-[600px] max-h-[700px] overflow-y-auto space-y-3">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground p-3' 
                          : 'bg-white border border-border p-3'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {message.role === 'assistant' && (
                            <Sparkles className="size-3 text-primary" />
                          )}
                          <span className="text-xs font-medium">
                            {message.role === 'user' ? 'You' : 'Award Assistant'}
                          </span>
                          <span className="text-xs text-muted-foreground ml-auto">{message.timestamp}</span>
                        </div>
                        <div className="text-sm whitespace-pre-line leading-relaxed">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <Input 
                    placeholder="Ask about your award..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSendMessage}>
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
      </main>
      
      {/* Pay Check Wizard Modal */}
      {showWizard && (
        <PayCheckWizard onClose={() => setShowWizard(false)} />
      )}
    </div>
  );
}