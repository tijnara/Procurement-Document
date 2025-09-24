import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ProcurementRequest } from './ProcurementForm';
import { RequestCard } from './RequestCard';
import { BarChart3, Package, Clock, CheckCircle, Banknote } from 'lucide-react';

interface ProcurementDashboardProps {
  requests: ProcurementRequest[];
  onStatusChange: (id: string, newStatus: ProcurementRequest['status']) => void;
}

export function ProcurementDashboard({ requests, onStatusChange }: ProcurementDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredRequests = requests.filter(request => {
    const statusMatch = filterStatus === 'all' || request.status === filterStatus;
    return statusMatch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    inReview: requests.filter(r => r.status === 'in-review').length,
    totalValue: requests.reduce((sum, r) => sum + (r.quantity * r.estimatedCost), 0),
    approvedValue: requests
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + (r.quantity * r.estimatedCost), 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', { 
      style: 'currency', 
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4" />
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Banknote className="h-4 w-4" />
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Approved: {formatCurrency(stats.approvedValue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Request List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Procurement Requests
          </CardTitle>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Status:</span>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grid" className="w-full">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid" className="mt-4">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No requests found matching the current filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredRequests.map((request) => (
                    <div key={request.id}>
                      <RequestCard
                        request={request}
                        onStatusChange={onStatusChange}
                        showActions={true}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="list" className="mt-4">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No requests found matching the current filters.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <div key={request.id}>
                      <RequestCard
                        request={request}
                        onStatusChange={onStatusChange}
                        showActions={true}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}