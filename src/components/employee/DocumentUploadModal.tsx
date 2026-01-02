import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';

interface DocumentUploadModalProps {
  onClose: () => void;
  onUpload: (fileName: string) => void;
}

export function DocumentUploadModal({ onClose, onUpload }: DocumentUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0].name);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Upload Supporting Document</CardTitle>
              <CardDescription>
                Add your contract or other documents to get personalized answers
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : selectedFile 
                ? 'border-green-300 bg-green-50' 
                : 'border-border bg-muted/30'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="size-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm mb-1">File selected:</div>
                  <div className="font-medium">{selectedFile}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  Choose different file
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="size-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm mb-1">
                    Drag and drop your document here, or
                  </p>
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" asChild>
                      <span className="cursor-pointer">
                        Browse files
                      </span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileSelect}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, DOCX (max 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Document Types */}
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">Suggested documents:</div>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                <FileText className="size-4 text-primary" />
                <span className="text-sm">Employment Contract</span>
              </button>
              <button className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                <FileText className="size-4 text-primary" />
                <span className="text-sm">Enterprise Agreement</span>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
            <p className="text-sm text-blue-900">
              <strong>Privacy:</strong> Your documents are encrypted and only used to provide 
              personalized answers. They are not shared with third parties.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              className="flex-1 gap-2" 
              onClick={handleUpload}
              disabled={!selectedFile}
            >
              <Upload className="size-4" />
              Upload Document
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}