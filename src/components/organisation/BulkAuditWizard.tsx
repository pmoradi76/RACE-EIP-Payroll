import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';
import { SeverityBadge } from '../design-system/SeverityBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FolderOpen,
  Users,
  Settings,
  Play,
  Download,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeft,
  X,
  Loader2,
  PackageOpen,
  Link2,
  Shield,
  Zap,
  FileCheck,
  TrendingUp
} from 'lucide-react';

interface BulkAuditWizardProps {
  onClose: () => void;
  onComplete?: () => void;
  onLogout: () => void;
}

interface EmployeeMapping {
  id: string;
  name: string;
  hasContract: boolean;
  hasPayslip: boolean;
  hasWorksheet: boolean;
  contractFile?: string;
  payslipFile?: string;
  worksheetFile?: string;
  status: 'complete' | 'partial' | 'missing';
}

interface AgentStatus {
  name: string;
  status: 'pending' | 'running' | 'done' | 'failed';
  progress: number;
  message?: string;
}

interface AuditResult {
  id: string;
  name: string;
  role: string;
  status: 'ok' | 'underpaid' | 'needs-review';
  amount?: number;
  issues: string[];
}

export function BulkAuditWizard({ onClose, onComplete, onLogout }: BulkAuditWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Org & Award Setup
  const [orgName, setOrgName] = useState('BrightSteps Early Learning');
  const [orgType, setOrgType] = useState('childcare');
  const [selectedAward, setSelectedAward] = useState('childrens-services');
  const [payPeriodStart, setPayPeriodStart] = useState('2025-08-01');
  const [payPeriodEnd, setPayPeriodEnd] = useState('2025-08-14');
  const [threshold, setThreshold] = useState('2');
  const [reportMode, setReportMode] = useState('all');
  const [hasEnterpriseAgreement, setHasEnterpriseAgreement] = useState(false);
  
  // Step 2: Upload
  const [zipUploaded, setZipUploaded] = useState(false);
  const [zipFileName, setZipFileName] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  
  // Step 3: Validation & Mapping
  const [employeeMappings, setEmployeeMappings] = useState<EmployeeMapping[]>([
    {
      id: '1',
      name: 'Ava Nguyen',
      hasContract: true,
      hasPayslip: true,
      hasWorksheet: true,
      contractFile: 'contracts/ava_nguyen_contract.pdf',
      payslipFile: 'payslips/ava_nguyen_aug_01-14.pdf',
      worksheetFile: 'worksheets/ava_nguyen_timesheet.xlsx',
      status: 'complete'
    },
    {
      id: '2',
      name: 'Marcus Chen',
      hasContract: true,
      hasPayslip: true,
      hasWorksheet: false,
      contractFile: 'contracts/marcus_chen_contract.pdf',
      payslipFile: 'payslips/marcus_chen_aug_01-14.pdf',
      status: 'partial'
    },
    {
      id: '3',
      name: 'Sophie Wilson',
      hasContract: false,
      hasPayslip: true,
      hasWorksheet: true,
      payslipFile: 'payslips/sophie_wilson_aug_01-14.pdf',
      worksheetFile: 'worksheets/sophie_wilson_timesheet.xlsx',
      status: 'partial'
    },
    {
      id: '4',
      name: 'Emma Thompson',
      hasContract: true,
      hasPayslip: true,
      hasWorksheet: true,
      contractFile: 'contracts/emma_thompson_contract.pdf',
      payslipFile: 'payslips/emma_thompson_aug_01-14.pdf',
      worksheetFile: 'worksheets/emma_thompson_timesheet.xlsx',
      status: 'complete'
    },
    {
      id: '5',
      name: 'Liam O\'Brien',
      hasContract: true,
      hasPayslip: false,
      hasWorksheet: true,
      contractFile: 'contracts/liam_obrien_contract.pdf',
      worksheetFile: 'worksheets/liam_obrien_timesheet.xlsx',
      status: 'partial'
    }
  ]);
  
  const [unmatchedFiles] = useState([
    'contracts/old_employee_contract.pdf',
    'payslips/test_payslip.pdf'
  ]);
  
  const [parsingErrors] = useState([
    { file: 'worksheets/corrupted_file.xlsx', error: 'File format not recognized' }
  ]);
  
  // Step 4: Running Audit
  const [isRunning, setIsRunning] = useState(false);
  const [agents, setAgents] = useState<AgentStatus[]>([
    { name: 'Batch Coordinator Agent', status: 'pending', progress: 0 },
    { name: 'Document Parser Agent', status: 'pending', progress: 0 },
    { name: 'Contract Analyzer Agent', status: 'pending', progress: 0 },
    { name: 'Award Rules Agent', status: 'pending', progress: 0 },
    { name: 'Payslip Analyzer Agent', status: 'pending', progress: 0 },
    { name: 'Time Calculator Agent', status: 'pending', progress: 0 },
    { name: 'Penalty Rate Agent', status: 'pending', progress: 0 },
    { name: 'Compliance Checker Agent', status: 'pending', progress: 0 },
    { name: 'Evidence Builder Agent', status: 'pending', progress: 0 },
    { name: 'Report Generator Agent', status: 'pending', progress: 0 }
  ]);
  
  // Step 5: Results
  const [auditResults] = useState<AuditResult[]>([
    {
      id: '1',
      name: 'Ava Nguyen',
      role: 'Casual Educator',
      status: 'underpaid',
      amount: -142.50,
      issues: ['Missing evening penalty rates', 'Incorrect casual loading']
    },
    {
      id: '2',
      name: 'Marcus Chen',
      role: 'Lead Educator',
      status: 'underpaid',
      amount: -87.20,
      issues: ['Split shift allowance not paid']
    },
    {
      id: '3',
      name: 'Sophie Wilson',
      role: 'Assistant Educator',
      status: 'underpaid',
      amount: -56.80,
      issues: ['Missing evening penalty rates']
    },
    {
      id: '4',
      name: 'Emma Thompson',
      role: 'Early Childhood Teacher',
      status: 'needs-review',
      amount: -23.40,
      issues: ['Unclear award classification']
    },
    {
      id: '5',
      name: 'Liam O\'Brien',
      role: 'Casual Educator',
      status: 'ok',
      issues: []
    }
  ]);

  const handleZipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setZipFileName(e.target.files[0].name);
      setIsValidating(true);
      
      // Simulate validation
      setTimeout(() => {
        setZipUploaded(true);
        setIsValidating(false);
      }, 2000);
    }
  };

  const handleRunAudit = () => {
    setIsRunning(true);
    setCurrentStep(4);
    
    // Simulate agent pipeline execution
    const agentTimings = [
      { index: 0, delay: 500, duration: 2000 },   // Batch Coordinator
      { index: 1, delay: 2500, duration: 3000 },  // Document Parser
      { index: 2, delay: 5500, duration: 2500 },  // Contract Analyzer
      { index: 3, delay: 8000, duration: 2000 },  // Award Rules
      { index: 4, delay: 10000, duration: 2500 }, // Payslip Analyzer
      { index: 5, delay: 12500, duration: 2000 }, // Time Calculator
      { index: 6, delay: 14500, duration: 2500 }, // Penalty Rate
      { index: 7, delay: 17000, duration: 2000 }, // Compliance Checker
      { index: 8, delay: 19000, duration: 2500 }, // Evidence Builder
      { index: 9, delay: 21500, duration: 2000 }  // Report Generator
    ];
    
    agentTimings.forEach(({ index, delay, duration }) => {
      setTimeout(() => {
        setAgents(prev => {
          const updated = [...prev];
          updated[index].status = 'running';
          updated[index].message = 'Processing...';
          return updated;
        });
        
        // Progress animation
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 10;
          setAgents(prev => {
            const updated = [...prev];
            updated[index].progress = Math.min(progress, 100);
            return updated;
          });
          
          if (progress >= 100) {
            clearInterval(progressInterval);
            setAgents(prev => {
              const updated = [...prev];
              updated[index].status = 'done';
              updated[index].message = 'Complete';
              return updated;
            });
          }
        }, duration / 10);
      }, delay);
    });
    
    // Move to results after all agents complete
    setTimeout(() => {
      setIsRunning(false);
      setCurrentStep(5);
      if (onComplete) {
        onComplete();
      }
    }, 24000);
  };

  const totalEmployees = employeeMappings.length;
  const completeEmployees = employeeMappings.filter(e => e.status === 'complete').length;
  const partialEmployees = employeeMappings.filter(e => e.status === 'partial').length;
  const missingEmployees = employeeMappings.filter(e => e.status === 'missing').length;

  const steps = [
    { number: 1, label: 'Setup', icon: Settings },
    { number: 2, label: 'Upload', icon: Upload },
    { number: 3, label: 'Validate & Map', icon: Link2 },
    { number: 4, label: 'Run Audit', icon: Play },
    { number: 5, label: 'Results', icon: FileCheck }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-6xl my-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">New Bulk Audit Request</CardTitle>
              <CardDescription>
                Process multiple employees in one comprehensive audit
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>

          {/* Progress Stepper */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep > step.number
                          ? 'bg-green-500 text-white'
                          : currentStep === step.number
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle2 className="size-5" />
                      ) : (
                        <step.icon className="size-5" />
                      )}
                    </div>
                    <div className="text-xs mt-2 text-center hidden sm:block">{step.label}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        currentStep > step.number ? 'bg-green-500' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Org & Award Setup */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organisation Name</Label>
                  <Input
                    id="org-name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g., BrightSteps Early Learning"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="org-type">Organisation Type</Label>
                  <Select value={orgType} onValueChange={setOrgType}>
                    <SelectTrigger id="org-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="childcare">Childcare Centre</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="hospitality">Hospitality</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="award">Award Pack</Label>
                <Select value={selectedAward} onValueChange={setSelectedAward}>
                  <SelectTrigger id="award">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="childrens-services">Children's Services Award 2010</SelectItem>
                    <SelectItem value="retail">General Retail Industry Award</SelectItem>
                    <SelectItem value="hospitality">Hospitality Industry Award</SelectItem>
                    <SelectItem value="nurses">Nurses Award</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Enterprise Agreement */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="enterprise-agreement"
                      checked={hasEnterpriseAgreement}
                      onCheckedChange={(checked) => setHasEnterpriseAgreement(checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="enterprise-agreement" className="cursor-pointer">
                        Include Enterprise Agreement (Optional)
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload if your organization has a registered enterprise agreement
                      </p>
                      {hasEnterpriseAgreement && (
                        <div className="mt-3">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Upload className="size-4" />
                            Upload Agreement
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pay Period */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="period-start">Pay Period Start</Label>
                  <Input
                    id="period-start"
                    type="date"
                    value={payPeriodStart}
                    onChange={(e) => setPayPeriodStart(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period-end">Pay Period End</Label>
                  <Input
                    id="period-end"
                    type="date"
                    value={payPeriodEnd}
                    onChange={(e) => setPayPeriodEnd(e.target.value)}
                  />
                </div>
              </div>

              {/* Threshold */}
              <div className="space-y-2">
                <Label htmlFor="threshold">Underpayment Threshold</Label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Ignore issues less than</span>
                  <Input
                    id="threshold"
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">dollars</span>
                </div>
              </div>

              {/* Report Mode */}
              <div className="space-y-2">
                <Label htmlFor="report-mode">Report Mode</Label>
                <Select value={reportMode} onValueChange={setReportMode}>
                  <SelectTrigger id="report-mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">List all employees (compliant + underpaid)</SelectItem>
                    <SelectItem value="underpaid-only">List underpaid employees only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={() => setCurrentStep(2)} className="gap-2">
                  Continue to Upload
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Upload ZIP */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Expected Structure */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FolderOpen className="size-5 text-blue-600" />
                    Expected ZIP Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-sm space-y-1 text-blue-900">
                    <div>📦 audit_files.zip</div>
                    <div className="pl-4">├── 📁 contracts/</div>
                    <div className="pl-8">└── employee_name_contract.pdf</div>
                    <div className="pl-4">├── 📁 payslips/</div>
                    <div className="pl-8">└── employee_name_aug_01-14.pdf</div>
                    <div className="pl-4">└── 📁 worksheets/</div>
                    <div className="pl-8">└── employee_name_timesheet.xlsx</div>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Area */}
              <Card>
                <CardContent className="pt-6">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      zipUploaded
                        ? 'border-green-300 bg-green-50'
                        : 'border-border bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    {isValidating ? (
                      <div className="space-y-3">
                        <Loader2 className="size-12 text-primary mx-auto animate-spin" />
                        <div>
                          <div className="font-medium">Validating ZIP file...</div>
                          <div className="text-sm text-muted-foreground">
                            Checking structure and parsing documents
                          </div>
                        </div>
                      </div>
                    ) : zipUploaded ? (
                      <div className="space-y-3">
                        <CheckCircle2 className="size-12 text-green-600 mx-auto" />
                        <div>
                          <div className="font-medium">ZIP uploaded successfully</div>
                          <div className="text-sm text-muted-foreground">{zipFileName}</div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setZipUploaded(false)}>
                          Upload different file
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <PackageOpen className="size-12 text-primary mx-auto" />
                        <div>
                          <p className="mb-2">Drag and drop your ZIP file here, or</p>
                          <label htmlFor="zip-upload">
                            <Button variant="outline" asChild>
                              <span className="cursor-pointer gap-2">
                                <Upload className="size-4" />
                                Browse files
                              </span>
                            </Button>
                          </label>
                          <input
                            id="zip-upload"
                            type="file"
                            className="hidden"
                            accept=".zip"
                            onChange={handleZipUpload}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Maximum file size: 100MB
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between gap-3 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="size-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={!zipUploaded}
                  className="gap-2"
                >
                  Continue to Validation
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Validate & Map */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl mb-1">{totalEmployees}</div>
                    <div className="text-sm text-muted-foreground">Total Employees</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl text-green-600 mb-1">{completeEmployees}</div>
                    <div className="text-sm text-muted-foreground">Complete</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl text-amber-600 mb-1">{partialEmployees}</div>
                    <div className="text-sm text-muted-foreground">Partial</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl text-red-600 mb-1">{unmatchedFiles.length}</div>
                    <div className="text-sm text-muted-foreground">Unmatched</div>
                  </CardContent>
                </Card>
              </div>

              {/* Issues */}
              {(unmatchedFiles.length > 0 || parsingErrors.length > 0) && (
                <div className="space-y-4">
                  {unmatchedFiles.length > 0 && (
                    <Card className="border-amber-200 bg-amber-50">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertCircle className="size-5 text-amber-600" />
                          Unmatched Files ({unmatchedFiles.length})
                        </CardTitle>
                        <CardDescription>
                          These files couldn't be automatically matched to employees
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          {unmatchedFiles.map((file, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <FileText className="size-4 text-amber-600" />
                              <code className="text-xs bg-white px-2 py-1 rounded">{file}</code>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {parsingErrors.length > 0 && (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <XCircle className="size-5 text-red-600" />
                          Parsing Errors ({parsingErrors.length})
                        </CardTitle>
                        <CardDescription>
                          These files could not be parsed
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          {parsingErrors.map((error, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <XCircle className="size-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <code className="text-xs bg-white px-2 py-1 rounded block mb-1">
                                  {error.file}
                                </code>
                                <span className="text-red-800">{error.error}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Employee Mapping */}
              <Card>
                <CardHeader>
                  <CardTitle>Employee Document Mapping</CardTitle>
                  <CardDescription>
                    Review which documents were found for each employee
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {employeeMappings.map((employee) => (
                      <div
                        key={employee.id}
                        className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="font-medium">{employee.name}</div>
                              <Badge
                                variant={
                                  employee.status === 'complete'
                                    ? 'default'
                                    : employee.status === 'partial'
                                    ? 'secondary'
                                    : 'destructive'
                                }
                              >
                                {employee.status === 'complete' && <CheckCircle2 className="size-3 mr-1" />}
                                {employee.status === 'partial' && <AlertCircle className="size-3 mr-1" />}
                                {employee.status === 'missing' && <XCircle className="size-3 mr-1" />}
                                {employee.status}
                              </Badge>
                            </div>

                            <div className="grid md:grid-cols-3 gap-2 text-sm">
                              <div
                                className={`flex items-center gap-2 p-2 rounded ${
                                  employee.hasContract
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-red-50 text-red-700'
                                }`}
                              >
                                {employee.hasContract ? (
                                  <CheckCircle2 className="size-4" />
                                ) : (
                                  <XCircle className="size-4" />
                                )}
                                <span>Contract</span>
                              </div>
                              <div
                                className={`flex items-center gap-2 p-2 rounded ${
                                  employee.hasPayslip
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-red-50 text-red-700'
                                }`}
                              >
                                {employee.hasPayslip ? (
                                  <CheckCircle2 className="size-4" />
                                ) : (
                                  <XCircle className="size-4" />
                                )}
                                <span>Payslip</span>
                              </div>
                              <div
                                className={`flex items-center gap-2 p-2 rounded ${
                                  employee.hasWorksheet
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-red-50 text-red-700'
                                }`}
                              >
                                {employee.hasWorksheet ? (
                                  <CheckCircle2 className="size-4" />
                                ) : (
                                  <XCircle className="size-4" />
                                )}
                                <span>Worksheet</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between gap-3 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="size-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleRunAudit}
                  className="gap-2"
                  disabled={completeEmployees === 0}
                >
                  <Play className="size-4" />
                  Run Audit ({completeEmployees} employees)
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Run Audit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {isRunning ? (
                        <Loader2 className="size-6 text-primary animate-spin" />
                      ) : (
                        <CheckCircle2 className="size-6 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-lg">
                        {isRunning ? 'Processing audit...' : 'Audit complete!'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isRunning
                          ? 'AI agents are analyzing your employee data'
                          : 'All employees have been processed'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Pipeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Agent Pipeline Progress</CardTitle>
                  <CardDescription>10 AI agents working in sequence</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agents.map((agent, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                agent.status === 'done'
                                  ? 'bg-green-100 text-green-600'
                                  : agent.status === 'running'
                                  ? 'bg-blue-100 text-blue-600'
                                  : agent.status === 'failed'
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {agent.status === 'done' ? (
                                <CheckCircle2 className="size-4" />
                              ) : agent.status === 'running' ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : agent.status === 'failed' ? (
                                <XCircle className="size-4" />
                              ) : (
                                <Zap className="size-4" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{agent.name}</div>
                              {agent.message && (
                                <div className="text-xs text-muted-foreground">{agent.message}</div>
                              )}
                            </div>
                          </div>
                          {agent.status === 'running' && (
                            <div className="text-sm text-muted-foreground">
                              {agent.progress}%
                            </div>
                          )}
                        </div>
                        {agent.status === 'running' && (
                          <Progress value={agent.progress} className="h-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Results */}
          {currentStep === 5 && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl mb-1">{auditResults.length}</div>
                    <div className="text-sm text-muted-foreground">Total Processed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl text-red-600 mb-1">
                      {auditResults.filter((r) => r.status === 'underpaid').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Underpaid</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl text-amber-600 mb-1">
                      {auditResults.filter((r) => r.status === 'needs-review').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Needs Review</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl text-red-600 mb-1">
                      $
                      {auditResults
                        .filter((r) => r.amount)
                        .reduce((sum, r) => sum + Math.abs(r.amount || 0), 0)
                        .toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Liability</div>
                  </CardContent>
                </Card>
              </div>

              {/* Export Buttons */}
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="gap-2">
                  <FileSpreadsheet className="size-4" />
                  Export CSV Remediation
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="size-4" />
                  Download PDF Report
                </Button>
                <Button variant="outline" className="gap-2">
                  <PackageOpen className="size-4" />
                  Evidence Packs (ZIP)
                </Button>
              </div>

              {/* Results Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Audit Results</CardTitle>
                  <CardDescription>Detailed breakdown by employee</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {auditResults.map((result) => (
                      <div
                        key={result.id}
                        className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="font-medium">{result.name}</div>
                              <SeverityBadge severity={result.status} size="sm" />
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {result.role}
                            </div>
                            {result.issues.length > 0 && (
                              <div className="space-y-1">
                                {result.issues.map((issue, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2 text-sm text-red-700"
                                  >
                                    <AlertCircle className="size-4 mt-0.5 flex-shrink-0" />
                                    <span>{issue}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            {result.amount !== undefined && (
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">Amount</div>
                                <div
                                  className={`text-lg ${
                                    result.status === 'underpaid'
                                      ? 'text-red-600'
                                      : 'text-green-600'
                                  }`}
                                >
                                  {result.amount < 0
                                    ? `−$${Math.abs(result.amount).toFixed(2)}`
                                    : '$0.00'}
                                </div>
                              </div>
                            )}
                            <Button size="sm" variant="outline" className="gap-1">
                              View Details
                              <ArrowRight className="size-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3 pt-4">
                <Button onClick={onClose}>Close</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}