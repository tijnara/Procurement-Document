import { useState } from 'react';
import { ProcurementForm, ProcurementRequest } from './components/ProcurementForm';
import { ProcurementDashboard } from './components/ProcurementDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Building2, Settings } from 'lucide-react';

export default function App() {
  // Mock initial data
  const [requests, setRequests] = useState<ProcurementRequest[]>([
    {
      id: '1',
      itemName: 'Dell Laptop (i7, 16GB RAM)',
      quantity: 5,
      estimatedCost: 45000,
      purpose: 'For new hires in IT support team to handle increased workload',
      requestor: 'John Smith',
      department: 'IT',
      priority: 'urgent',
      status: 'pending',
      dateRequested: '2024-01-15',
      budgetCode: 'IT-2024-Q1',
    },
    {
      id: '2',
      itemName: 'Cisco Network Switch (24-port)',
      quantity: 2,
      estimatedCost: 12000,
      purpose: 'Upgrade network infrastructure for faster connectivity in building B',
      requestor: 'Maria Garcia',
      department: 'IT',
      priority: 'routine',
      status: 'approved',
      dateRequested: '2024-01-10',
      budgetCode: 'NET-2024-Q1',
    },
    {
      id: '3',
      itemName: 'Microsoft 365 Business License',
      quantity: 10,
      estimatedCost: 3000,
      purpose: 'Annual subscription renewal for productivity tools',
      requestor: 'David Kim',
      department: 'IT',
      priority: 'planned',
      status: 'in-review',
      dateRequested: '2024-01-12',
      budgetCode: 'SW-2024-Q1',
    },
    {
      id: '4',
      itemName: 'HP LaserJet Pro Printer',
      quantity: 3,
      estimatedCost: 8500,
      purpose: 'Replace old printers in accounting department',
      requestor: 'Sarah Wilson',
      department: 'Finance',
      priority: 'routine',
      status: 'rejected',
      dateRequested: '2024-01-08',
      budgetCode: 'OFFICE-2024-Q1',
    },
  ]);

  const handleAddRequest = (newRequestData: Omit<ProcurementRequest, 'id' | 'status' | 'dateRequested'>) => {
    const newRequest: ProcurementRequest = {
      ...newRequestData,
      id: Date.now().toString(),
      status: 'pending',
      dateRequested: new Date().toISOString().split('T')[0],
    };
    
    setRequests(prev => [newRequest, ...prev]);
  };

  const handleStatusChange = (id: string, newStatus: ProcurementRequest['status']) => {
    setRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, status: newStatus } : request
      )
    );
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Procurement Management</h1>
              <p className="text-muted-foreground mt-1">
                Streamline your IT procurement requests and approval workflow
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                Acme Corp
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="new-request">New Request</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <ProcurementDashboard 
              requests={requests} 
              onStatusChange={handleStatusChange}
            />
          </TabsContent>

          <TabsContent value="new-request">
            <div className="flex justify-center">
              <ProcurementForm onSubmit={handleAddRequest} />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Approval Workflow</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>
                        <span>→ Initial submission</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">In Review</Badge>
                        <span>→ Under evaluation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700">Approved</Badge>
                        <span>→ Ready for procurement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-red-50 text-red-700">Rejected</Badge>
                        <span>→ Request denied</span>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-3">System Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <strong>Version:</strong> 1.0.0
                    </div>
                    <div>
                      <strong>Last Updated:</strong> January 2024
                    </div>
                    <div>
                      <strong>Total Users:</strong> 25
                    </div>
                    <div>
                      <strong>Active Requests:</strong> {requests.filter(r => r.status === 'pending' || r.status === 'in-review').length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}