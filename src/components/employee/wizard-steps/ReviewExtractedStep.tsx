import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Checkbox } from '../../ui/checkbox';
import { AlertTriangle, CheckCircle2, Edit2 } from 'lucide-react';
import { WizardData } from '../PayCheckWizard';

interface ReviewExtractedStepProps {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
  editable: boolean;
}

export function ReviewExtractedStep({ data, onNext, onBack }: ReviewExtractedStepProps) {
  const [requestReview, setRequestReview] = useState(false);
  const [contractData, setContractData] = useState<ExtractedField[]>([
    { label: 'Ordinary rate', value: '$28.00/hr', confidence: 0.93, editable: true },
    { label: 'Evening / out-of-hours rate (after 6pm)', value: '$34.00/hr', confidence: 0.91, editable: true }
  ]);

  const [worksheetData] = useState([
    { date: '05 Aug 2025', time: '18:00–20:00', hours: '2.0 hrs', confidence: 0.95 },
    { date: '10 Aug 2025', time: '09:00–13:00', hours: '4.0 hrs', confidence: 0.97 }
  ]);

  const [payslipData] = useState([
    { label: 'Ordinary hours', value: '18.0 hrs @ $28.00', confidence: 0.96 },
    { label: 'Casual loading', value: '$36.00', confidence: 0.94 }
  ]);

  const handleSubmit = () => {
    onNext({
      extractedData: {
        contract: contractData,
        worksheet: worksheetData,
        payslip: payslipData,
        requestReview
      }
    });
  };

  const ConfidenceIndicator = ({ confidence }: { confidence: number }) => {
    const isLow = confidence < 0.7;
    const isMedium = confidence >= 0.7 && confidence < 0.85;
    
    return (
      <div className="flex items-center gap-2">
        {isLow && <AlertTriangle className="size-4 text-amber-600" />}
        {!isLow && <CheckCircle2 className="size-4 text-green-600" />}
        <span className={`text-xs ${isLow ? 'text-amber-600' : isMedium ? 'text-blue-600' : 'text-green-600'}`}>
          {(confidence * 100).toFixed(0)}% confident
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-lg mb-1">Review Extracted Information</h3>
        <p className="text-sm text-muted-foreground">
          Verify the information extracted from your documents. You can edit any field if needed.
        </p>
      </div>

      {/* From Contract */}
      <div className="border border-border rounded-lg p-5 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm">From Contract</h4>
          <span className="text-xs text-muted-foreground">AvaNguyen_CasualContract.pdf</span>
        </div>
        <div className="space-y-4">
          {contractData.map((field, index) => (
            <div key={index} className="grid grid-cols-[1fr_auto] gap-4 items-center">
              <div className="space-y-1">
                <Label className="text-sm">{field.label}</Label>
                <Input value={field.value} className="max-w-xs" />
              </div>
              <div className="text-right">
                <ConfidenceIndicator confidence={field.confidence} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* From Worksheet */}
      <div className="border border-border rounded-lg p-5 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm">From Worksheet</h4>
          <span className="text-xs text-muted-foreground">Ava_Shifts_Aug01-14.xlsx</span>
        </div>
        <div className="space-y-3">
          {worksheetData.map((shift, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-sm">{shift.date}</div>
                  <div className="text-xs text-muted-foreground">{shift.time}</div>
                </div>
                <div className="text-sm px-3 py-1 bg-white rounded border border-border">
                  {shift.hours}
                </div>
              </div>
              <ConfidenceIndicator confidence={shift.confidence} />
            </div>
          ))}
        </div>
      </div>

      {/* From Payslip */}
      <div className="border border-border rounded-lg p-5 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm">From Payslip</h4>
          <span className="text-xs text-muted-foreground">Payslip_Ava_Aug01-14.pdf</span>
        </div>
        <div className="space-y-3">
          {payslipData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">{item.label}</div>
                <div>{item.value}</div>
              </div>
              <ConfidenceIndicator confidence={item.confidence} />
            </div>
          ))}
        </div>
      </div>

      {/* Review Request */}
      <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="requestReview"
            checked={requestReview}
            onCheckedChange={(checked) => setRequestReview(checked as boolean)}
          />
          <div className="flex-1">
            <Label htmlFor="requestReview" className="cursor-pointer">
              Request human review for uncertain fields
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              If any extracted values seem incorrect, a human reviewer will verify them before processing.
              This may add 1-2 business days to your request.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-6 border-t border-border">
        <Button size="lg" onClick={handleSubmit}>
          Run Agentic Check
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
