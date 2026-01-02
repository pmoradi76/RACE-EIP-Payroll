import { AdminDashboardShell } from '../shells/AdminDashboardShell';
import { PageHeader } from '../design-system/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { StatusBadge } from '../design-system/StatusBadge';
import { Database, Activity, Cpu, Zap, BookOpen, MessageSquare } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function AdminDashboard() {
  const systemMetrics = [
    { label: 'API Requests (24h)', value: '15,234', change: '+12%', trend: 'up' },
    { label: 'Active Users', value: '89', change: '+5', trend: 'up' },
    { label: 'Avg Response Time', value: '234ms', change: '-18ms', trend: 'down' },
    { label: 'Success Rate', value: '99.7%', change: '+0.2%', trend: 'up' }
  ];

  const agentPerformance = [
    { agent: 'Award Agent', requests: 3421, avgTime: '180ms', successRate: 99.8, status: 'done' as const },
    { agent: 'Contract Agent', requests: 3421, avgTime: '245ms', successRate: 99.5, status: 'done' as const },
    { agent: 'Calculator Agent', requests: 3421, avgTime: '120ms', successRate: 100, status: 'done' as const },
    { agent: 'Explanation Agent', requests: 2847, avgTime: '890ms', successRate: 98.2, status: 'running' as const }
  ];

  const awardLibrary = [
    { id: '1', name: 'Children\'s Services Award 2010', version: 'MA000120', lastUpdated: '01 Jul 2025', status: 'done' as const },
    { id: '2', name: 'Retail Award 2020', version: 'MA000004', lastUpdated: '15 Jun 2025', status: 'done' as const },
    { id: '3', name: 'Hospitality Award 2020', version: 'MA000009', lastUpdated: '10 May 2025', status: 'needs-review' as const },
    { id: '4', name: 'Healthcare Award 2010', version: 'MA000027', lastUpdated: 'Pending', status: 'pending' as const }
  ];

  return (
    <AdminDashboardShell>
      <PageHeader 
        title="System Overview"
        description="Monitor and manage PayGuard infrastructure"
      />

      {/* System Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        {systemMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-3xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-blue-600'}`}>
                {metric.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Health */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Real-time infrastructure monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Database className="size-4 text-muted-foreground" />
                  <span className="text-sm">Database Performance</span>
                </div>
                <span className="text-sm text-green-600">Optimal</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="size-4 text-muted-foreground" />
                  <span className="text-sm">CPU Usage</span>
                </div>
                <span className="text-sm">34%</span>
              </div>
              <Progress value={34} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-muted-foreground" />
                  <span className="text-sm">API Rate Limit</span>
                </div>
                <span className="text-sm">67% remaining</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="agents">Agent Performance</TabsTrigger>
          <TabsTrigger value="awards">Award Library</TabsTrigger>
          <TabsTrigger value="prompts">Prompt Bank</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance (Last 24h)</CardTitle>
              <CardDescription>Request volume and success rates by agent</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Avg Time</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agentPerformance.map((agent, index) => (
                    <TableRow key={index}>
                      <TableCell>{agent.agent}</TableCell>
                      <TableCell>{agent.requests.toLocaleString()}</TableCell>
                      <TableCell>{agent.avgTime}</TableCell>
                      <TableCell>
                        <span className={agent.successRate >= 99 ? 'text-green-600' : 'text-amber-600'}>
                          {agent.successRate}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={agent.status} size="sm" />
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">Configure</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="awards" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Award Library</CardTitle>
                  <CardDescription>Manage Modern Award configurations</CardDescription>
                </div>
                <Button className="gap-2">
                  <BookOpen className="size-4" />
                  Add Award
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Award Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {awardLibrary.map((award) => (
                    <TableRow key={award.id}>
                      <TableCell>{award.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{award.version}</TableCell>
                      <TableCell className="text-sm">{award.lastUpdated}</TableCell>
                      <TableCell>
                        <StatusBadge status={award.status} size="sm" />
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Prompt Bank</CardTitle>
                  <CardDescription>Manage agent instruction templates</CardDescription>
                </div>
                <Button className="gap-2">
                  <MessageSquare className="size-4" />
                  New Prompt
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Award Extraction', 'Contract Parsing', 'Underpayment Detection', 'Explanation Generation'].map((prompt, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <div>{prompt}</div>
                      <div className="text-sm text-muted-foreground">Last modified: 2 days ago</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">Edit</Button>
                      <Button size="sm" variant="ghost">Test</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Model Configuration</CardTitle>
            <CardDescription>Configure AI model routing</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Manage Models</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>View system activity logs</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">View Logs</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user access & permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Manage Users</Button>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardShell>
  );
}
