import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { SeverityBadge } from '../../design-system/SeverityBadge';
import { AnomalyScorePill } from '../../design-system/AnomalyScorePill';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Progress } from '../../ui/progress';
import { Download, FileText, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import { WizardData } from '../PayCheckWizard';

interface ResultsStepProps {
  data: WizardData;
  onClose: () => void;
}

export function ResultsStep({ data, onClose }: ResultsStepProps) {
  const results = data.results || {
    status: 'underpaid',
    paid: 540,
    entitled: 612,
    difference: -72,
    anomalyScore: 86,
    confidence: 0.86
  };

  const calculationBreakdown = [
    {
      description: 'Ordinary hours (16 hrs @ $28.00/hr)',
      expected: 448.00,
      actual: 448.00,
      difference: 0
    },
    {
      description: 'Evening hours (2 hrs @ $34.00/hr)',
      expected: 68.00,
      actual: 56.00,
      difference: -12.00
    },
    {
      description: 'Casual loading (25% on ordinary)',
      expected: 112.00,
      actual: 112.00,
      difference: 0
    },
    {
      description: 'Casual loading (25% on evening)',
      expected: 17.00,
      actual: 0,
      difference: -17.00
    }
  ];

  const evidenceItems = [
    {
      type: 'Contract',
      title: 'Evening rate clause',
      excerpt: '"Shifts worked after 6:00pm shall be paid at $34.00 per hour"',
      page: 'Page 3, Clause 4.2'
    },
    {
      type: 'Worksheet',
      title: 'Shift on 05 Aug 2025',
      excerpt: '18:00–20:00 (2 hours)',
      page: 'Row 5'
    },
    {
      type: 'Payslip',
      title: 'Payment line item',
      excerpt: 'Ordinary hours: 18.0 hrs @ $28.00 = $504.00',
      page: 'Line 2'
    },
    {
      type: 'Award',
      title: 'Children\'s Services Award 2010',
      excerpt: 'Clause 25.3 - Casual loading of 25% applies to all ordinary and penalty rates',
      page: 'MA000120, Clause 25.3'
    }
  ];

  const timeline = [
    { time: '14:32:01', event: 'Files uploaded', agent: 'System' },
    { time: '14:32:03', event: 'Contract parsed', agent: 'Contract Agent' },
    { time: '14:32:05', event: 'Award identified: Children\'s Services Award 2010', agent: 'Award Agent' },
    { time: '14:32:08', event: 'Shift data extracted', agent: 'Worksheet Agent' },
    { time: '14:32:11', event: 'Payment data extracted', agent: 'Payslip Agent' },
    { time: '14:32:15', event: 'Award clauses retrieved', agent: 'Retrieval Agent' },
    { time: '14:32:22', event: 'Entitlements calculated', agent: 'Calculator Agent' },
    { time: '14:32:28', event: 'Underpayment detected: -$72.00', agent: 'Underpayment Detector' },
    { time: '14:32:35', event: 'Explanation generated', agent: 'Explanation Agent' },
    { time: '14:32:38', event: 'Quality checks passed', agent: 'Guardrail Agent' },
    { time: '14:32:40', event: 'Analysis complete', agent: 'System' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg mb-1">Analysis Complete</h3>
        <p className="text-sm text-muted-foreground">
          Your pay check has been analyzed by our AI agents
        </p>
      </div>

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="calculation">Calculation</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <div className="text-sm text-muted-foreground mb-1">You Were Paid</div>
                <CardTitle className="text-2xl">${results.paid.toFixed(2)}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-sm text-muted-foreground mb-1">You're Entitled To</div>
                <CardTitle className="text-2xl text-green-600">${results.entitled.toFixed(2)}</CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <div className="text-sm text-red-900 mb-1">Difference</div>
                <CardTitle className="text-2xl text-red-600">
                  −${Math.abs(results.difference).toFixed(2)}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <SeverityBadge severity="underpaid" size="sm" />
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detection Confidence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Anomaly Score</span>
                <AnomalyScorePill score={results.anomalyScore} showLabel={true} size="md" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">AI Confidence</span>
                  <span className="text-sm">{(results.confidence * 100).toFixed(0)}%</span>
                </div>
                <Progress value={results.confidence * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Explanation */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-base">What We Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-blue-900 leading-relaxed">
                <p>
                  You worked <strong>2 hours after 6pm on 05 Aug 2025</strong> (from 18:00 to 20:00).
                </p>
                <p>
                  Your contract and the <strong>Children's Services Award 2010</strong> require these hours 
                  to be paid at the evening rate of <strong>$34.00/hr</strong>, but your payslip shows they 
                  were paid at the ordinary rate of <strong>$28.00/hr</strong>.
                </p>
                <p>
                  Additionally, the 25% casual loading should apply to both ordinary and evening rates, 
                  but it was only applied to your ordinary hours.
                </p>
                <p className="pt-2 border-t border-blue-200">
                  <strong>Bottom line:</strong> You should have been paid an additional <strong>$72.00</strong> for this pay period.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calculation Tab */}
        <TabsContent value="calculation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detailed Calculation Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Expected</TableHead>
                    <TableHead className="text-right">Actually Paid</TableHead>
                    <TableHead className="text-right">Difference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calculationBreakdown.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">${item.expected.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.actual.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        {item.difference !== 0 && (
                          <span className={item.difference < 0 ? 'text-red-600' : 'text-green-600'}>
                            {item.difference < 0 ? '−' : '+'}${Math.abs(item.difference).toFixed(2)}
                          </span>
                        )}
                        {item.difference === 0 && (
                          <span className="text-muted-foreground">$0.00</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2">
                    <TableCell><strong>Total</strong></TableCell>
                    <TableCell className="text-right"><strong>${results.entitled.toFixed(2)}</strong></TableCell>
                    <TableCell className="text-right"><strong>${results.paid.toFixed(2)}</strong></TableCell>
                    <TableCell className="text-right">
                      <strong className="text-red-600">
                        −${Math.abs(results.difference).toFixed(2)}
                      </strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-900">
                <strong>Note:</strong> All calculations are based on your contract terms, 
                the Children's Services Award 2010 (MA000120), and Victorian legislation. 
                Rates shown include the 25% casual loading as specified in your contract.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Evidence List */}
            <div className="space-y-3">
              <h4 className="text-sm">Evidence Items</h4>
              {evidenceItems.map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                            {item.type}
                          </span>
                          <span className="text-xs text-muted-foreground">{item.page}</span>
                        </div>
                        <div className="text-sm mb-1">{item.title}</div>
                        <div className="text-xs text-muted-foreground italic">
                          "{item.excerpt}"
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Document Viewer */}
            <div>
              <h4 className="text-sm mb-3">Document Viewer</h4>
              <div className="border border-border rounded-lg bg-muted/30 aspect-[3/4] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileText className="size-12 mx-auto mb-2" />
                  <p className="text-sm">Click an evidence item to view</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Agent Execution Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {timeline.map((entry, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className="text-xs text-muted-foreground w-16 flex-shrink-0 pt-0.5">
                      {entry.time}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm mb-1">{entry.event}</div>
                      <div className="text-xs text-muted-foreground">{entry.agent}</div>
                    </div>
                    {entry.event.includes('complete') || entry.event.includes('passed') ? (
                      <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="size-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-900">
                  <strong>Quality Verified:</strong> All agents completed successfully and 
                  the Guardrail Agent confirmed the analysis meets quality standards.
                  Total processing time: 39 seconds.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-6 border-t border-border">
        <Button size="lg" className="gap-2">
          <Download className="size-4" />
          Download Evidence Pack (PDF)
        </Button>
        <Button variant="outline" size="lg" className="gap-2">
          <Download className="size-4" />
          Download CSV
        </Button>
        <Button variant="outline" size="lg" onClick={onClose} className="gap-2">
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
