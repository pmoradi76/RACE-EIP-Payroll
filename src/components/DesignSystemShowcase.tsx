import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { StatusBadge } from '../design-system/StatusBadge';
import { SeverityBadge } from '../design-system/SeverityBadge';
import { AnomalyScorePill } from '../design-system/AnomalyScorePill';
import { ProgressStepper, ProgressStep } from '../design-system/ProgressStepper';
import { Breadcrumb } from '../design-system/Breadcrumb';
import { PageHeader } from '../design-system/PageHeader';
import { EmptyState } from '../design-system/EmptyState';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Inbox } from 'lucide-react';

const steps: ProgressStep[] = [
  { id: '1', label: 'Upload', description: 'Documents received', status: 'completed' },
  { id: '2', label: 'Process', description: 'AI analysis running', status: 'current' },
  { id: '3', label: 'Review', description: 'Awaiting validation', status: 'upcoming' },
  { id: '4', label: 'Complete', description: 'Report ready', status: 'upcoming' }
];

export function DesignSystemShowcase() {
  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader 
          title="PayGuard Design System"
          description="Reusable components and patterns for consistent UI development"
          actions={
            <Button>View Documentation</Button>
          }
        />

        <Breadcrumb 
          items={[
            { label: 'Design System', href: '#' },
            { label: 'Components' }
          ]}
        />

        <Tabs defaultValue="badges" className="space-y-6">
          <TabsList>
            <TabsTrigger value="badges">Badges & Pills</TabsTrigger>
            <TabsTrigger value="progress">Progress & Steppers</TabsTrigger>
            <TabsTrigger value="layout">Layout Components</TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="space-y-6">
            {/* Status Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Status Badges</CardTitle>
                <CardDescription>
                  Use status badges to indicate processing states: done, running, needs-review, failed, pending
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="mb-3">Sizes</h4>
                  <div className="flex flex-wrap gap-3 items-center">
                    <StatusBadge status="done" size="sm" />
                    <StatusBadge status="running" size="md" />
                    <StatusBadge status="needs-review" size="lg" />
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">All States</h4>
                  <div className="flex flex-wrap gap-3">
                    <StatusBadge status="done" />
                    <StatusBadge status="running" />
                    <StatusBadge status="needs-review" />
                    <StatusBadge status="failed" />
                    <StatusBadge status="pending" />
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Without Icons</h4>
                  <div className="flex flex-wrap gap-3">
                    <StatusBadge status="done" showIcon={false} />
                    <StatusBadge status="running" showIcon={false} />
                    <StatusBadge status="needs-review" showIcon={false} />
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <code className="text-sm">
                    {`<StatusBadge status="done" size="md" showIcon={true} />`}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Severity Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Severity Badges</CardTitle>
                <CardDescription>
                  Use severity badges for compliance results: ok, underpaid, needs-review, overpaid
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="mb-3">All Severities</h4>
                  <div className="flex flex-wrap gap-3">
                    <SeverityBadge severity="ok" />
                    <SeverityBadge severity="underpaid" />
                    <SeverityBadge severity="needs-review" />
                    <SeverityBadge severity="overpaid" />
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Sizes</h4>
                  <div className="flex flex-wrap gap-3 items-center">
                    <SeverityBadge severity="underpaid" size="sm" />
                    <SeverityBadge severity="underpaid" size="md" />
                    <SeverityBadge severity="underpaid" size="lg" />
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <code className="text-sm">
                    {`<SeverityBadge severity="underpaid" size="md" />`}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Anomaly Score Pills */}
            <Card>
              <CardHeader>
                <CardTitle>Anomaly Score Pills</CardTitle>
                <CardDescription>
                  Display risk scores from 0-100 with color-coded severity levels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="mb-3">Risk Levels</h4>
                  <div className="flex flex-wrap gap-4">
                    <AnomalyScorePill score={5} />
                    <AnomalyScorePill score={25} />
                    <AnomalyScorePill score={45} />
                    <AnomalyScorePill score={65} />
                    <AnomalyScorePill score={87} />
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Without Labels</h4>
                  <div className="flex flex-wrap gap-3">
                    <AnomalyScorePill score={25} showLabel={false} />
                    <AnomalyScorePill score={65} showLabel={false} />
                    <AnomalyScorePill score={87} showLabel={false} />
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Sizes</h4>
                  <div className="flex flex-wrap gap-3 items-center">
                    <AnomalyScorePill score={75} size="sm" showLabel={false} />
                    <AnomalyScorePill score={75} size="md" showLabel={false} />
                    <AnomalyScorePill score={75} size="lg" showLabel={false} />
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <code className="text-sm">
                    {`<AnomalyScorePill score={87} showLabel={true} size="md" />`}
                  </code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {/* Progress Steppers */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Stepper (Horizontal)</CardTitle>
                <CardDescription>
                  Use for multi-step workflows with clear progression
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressStepper steps={steps} orientation="horizontal" />
                
                <div className="mt-6 bg-muted/50 p-4 rounded-lg">
                  <code className="text-sm block">
                    {`<ProgressStepper steps={steps} orientation="horizontal" />`}
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Stepper (Vertical)</CardTitle>
                <CardDescription>
                  Alternative vertical layout for sidebar or narrow spaces
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressStepper steps={steps} orientation="vertical" />
                
                <div className="mt-6 bg-muted/50 p-4 rounded-lg">
                  <code className="text-sm block">
                    {`<ProgressStepper steps={steps} orientation="vertical" />`}
                  </code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            {/* Page Header */}
            <Card>
              <CardHeader>
                <CardTitle>Page Header</CardTitle>
                <CardDescription>
                  Standard page header with title, description, and actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PageHeader 
                  title="Page Title"
                  description="Page description goes here"
                  actions={
                    <>
                      <Button variant="outline">Secondary</Button>
                      <Button>Primary Action</Button>
                    </>
                  }
                />
                
                <div className="mt-6 bg-muted/50 p-4 rounded-lg">
                  <code className="text-sm block">
                    {`<PageHeader title="..." description="..." actions={<Button>...</Button>} />`}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Breadcrumb */}
            <Card>
              <CardHeader>
                <CardTitle>Breadcrumb Navigation</CardTitle>
                <CardDescription>
                  Hierarchical navigation with optional home icon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Breadcrumb 
                  items={[
                    { label: 'Dashboard', href: '#' },
                    { label: 'Employees', href: '#' },
                    { label: 'Ava Nguyen' }
                  ]}
                />
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <code className="text-sm block">
                    {`<Breadcrumb items={[{ label: '...', href: '#' }]} />`}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Empty State */}
            <Card>
              <CardHeader>
                <CardTitle>Empty State</CardTitle>
                <CardDescription>
                  Display when no data is available with optional action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyState 
                  icon={Inbox}
                  title="No items found"
                  description="You haven't uploaded any documents yet. Get started by uploading your first document."
                  action={<Button>Upload Document</Button>}
                />
                
                <div className="mt-6 bg-muted/50 p-4 rounded-lg">
                  <code className="text-sm block">
                    {`<EmptyState icon={Inbox} title="..." description="..." action={<Button>...</Button>} />`}
                  </code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>Standard colors for consistency across the application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="h-20 bg-green-100 border border-green-300 rounded-lg mb-2"></div>
                <div className="text-sm">OK / Success</div>
                <code className="text-xs text-muted-foreground">bg-green-100</code>
              </div>
              <div>
                <div className="h-20 bg-red-100 border border-red-300 rounded-lg mb-2"></div>
                <div className="text-sm">Underpaid / Error</div>
                <code className="text-xs text-muted-foreground">bg-red-100</code>
              </div>
              <div>
                <div className="h-20 bg-amber-100 border border-amber-300 rounded-lg mb-2"></div>
                <div className="text-sm">Needs Review / Warning</div>
                <code className="text-xs text-muted-foreground">bg-amber-100</code>
              </div>
              <div>
                <div className="h-20 bg-blue-100 border border-blue-300 rounded-lg mb-2"></div>
                <div className="text-sm">Running / Info</div>
                <code className="text-xs text-muted-foreground">bg-blue-100</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spacing System */}
        <Card>
          <CardHeader>
            <CardTitle>Spacing System</CardTitle>
            <CardDescription>Consistent spacing scale using Tailwind defaults</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <code className="w-16 text-sm">gap-2</code>
                <div className="h-8 bg-primary" style={{ width: '0.5rem' }}></div>
                <span className="text-sm text-muted-foreground">0.5rem / 8px</span>
              </div>
              <div className="flex items-center gap-4">
                <code className="w-16 text-sm">gap-4</code>
                <div className="h-8 bg-primary" style={{ width: '1rem' }}></div>
                <span className="text-sm text-muted-foreground">1rem / 16px</span>
              </div>
              <div className="flex items-center gap-4">
                <code className="w-16 text-sm">gap-6</code>
                <div className="h-8 bg-primary" style={{ width: '1.5rem' }}></div>
                <span className="text-sm text-muted-foreground">1.5rem / 24px</span>
              </div>
              <div className="flex items-center gap-4">
                <code className="w-16 text-sm">gap-8</code>
                <div className="h-8 bg-primary" style={{ width: '2rem' }}></div>
                <span className="text-sm text-muted-foreground">2rem / 32px</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
