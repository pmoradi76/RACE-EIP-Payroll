import { useState } from 'react';
import { Button } from '../../ui/button';
import { Upload, FileText, File, Image, Check, Info } from 'lucide-react';
import { WizardData } from '../PayCheckWizard';

interface UploadDocumentsStepProps {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

interface UploadedFile {
  name: string;
  size: number;
}

export function UploadDocumentsStep({ data, onNext, onBack }: UploadDocumentsStepProps) {
  // Pre-populated with sample files
  const [contractFile, setContractFile] = useState<UploadedFile | null>({
    name: 'AvaNguyen_CasualContract.pdf',
    size: 245000
  });
  const [worksheetFile, setWorkssheetFile] = useState<UploadedFile | null>({
    name: 'Ava_Shifts_Aug01-14.xlsx',
    size: 18000
  });
  const [payslipFile, setPayslipFile] = useState<UploadedFile | null>({
    name: 'Payslip_Ava_Aug01-14.pdf',
    size: 89000
  });

  const handleFileSelect = (
    setter: (file: UploadedFile | null) => void,
    fileName: string
  ) => {
    // Simulate file upload
    setter({
      name: fileName,
      size: Math.floor(Math.random() * 500000) + 10000
    });
  };

  const handleSubmit = () => {
    onNext({
      contractFile: contractFile as any,
      worksheetFile: worksheetFile as any,
      payslipFile: payslipFile as any
    });
  };

  const formatFileSize = (bytes: number) => {
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const UploadZone = ({
    title,
    icon: Icon,
    acceptedFormats,
    uploadedFile,
    onUpload
  }: {
    title: string;
    icon: any;
    acceptedFormats: string;
    uploadedFile: UploadedFile | null;
    onUpload: (fileName: string) => void;
  }) => (
    <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="size-6 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Accepted formats: {acceptedFormats}
          </p>
          
          {uploadedFile ? (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Check className="size-4 text-green-600" />
              <div className="flex-1">
                <div className="text-sm">{uploadedFile.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(uploadedFile.size)}
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onUpload('new-file.pdf')}
              >
                Replace
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 border border-border rounded-lg bg-muted/30">
              <Upload className="size-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop or click to upload
              </p>
              <Button size="sm" variant="outline">
                Choose File
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-lg mb-1">Upload Documents</h3>
        <p className="text-sm text-muted-foreground">
          Upload the documents needed to check your pay
        </p>
      </div>

      <div className="space-y-4">
        <UploadZone
          title="Employment Contract"
          icon={FileText}
          acceptedFormats="PDF, DOCX"
          uploadedFile={contractFile}
          onUpload={(name) => handleFileSelect(setContractFile, name)}
        />

        <UploadZone
          title="Worksheet / Timesheet"
          icon={File}
          acceptedFormats="XLSX, CSV"
          uploadedFile={worksheetFile}
          onUpload={(name) => handleFileSelect(setWorkssheetFile, name)}
        />

        <UploadZone
          title="Payslip"
          icon={Image}
          acceptedFormats="PDF, PNG, JPG"
          uploadedFile={payslipFile}
          onUpload={(name) => handleFileSelect(setPayslipFile, name)}
        />
      </div>

      {/* Privacy Notice */}
      <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <strong>Privacy & Security:</strong> All files are encrypted in transit and at rest.
          Your documents are used only for this pay analysis and are not shared with third parties.
          You can request deletion at any time.
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-6 border-t border-border">
        <Button 
          size="lg"
          onClick={handleSubmit}
          disabled={!contractFile || !worksheetFile || !payslipFile}
        >
          Continue to Review
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
