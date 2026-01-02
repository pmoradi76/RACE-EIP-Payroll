import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Shield, Bell, LogOut, Sparkles, Send, Upload, BookOpen, FileText, CheckCircle2, Info, Paperclip, ArrowLeft } from 'lucide-react';
import { AwardPackSetupModal } from './AwardPackSetupModal';
import { KnowledgeBaseBuildingScreen } from './KnowledgeBaseBuildingScreen';
import { DocumentUploadModal } from './DocumentUploadModal';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{
    text: string;
    reference: string;
  }>;
}

interface AwardChatPageProps {
  onBack?: () => void;
}

export function AwardChatPage({ onBack }: AwardChatPageProps) {
  const [setupComplete, setSetupComplete] = useState(true); // Changed to true for demo - chat works immediately
  const [showSetupModal, setShowSetupModal] = useState(false); // Changed to false
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildingData, setBuildingData] = useState<{ orgType: string; orgName: string } | null>(null);
  const [useContractContext, setUseContractContext] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedContract, setUploadedContract] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Award Assistant. I can help you understand your workplace rights under the Children\'s Services Award 2010. What would you like to know?',
      citations: []
    }
  ]);

  const suggestedPrompts = [
    "What are penalty rates after 6pm in childcare?",
    "Do I get allowances for split shifts?",
    "What evidence do I need to raise an underpayment issue?",
    "How are evening hours defined under my award?"
  ];

  const handleSetupConfirm = (data: { orgType: string; orgName: string }) => {
    setShowSetupModal(false);
    setIsBuilding(true);
    setBuildingData(data);
  };

  const handleBuildingComplete = () => {
    setIsBuilding(false);
    setSetupComplete(true);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: messageInput
    };

    // Generate more varied AI responses
    const responses = [
      // Penalty rates & evening
      {
        keywords: ['penalty', '6pm', 'evening', 'after hours', 'night'],
        response: {
          content: 'Under the Children\'s Services Award, hours worked after 6pm are paid at the evening rate. For your role, this is typically higher than the ordinary rate. Evening hours are classified as any time worked between 6pm and midnight on a weekday. The exact rate depends on your employment type (full-time, part-time, or casual).',
          citations: [
            { text: 'Evening penalty window', reference: 'Award p.12, Clause 25.3' },
            { text: 'Casual loading interaction', reference: 'Award p.15, Clause 12.2' }
          ]
        }
      },
      // Overtime
      {
        keywords: ['overtime', 'extra hours', 'over time', 'work longer'],
        response: {
          content: 'Overtime applies when you work beyond your ordinary hours. For full-time employees in childcare, this typically means more than 38 hours per week. Overtime is paid at time-and-a-half for the first 2 hours, then double time thereafter. Casual employees generally receive their casual loading instead of overtime rates.',
          citations: [
            { text: 'Overtime rates', reference: 'Award p.14, Clause 28.1' },
            { text: 'Ordinary hours definition', reference: 'Award p.9, Clause 24.1' }
          ]
        }
      },
      // Leave entitlements
      {
        keywords: ['leave', 'sick', 'annual', 'vacation', 'time off', 'pto'],
        response: {
          content: 'As a permanent employee, you\'re entitled to 4 weeks of annual leave and 10 days of personal/carer\'s leave per year. Casual employees don\'t receive paid leave, but this is compensated through the 25% casual loading. Leave accrues progressively throughout the year and can be taken after agreement with your employer.',
          citations: [
            { text: 'Annual leave entitlement', reference: 'Award p.22, Clause 33' },
            { text: 'Personal/carer\'s leave', reference: 'Award p.24, Clause 35' },
            { text: 'Casual loading in lieu', reference: 'Award p.11, Clause 12.2' }
          ]
        }
      },
      // Public holidays
      {
        keywords: ['public holiday', 'holiday pay', 'christmas', 'easter'],
        response: {
          content: 'If you work on a public holiday, you\'re entitled to penalty rates of 250% of your base rate (or 275% for casual employees including loading). If you\'re rostered off on a public holiday, permanent employees still receive their ordinary pay. You may also be entitled to substitute days if a public holiday falls on your usual day off.',
          citations: [
            { text: 'Public holiday rates', reference: 'Award p.16, Clause 30.3' },
            { text: 'Public holiday definitions', reference: 'Award p.15, Clause 30.1' }
          ]
        }
      },
      // Contract vs upload
      {
        keywords: ['contract', 'upload', 'document', 'my agreement'],
        response: {
          content: 'Yes! Uploading your contract allows me to check how your specific pay rates interact with the award. I can compare your contracted rates with the award minimums and explain any differences. You can upload PDFs or Word documents using the "Upload Supporting Document" button on the left.',
          citations: [
            { text: 'Contract vs Award rates', reference: 'Award p.8, Clause 17.1' }
          ]
        }
      },
      // Split shifts
      {
        keywords: ['split shift', 'allowance', 'broken shift', 'split'],
        response: {
          content: 'Yes, employees working split shifts (where there is an unpaid break of more than one hour) are entitled to a split shift allowance. Under the Children\'s Services Award, this allowance compensates you for the inconvenience of returning to work the same day. The current allowance is updated annually and shown in Schedule B.',
          citations: [
            { text: 'Split shift allowance', reference: 'Award p.18, Clause 19.4' },
            { text: 'Allowance rates table', reference: 'Award p.45, Schedule B' }
          ]
        }
      },
      // Evidence/underpayment
      {
        keywords: ['evidence', 'underpayment', 'underpaid', 'proof', 'documentation'],
        response: {
          content: 'To raise an underpayment issue, you\'ll need: (1) Your employment contract showing agreed rates, (2) Timesheets or rosters showing hours worked, (3) Payslips showing what you were paid, and (4) Your award classification. The PayGuard system can analyze these documents and generate a detailed evidence pack if underpayment is detected.',
          citations: [
            { text: 'Record keeping requirements', reference: 'Award p.32, Clause 42.1' },
            { text: 'Dispute resolution', reference: 'Award p.35, Clause 9' }
          ]
        }
      },
      // Minimum wage
      {
        keywords: ['minimum', 'rate', 'wage', 'how much', 'salary'],
        response: {
          content: 'Minimum rates depend on your classification level (Children\'s Services Employee Levels 1-8) and employment type. For example, Level 3 educators earn different rates than Level 5 coordinators. The award includes minimum rates for full-time, part-time, and casual employees. Would you like me to explain your specific classification?',
          citations: [
            { text: 'Classification structure', reference: 'Award p.40, Schedule A' },
            { text: 'Minimum wage rates', reference: 'Award p.42, Schedule C' }
          ]
        }
      },
      // Breaks/meal breaks
      {
        keywords: ['break', 'lunch', 'meal', 'rest'],
        response: {
          content: 'You\'re entitled to a 30-minute unpaid meal break if you work more than 5 hours continuously. For shifts longer than 10 hours, you\'re entitled to an additional 20-minute break. Rest breaks (tea breaks) of 10 minutes are paid and provided for shifts of 4 hours or more. These must be taken at times that don\'t disrupt child supervision ratios.',
          citations: [
            { text: 'Meal breaks', reference: 'Award p.13, Clause 27.2' },
            { text: 'Rest breaks', reference: 'Award p.13, Clause 27.1' }
          ]
        }
      },
      // Casual loading
      {
        keywords: ['casual loading', 'casual rate', 'casual', 'loading'],
        response: {
          content: 'As a casual employee, you receive a 25% loading on top of the base rate to compensate for not receiving paid leave and other entitlements. This loading is calculated on your ordinary rate and applies to all hours worked, including penalty rates. For example, if your base rate is $28/hr, your casual rate would be $35/hr.',
          citations: [
            { text: 'Casual loading rate', reference: 'Award p.11, Clause 12.2' },
            { text: 'Casual employment definition', reference: 'Award p.10, Clause 12.1' }
          ]
        }
      }
    ];

    // Find matching response based on keywords
    let assistantResponse: Message | null = null;
    const lowerInput = messageInput.toLowerCase();
    
    for (const item of responses) {
      if (item.keywords.some(keyword => lowerInput.includes(keyword))) {
        assistantResponse = {
          role: 'assistant',
          ...item.response
        };
        break;
      }
    }

    // Default response if no match
    if (!assistantResponse) {
      const topics = [
        'pay rates and classifications',
        'penalty rates (evening, weekend, public holidays)',
        'leave entitlements',
        'overtime calculations',
        'casual loading',
        'break entitlements',
        'allowances',
        'underpayment issues'
      ];
      
      assistantResponse = {
        role: 'assistant',
        content: `I can help you with questions about: ${topics.join(', ')}. Could you ask about one of these topics, or rephrase your question? For example, you might ask "What are my overtime rates?" or "How much annual leave do I get?"`,
        citations: [
          { text: 'Award coverage', reference: 'Award p.3, Clause 4.1' }
        ]
      };
    }

    setMessages([...messages, userMessage, assistantResponse]);
    setMessageInput('');
  };

  const handleDocumentUpload = (fileName: string) => {
    setUploadedContract(fileName);
    setShowUploadModal(false);
    setUseContractContext(true);
    
    // Add system message about upload
    const systemMessage: Message = {
      role: 'assistant',
      content: `Great! I've processed "${fileName}". I can now provide more personalized answers based on your specific contract terms. Your contracted rates will be compared against award minimums in my responses.`,
      citations: [
        { text: 'Contract interpretation', reference: 'Award p.8, Clause 17' }
      ]
    };
    
    setMessages([...messages, systemMessage]);
  };

  const handlePromptClick = (prompt: string) => {
    setMessageInput(prompt);
  };

  // Show setup modal on first visit
  if (showSetupModal && !setupComplete) {
    return (
      <AwardPackSetupModal
        onConfirm={handleSetupConfirm}
        onCancel={() => setShowSetupModal(false)}
      />
    );
  }

  // Show building screen
  if (isBuilding && buildingData) {
    return (
      <KnowledgeBaseBuildingScreen
        orgType={buildingData.orgType}
        orgName={buildingData.orgName}
        onComplete={handleBuildingComplete}
      />
    );
  }

  // Main chat interface
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Document Upload Modal */}
      {showUploadModal && (
        <DocumentUploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleDocumentUpload}
        />
      )}
      
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
                <span>Award Assistant</span>
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
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Back Button */}
        <Button variant="ghost" className="mb-4 gap-2" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Button>

        {/* Info Banner */}
        <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Info className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-sm text-amber-900">
                  <strong>This assistant provides general information, not legal advice.</strong>
                  <span className="ml-2 hidden sm:inline">All answers include citations to source documents.</span>
                </div>
                <Badge variant="outline" className="gap-1 bg-white w-fit">
                  <Shield className="size-3" />
                  Guardrail Agent Active
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - Context & Settings */}
          <div className="lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Award Pack Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Selected Award Pack</CardTitle>
                  <CardDescription>Your workplace's Fair Work Award</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Sector</div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-blue-50 p-2">
                        <BookOpen className="size-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">Childcare</div>
                        <div className="text-xs text-muted-foreground">Children's Services Award</div>
                      </div>
                      <CheckCircle2 className="size-4 text-green-600" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="text-sm text-muted-foreground mb-2">Status</div>
                    <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 className="size-3" />
                      Ready
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Included Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Included Documents</CardTitle>
                  <CardDescription>Sources used for answers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <FileText className="size-4 text-primary mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm">Children's Services Award</div>
                      <div className="text-xs text-muted-foreground">PDF • 482 clauses indexed</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border-2 border-dashed border-border">
                    <Upload className="size-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">No contract uploaded</div>
                      <div className="text-xs text-muted-foreground">Upload for personalized answers</div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => setShowUploadModal(true)}>
                    <Upload className="size-4" />
                    Upload Supporting Document
                  </Button>
                </CardContent>
              </Card>

              {/* Contract Context Toggle */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="useContract"
                      checked={useContractContext}
                      onCheckedChange={(checked) => setUseContractContext(checked as boolean)}
                      disabled={true}
                    />
                    <div className="flex-1">
                      <Label htmlFor="useContract" className="cursor-pointer">
                        Use my contract context
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Include your contract terms in responses (requires upload)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notice */}
              <div className="text-xs text-muted-foreground text-center p-4 bg-muted/30 rounded-lg">
                Answers are based on the selected award and provided documents.
              </div>
            </div>
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="flex-1">
            <Card className="h-[calc(100vh-12rem)] flex flex-col">
              <CardHeader className="border-b border-border bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-2">
                    <Sparkles className="size-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Award Assistant</CardTitle>
                    <CardDescription>Ask about your workplace rights and entitlements</CardDescription>
                  </div>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[95%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-lg p-4 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted border border-border'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                        </div>

                        {/* Citations */}
                        {message.role === 'assistant' && message.citations && message.citations.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.citations.map((citation, citIndex) => (
                              <button
                                key={citIndex}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-xs text-blue-700 transition-colors"
                              >
                                <FileText className="size-3" />
                                {citation.text}
                                <span className="text-blue-500">• {citation.reference}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Suggested Prompts */}
              <div className="border-t border-border px-6 py-3 bg-muted/30">
                <div className="text-xs text-muted-foreground mb-2">💡 Suggested questions:</div>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt)}
                      className="px-3 py-1.5 bg-white hover:bg-muted border border-border rounded-lg text-sm transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Paperclip className="size-4" />
                  </Button>
                  <Input
                    placeholder="Ask about your pay, penalties, or workplace rights…"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon" className="shrink-0">
                    <Send className="size-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground text-center mt-2">
                  Powered by RAG + Children's Services Award 2010
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}