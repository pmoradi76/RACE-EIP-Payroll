import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Shield, 
  Bell, 
  LogOut, 
  ArrowLeft,
  BookOpen,
  Upload,
  Search,
  Calendar,
  Tag,
  FileText,
  Check,
  X,
  Building2,
  Play,
  Clock,
  History,
  RotateCcw
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';

interface AwardsLibraryPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export function AwardsLibraryPage({ onBack, onLogout }: AwardsLibraryPageProps) {
  const [activeTab, setActiveTab] = useState('library');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAward, setSelectedAward] = useState<string | null>(null);

  const awards = [
    {
      id: 'aw-1',
      name: 'Children\'s Services Award 2010',
      code: 'MA000120',
      sector: ['Childcare', 'Education'],
      effectiveFrom: '01 Jul 2025',
      effectiveTo: 'Current',
      status: 'active' as const,
      indexingStatus: 'completed' as const,
      version: 'v4.2',
      clauses: 247,
      lastUpdated: '01 Jul 2025',
      organisations: 8
    },
    {
      id: 'aw-2',
      name: 'Retail Award 2020',
      code: 'MA000004',
      sector: ['Retail'],
      effectiveFrom: '15 Jun 2025',
      effectiveTo: 'Current',
      status: 'active' as const,
      indexingStatus: 'completed' as const,
      version: 'v3.8',
      clauses: 189,
      lastUpdated: '15 Jun 2025',
      organisations: 12
    },
    {
      id: 'aw-3',
      name: 'Hospitality Award 2020',
      code: 'MA000009',
      sector: ['Hospitality', 'Food Service'],
      effectiveFrom: '10 May 2025',
      effectiveTo: 'Current',
      status: 'active' as const,
      indexingStatus: 'processing' as const,
      version: 'v2.1',
      clauses: 203,
      lastUpdated: '10 May 2025',
      organisations: 6
    },
    {
      id: 'aw-4',
      name: 'Healthcare Award 2010',
      code: 'MA000027',
      sector: ['Healthcare'],
      effectiveFrom: 'Pending',
      effectiveTo: '-',
      status: 'draft' as const,
      indexingStatus: 'pending' as const,
      version: 'v1.0',
      clauses: 0,
      lastUpdated: '-',
      organisations: 0
    },
    {
      id: 'aw-5',
      name: 'Educational Services Award 2020',
      code: 'MA000077',
      sector: ['Education'],
      effectiveFrom: '12 Aug 2025',
      effectiveTo: 'Current',
      status: 'active' as const,
      indexingStatus: 'completed' as const,
      version: 'v2.5',
      clauses: 221,
      lastUpdated: '12 Aug 2025',
      organisations: 5
    },
  ];

  const clauseBrowser = [
    { 
      topic: 'Penalty Rates', 
      clauseCount: 12, 
      clauses: [
        { number: '25.3', text: 'Evening work (after 6pm on weekdays): 110% of ordinary rate' },
        { number: '25.4', text: 'Saturday work: 150% of ordinary rate' },
        { number: '25.5', text: 'Sunday work: 200% of ordinary rate' },
      ]
    },
    { 
      topic: 'Casual Loading', 
      clauseCount: 3,
      clauses: [
        { number: '12.2', text: 'Casual employees entitled to 25% loading on all hours worked' },
      ]
    },
    { 
      topic: 'Allowances', 
      clauseCount: 8,
      clauses: [
        { number: '19.4', text: 'Split shift allowance: $18.50 per shift' },
        { number: '19.5', text: 'Meal allowance: $15.20 when working overtime' },
      ]
    },
    { 
      topic: 'Classifications', 
      clauseCount: 15,
      clauses: [
        { number: '13.1', text: 'Level 1: Introductory educator - $28.50/hr' },
        { number: '13.2', text: 'Level 2: Qualified educator - $32.40/hr' },
      ]
    },
  ];

  const organisationMapping = [
    {
      id: '1',
      name: 'BrightSteps Early Learning',
      state: 'VIC',
      awardPack: 'Children\'s Services Award',
      enterpriseAgreement: 'None',
      effectiveDate: '01 Jan 2025',
      status: 'mapped' as const
    },
    {
      id: '2',
      name: 'Metro Retail Group',
      state: 'NSW',
      awardPack: 'Retail Award',
      enterpriseAgreement: 'Metro Retail EA 2024',
      effectiveDate: '15 Jun 2024',
      status: 'mapped' as const
    },
    {
      id: '3',
      name: 'Sunshine Coast Hospitality',
      state: 'QLD',
      awardPack: 'Hospitality Award',
      enterpriseAgreement: 'None',
      effectiveDate: '10 May 2025',
      status: 'pending' as const
    },
  ];

  const versionHistory = [
    {
      version: 'v4.2',
      date: '01 Jul 2025',
      changes: 'Annual wage increase, updated penalty rate thresholds',
      status: 'active' as const
    },
    {
      version: 'v4.1',
      date: '15 Mar 2025',
      changes: 'Casual loading adjustment, new allowances',
      status: 'archived' as const
    },
    {
      version: 'v4.0',
      date: '01 Jan 2025',
      changes: 'Major restructure of classification levels',
      status: 'archived' as const
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
              <div className="flex items-center gap-2">
                <Shield className="size-6 md:size-7 text-primary flex-shrink-0" />
                <span className="text-lg md:text-xl">PayGuard</span>
              </div>
              <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
                <span>/</span>
                <span>Awards Library</span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
              </Button>
              
              <div className="text-right hidden lg:block">
                <div className="text-sm">Mark Smith</div>
                <div className="text-xs text-muted-foreground">System Admin</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                MS
              </div>
              <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={onLogout}>
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2 mb-4">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl mb-2">Awards & Agreements Library</h1>
              <p className="text-muted-foreground">
                Manage Modern Awards, enterprise agreements, and organisation mappings
              </p>
            </div>
            <Button className="gap-2" onClick={() => setShowUploadModal(true)}>
              <Upload className="size-4" />
              Upload New Award
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="library">Award Library</TabsTrigger>
            <TabsTrigger value="clauses">Clause Browser</TabsTrigger>
            <TabsTrigger value="mapping">Organisation Mapping</TabsTrigger>
            <TabsTrigger value="versions">Version Control</TabsTrigger>
          </TabsList>

          {/* Tab 1: Award Library */}
          <TabsContent value="library" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Modern Awards</CardTitle>
                    <CardDescription>
                      {awards.length} awards configured
                    </CardDescription>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input placeholder="Search awards..." className="pl-9" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Award Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead className="hidden md:table-cell">Sector</TableHead>
                        <TableHead className="hidden lg:table-cell">Effective Date</TableHead>
                        <TableHead>Indexing</TableHead>
                        <TableHead className="hidden xl:table-cell">Clauses</TableHead>
                        <TableHead className="hidden xl:table-cell">Orgs</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {awards.map((award) => (
                        <TableRow key={award.id}>
                          <TableCell className="font-medium">{award.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-xs">
                              {award.code}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {award.sector.slice(0, 2).map((s, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                            {award.effectiveFrom}
                          </TableCell>
                          <TableCell>
                            {award.indexingStatus === 'completed' && (
                              <div className="flex items-center gap-1 text-green-600 text-sm">
                                <Check className="size-4" />
                                <span className="hidden sm:inline">Done</span>
                              </div>
                            )}
                            {award.indexingStatus === 'processing' && (
                              <div className="flex items-center gap-1 text-blue-600 text-sm">
                                <Clock className="size-4 animate-spin" />
                                <span className="hidden sm:inline">Processing</span>
                              </div>
                            )}
                            {award.indexingStatus === 'pending' && (
                              <div className="flex items-center gap-1 text-amber-600 text-sm">
                                <Clock className="size-4" />
                                <span className="hidden sm:inline">Pending</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-muted-foreground">
                            {award.clauses}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-muted-foreground">
                            {award.organisations}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={award.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {award.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => setSelectedAward(award.id)}>
                                Edit
                              </Button>
                              {award.indexingStatus === 'pending' && (
                                <Button size="sm" variant="outline" className="gap-1">
                                  <Play className="size-3" />
                                  Index
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Award Details Panel */}
            {selectedAward && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Award Details</CardTitle>
                  <CardDescription>
                    {awards.find(a => a.id === selectedAward)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Award Code</Label>
                      <Input defaultValue={awards.find(a => a.id === selectedAward)?.code} />
                    </div>
                    <div className="space-y-2">
                      <Label>Version</Label>
                      <Input defaultValue={awards.find(a => a.id === selectedAward)?.version} />
                    </div>
                    <div className="space-y-2">
                      <Label>Effective From</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Effective To</Label>
                      <Input type="date" placeholder="Leave blank for current" />
                    </div>
                    <div className="space-y-2">
                      <Label>Sector Tags</Label>
                      <div className="flex flex-wrap gap-2">
                        {awards.find(a => a.id === selectedAward)?.sector.map((s, i) => (
                          <Badge key={i} variant="secondary" className="gap-1">
                            <Tag className="size-3" />
                            {s}
                            <button className="ml-1 hover:text-red-600">
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                        <Button size="sm" variant="outline" className="h-6 text-xs">
                          + Add Tag
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select defaultValue={awards.find(a => a.id === selectedAward)?.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Indexing Pipeline */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-blue-900">Award Indexing Pipeline</div>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Play className="size-4" />
                        Run Indexing
                      </Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>PDF parsing & extraction</span>
                        <Check className="size-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Clause identification</span>
                        <Check className="size-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Vector embedding generation</span>
                        <Check className="size-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Semantic search index</span>
                        <Check className="size-4 text-green-600" />
                      </div>
                    </div>
                    <Progress value={100} className="h-2 mt-3" />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">Save Changes</Button>
                    <Button variant="outline" onClick={() => setSelectedAward(null)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab 2: Clause Browser */}
          <TabsContent value="clauses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Clause Browser</CardTitle>
                <CardDescription>
                  Search and explore award clauses by topic
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input placeholder="Search by topic, clause number, or keyword..." className="pl-9" />
                </div>

                {clauseBrowser.map((topic, index) => (
                  <div key={index} className="border border-border rounded-lg overflow-hidden">
                    <div className="p-4 bg-muted/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="size-5 text-primary" />
                        <div>
                          <div className="font-medium">{topic.topic}</div>
                          <div className="text-sm text-muted-foreground">
                            {topic.clauseCount} clauses
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        Expand All
                      </Button>
                    </div>
                    <div className="divide-y divide-border">
                      {topic.clauses.map((clause, i) => (
                        <div key={i} className="p-4 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start gap-3">
                            <Badge variant="outline" className="font-mono text-xs mt-0.5">
                              {clause.number}
                            </Badge>
                            <div className="flex-1">
                              <p className="text-sm">{clause.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Organisation Mapping */}
          <TabsContent value="mapping" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Organisation Mapping</CardTitle>
                <CardDescription>
                  Assign award packs and enterprise agreements to tenant organisations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Organisation</TableHead>
                        <TableHead className="hidden md:table-cell">State</TableHead>
                        <TableHead>Award Pack</TableHead>
                        <TableHead className="hidden lg:table-cell">Enterprise Agreement</TableHead>
                        <TableHead className="hidden xl:table-cell">Effective Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {organisationMapping.map((org) => (
                        <TableRow key={org.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Building2 className="size-4 text-muted-foreground" />
                              {org.name}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline" className="text-xs">
                              {org.state}
                            </Badge>
                          </TableCell>
                          <TableCell>{org.awardPack}</TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                            {org.enterpriseAgreement}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                            {org.effectiveDate}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={org.status === 'mapped' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {org.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Version Control */}
          <TabsContent value="versions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Version History</CardTitle>
                <CardDescription>
                  Track changes and rollback to previous versions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {versionHistory.map((version, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        version.status === 'active' ? 'bg-green-500' : 'bg-muted-foreground'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="font-mono">
                            {version.version}
                          </Badge>
                          {version.status === 'active' && (
                            <Badge variant="default" className="text-xs">
                              Current
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {version.date}
                          </span>
                        </div>
                        <p className="text-sm">{version.changes}</p>
                      </div>
                      {version.status === 'archived' && (
                        <Button size="sm" variant="outline" className="gap-2">
                          <RotateCcw className="size-4" />
                          Rollback
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Upload New Award</CardTitle>
              <CardDescription>
                Upload Award PDF and configure indexing pipeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                <Upload className="size-12 mx-auto mb-4 text-muted-foreground" />
                <div className="text-sm mb-2">
                  Drag and drop Award PDF here, or click to browse
                </div>
                <div className="text-xs text-muted-foreground">
                  Maximum file size: 50MB
                </div>
                <Button className="mt-4">
                  Choose File
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Award Name</Label>
                  <Input placeholder="e.g., Retail Award 2020" />
                </div>
                <div className="space-y-2">
                  <Label>Award Code</Label>
                  <Input placeholder="e.g., MA000004" />
                </div>
                <div className="space-y-2">
                  <Label>Effective From</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Sector Tags</Label>
                  <Input placeholder="Add tags..." />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1 gap-2">
                  <Upload className="size-4" />
                  Upload & Run Indexing
                </Button>
                <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
