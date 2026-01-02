import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { ProgressStepper } from '../design-system/ProgressStepper';
import { MetaDetailsStep } from './wizard-steps/MetaDetailsStep';
import { UploadDocumentsStep } from './wizard-steps/UploadDocumentsStep';
import { ReviewExtractedStep } from './wizard-steps/ReviewExtractedStep';
import { RunAgenticCheckStep } from './wizard-steps/RunAgenticCheckStep';
import { ResultsStep } from './wizard-steps/ResultsStep';

interface PayCheckWizardProps {
  onClose: () => void;
}

export interface WizardData {
  // Meta details
  organisationType: string;
  organisationName: string;
  employmentType: string;
  roleTitle: string;
  classificationLevel: string;
  periodStart: string;
  periodEnd: string;
  state: string;
  hasPublicHoliday: boolean;
  
  // Documents
  contractFile: File | null;
  worksheetFile: File | null;
  payslipFile: File | null;
  
  // Extracted data
  extractedData: any;
  
  // Results
  results: any;
}

export function PayCheckWizard({ onClose }: PayCheckWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    organisationType: 'Childcare',
    organisationName: 'BrightSteps Early Learning',
    employmentType: 'Casual',
    roleTitle: 'Educator',
    classificationLevel: '',
    periodStart: '2025-08-01',
    periodEnd: '2025-08-14',
    state: 'VIC',
    hasPublicHoliday: false,
    contractFile: null,
    worksheetFile: null,
    payslipFile: null,
    extractedData: null,
    results: null
  });

  const steps = [
    { number: 1, label: 'Meta details', status: currentStep > 1 ? 'done' : currentStep === 1 ? 'running' : 'pending' },
    { number: 2, label: 'Upload documents', status: currentStep > 2 ? 'done' : currentStep === 2 ? 'running' : 'pending' },
    { number: 3, label: 'Review extracted info', status: currentStep > 3 ? 'done' : currentStep === 3 ? 'running' : 'pending' },
    { number: 4, label: 'Run Agentic Check', status: currentStep > 4 ? 'done' : currentStep === 4 ? 'running' : 'pending' },
    { number: 5, label: 'Results', status: currentStep === 5 ? 'done' : 'pending' }
  ];

  const handleNext = (data?: Partial<WizardData>) => {
    if (data) {
      setWizardData(prev => ({ ...prev, ...data }));
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl">New Pay Check Request</h2>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of 5: {steps[currentStep - 1].label}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Stepper */}
          <div className="w-64 border-r border-border bg-muted/30 p-6">
            <ProgressStepper 
              steps={steps as any} 
              orientation="vertical"
              onStepClick={handleStepClick}
            />
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {currentStep === 1 && (
              <MetaDetailsStep 
                data={wizardData}
                onNext={handleNext}
                onCancel={onClose}
              />
            )}
            {currentStep === 2 && (
              <UploadDocumentsStep 
                data={wizardData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <ReviewExtractedStep 
                data={wizardData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <RunAgenticCheckStep 
                data={wizardData}
                onNext={handleNext}
              />
            )}
            {currentStep === 5 && (
              <ResultsStep 
                data={wizardData}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
