import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Checkbox } from '../../ui/checkbox';
import { WizardData } from '../PayCheckWizard';

interface MetaDetailsStepProps {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onCancel: () => void;
}

export function MetaDetailsStep({ data, onNext, onCancel }: MetaDetailsStepProps) {
  const [formData, setFormData] = useState({
    organisationType: data.organisationType,
    organisationName: data.organisationName,
    employmentType: data.employmentType,
    roleTitle: data.roleTitle,
    classificationLevel: data.classificationLevel,
    periodStart: data.periodStart,
    periodEnd: data.periodEnd,
    state: data.state,
    hasPublicHoliday: data.hasPublicHoliday
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg mb-1">Pay Check Details</h3>
        <p className="text-sm text-muted-foreground">
          Provide information about your employment and pay period
        </p>
      </div>

      {/* Organisation Type */}
      <div className="space-y-2">
        <Label htmlFor="organisationType">Organisation Type</Label>
        <Select 
          value={formData.organisationType} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, organisationType: value }))}
        >
          <SelectTrigger id="organisationType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Childcare">Childcare</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Hospitality">Hospitality</SelectItem>
            <SelectItem value="Retail">Retail</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Select the industry sector</p>
      </div>

      {/* Organisation Name */}
      <div className="space-y-2">
        <Label htmlFor="organisationName">Organisation Name</Label>
        <Input
          id="organisationName"
          value={formData.organisationName}
          onChange={(e) => setFormData(prev => ({ ...prev, organisationName: e.target.value }))}
          required
        />
        <p className="text-xs text-muted-foreground">Your employer's legal name</p>
      </div>

      {/* Employment Type */}
      <div className="space-y-2">
        <Label>Employment Type</Label>
        <RadioGroup 
          value={formData.employmentType}
          onValueChange={(value) => setFormData(prev => ({ ...prev, employmentType: value }))}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Casual" id="casual" />
            <Label htmlFor="casual" className="font-normal cursor-pointer">Casual</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Part-time" id="part-time" />
            <Label htmlFor="part-time" className="font-normal cursor-pointer">Part-time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Full-time" id="full-time" />
            <Label htmlFor="full-time" className="font-normal cursor-pointer">Full-time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Fixed term" id="fixed-term" />
            <Label htmlFor="fixed-term" className="font-normal cursor-pointer">Fixed term</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Contractor" id="contractor" />
            <Label htmlFor="contractor" className="font-normal cursor-pointer">Contractor</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Role Title */}
      <div className="space-y-2">
        <Label htmlFor="roleTitle">Role Title</Label>
        <Input
          id="roleTitle"
          value={formData.roleTitle}
          onChange={(e) => setFormData(prev => ({ ...prev, roleTitle: e.target.value }))}
          required
        />
        <p className="text-xs text-muted-foreground">Your job title or position</p>
      </div>

      {/* Classification Level */}
      <div className="space-y-2">
        <Label htmlFor="classificationLevel">Classification Level (Optional)</Label>
        <Input
          id="classificationLevel"
          value={formData.classificationLevel}
          onChange={(e) => setFormData(prev => ({ ...prev, classificationLevel: e.target.value }))}
          placeholder="e.g., Level 3, Grade 2"
        />
        <p className="text-xs text-muted-foreground">If specified in your contract or award</p>
      </div>

      {/* Pay Period */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="periodStart">Pay Period Start Date</Label>
          <Input
            id="periodStart"
            type="date"
            value={formData.periodStart}
            onChange={(e) => setFormData(prev => ({ ...prev, periodStart: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="periodEnd">Pay Period End Date</Label>
          <Input
            id="periodEnd"
            type="date"
            value={formData.periodEnd}
            onChange={(e) => setFormData(prev => ({ ...prev, periodEnd: e.target.value }))}
            required
          />
        </div>
      </div>

      {/* State */}
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Select 
          value={formData.state} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
        >
          <SelectTrigger id="state">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="VIC">Victoria (VIC)</SelectItem>
            <SelectItem value="NSW">New South Wales (NSW)</SelectItem>
            <SelectItem value="QLD">Queensland (QLD)</SelectItem>
            <SelectItem value="SA">South Australia (SA)</SelectItem>
            <SelectItem value="WA">Western Australia (WA)</SelectItem>
            <SelectItem value="TAS">Tasmania (TAS)</SelectItem>
            <SelectItem value="NT">Northern Territory (NT)</SelectItem>
            <SelectItem value="ACT">Australian Capital Territory (ACT)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Where you performed the work</p>
      </div>

      {/* Public Holiday */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasPublicHoliday"
          checked={formData.hasPublicHoliday}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ ...prev, hasPublicHoliday: checked as boolean }))
          }
        />
        <Label htmlFor="hasPublicHoliday" className="font-normal cursor-pointer">
          There was a public holiday during this pay period
        </Label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-6 border-t border-border">
        <Button type="submit" size="lg">
          Continue
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
