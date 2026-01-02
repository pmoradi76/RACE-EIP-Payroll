import { AlertCircle, FileText, Calendar, BookOpen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export function DemoPreview() {
  const shifts = [
    { date: "05 Aug", day: "Mon", start: "09:00", end: "17:00", hours: 8, type: "Ordinary" },
    { date: "05 Aug", day: "Mon", start: "18:00", end: "20:00", hours: 2, type: "Evening", highlight: true },
    { date: "07 Aug", day: "Wed", start: "09:00", end: "17:00", hours: 8, type: "Ordinary" },
    { date: "12 Aug", day: "Mon", start: "09:00", end: "17:00", hours: 8, type: "Ordinary" }
  ];

  const payslipLines = [
    { description: "Ordinary hours (26 hrs)", rate: "$21.00", amount: "$546.00" },
    { description: "Evening hours (2 hrs)", rate: "$21.00", amount: "$42.00", highlight: true }
  ];

  return (
    <section id="demo" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Live Example: Childcare Sector</Badge>
          <h2 className="mb-3">Sample Underpayment Detection</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-world scenario demonstrating how PayGuard detects and explains pay discrepancies
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl border border-border shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1">Ava Nguyen</h3>
                <p className="text-sm text-muted-foreground">Casual Educator, Little Learners Childcare</p>
              </div>
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="size-3" />
                Underpaid
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Pay Period:</span>
                <span className="ml-2">01–14 Aug 2025</span>
              </div>
              <div>
                <span className="text-muted-foreground">Award:</span>
                <span className="ml-2">Children's Services Award 2010</span>
              </div>
            </div>
          </div>

          {/* Main Result */}
          <div className="p-6 border-b border-border bg-red-50/30">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Paid</div>
                <div className="text-2xl">$540.00</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Entitled</div>
                <div className="text-2xl text-green-600">$612.00</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Shortfall</div>
                <div className="text-2xl text-red-600">−$72.00</div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 border border-border">
              <h4 className="mb-2 flex items-center gap-2">
                <AlertCircle className="size-4 text-red-600" />
                Issue Detected
              </h4>
              <p className="text-sm mb-3">
                2 hours worked after 6pm on Monday 05 Aug were paid at ordinary rate ($21.00/hr) instead of evening rate ($26.25/hr, 25% loading).
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1 text-xs">
                  <FileText className="size-3" />
                  Contract §3.2
                </Badge>
                <Badge variant="outline" className="gap-1 text-xs">
                  <Calendar className="size-3" />
                  Worksheet: 05 Aug 18:00–20:00
                </Badge>
                <Badge variant="outline" className="gap-1 text-xs">
                  <BookOpen className="size-3" />
                  Award p.12 (Clause 25.3)
                </Badge>
              </div>
            </div>
          </div>

          {/* Supporting Data */}
          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="mb-3">Timesheet Extract</h4>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Hrs</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shifts.map((shift, i) => (
                      <TableRow key={i} className={shift.highlight ? 'bg-red-50' : ''}>
                        <TableCell className="text-sm">{shift.date}</TableCell>
                        <TableCell className="text-sm">{shift.start}–{shift.end}</TableCell>
                        <TableCell className="text-sm">{shift.hours}</TableCell>
                        <TableCell className="text-sm">{shift.type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h4 className="mb-3">Payslip Line Items</h4>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payslipLines.map((line, i) => (
                      <TableRow key={i} className={line.highlight ? 'bg-red-50' : ''}>
                        <TableCell className="text-sm">{line.description}</TableCell>
                        <TableCell className="text-sm">{line.rate}</TableCell>
                        <TableCell className="text-sm">{line.amount}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="text-sm">Total</TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-sm">$540.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="px-6 py-4 bg-muted/30 border-t border-border">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Childcare by default; extensible to other sectors.</strong> PayGuard currently supports Children's Services Award 2010 and can be extended to Retail, Hospitality, Healthcare, and other Modern Awards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
