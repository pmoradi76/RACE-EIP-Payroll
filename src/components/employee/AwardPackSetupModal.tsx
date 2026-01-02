import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Sparkles, BookOpen } from 'lucide-react';

interface AwardPackSetupModalProps {
  onConfirm: (data: { orgType: string; orgName: string }) => void;
  onCancel: () => void;
}

export function AwardPackSetupModal({ onConfirm, onCancel }: AwardPackSetupModalProps) {
  const [orgType, setOrgType] = useState('Childcare');
  const [orgName, setOrgName] = useState('BrightSteps Early Learning');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ orgType, orgName });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="size-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Set up your Award Assistant</CardTitle>
          <CardDescription>
            We'll build a personalized knowledge base based on your workplace's Fair Work Award
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orgType">Organisation Type</Label>
              <Select value={orgType} onValueChange={setOrgType}>
                <SelectTrigger id="orgType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Childcare">Childcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Hospitality">Hospitality</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This helps us identify the correct Modern Award
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgName">Organisation Name</Label>
              <Input
                id="orgName"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g., BrightSteps Early Learning"
                required
              />
              <p className="text-xs text-muted-foreground">
                Your employer's name
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <div className="flex gap-3">
                <BookOpen className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="mb-2">
                    <strong>What happens next?</strong>
                  </p>
                  <p>
                    We'll analyze the relevant Fair Work Award and create a searchable knowledge base. 
                    This takes about 30 seconds and only needs to be done once.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" size="lg" className="flex-1 gap-2">
                <Sparkles className="size-4" />
                Build Award Knowledge Base
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
