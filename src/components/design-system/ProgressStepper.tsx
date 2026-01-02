import { Check } from 'lucide-react';

export interface ProgressStep {
  id: string;
  label: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface ProgressStepperProps {
  steps: ProgressStep[];
  orientation?: 'horizontal' | 'vertical';
}

export function ProgressStepper({ steps, orientation = 'horizontal' }: ProgressStepperProps) {
  if (orientation === 'horizontal') {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center relative">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                    ${step.status === 'completed' ? 'bg-primary border-primary text-primary-foreground' : ''}
                    ${step.status === 'current' ? 'bg-white border-primary text-primary' : ''}
                    ${step.status === 'upcoming' ? 'bg-white border-border text-muted-foreground' : ''}
                  `}
                >
                  {step.status === 'completed' ? (
                    <Check className="size-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm ${step.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-4 transition-colors
                    ${step.status === 'completed' ? 'bg-primary' : 'bg-border'}
                  `}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Vertical orientation
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors shrink-0
                ${step.status === 'completed' ? 'bg-primary border-primary text-primary-foreground' : ''}
                ${step.status === 'current' ? 'bg-white border-primary text-primary' : ''}
                ${step.status === 'upcoming' ? 'bg-white border-border text-muted-foreground' : ''}
              `}
            >
              {step.status === 'completed' ? (
                <Check className="size-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  w-0.5 flex-1 my-2 transition-colors
                  ${step.status === 'completed' ? 'bg-primary' : 'bg-border'}
                `}
                style={{ minHeight: '40px' }}
              />
            )}
          </div>
          <div className="flex-1 pb-8">
            <div className={`${step.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'}`}>
              {step.label}
            </div>
            {step.description && (
              <div className="text-sm text-muted-foreground mt-1">{step.description}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
