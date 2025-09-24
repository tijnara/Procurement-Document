import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ProcurementRequest } from './ProcurementForm';
import { Calendar, User, Building2, Banknote, Package, AlertCircle } from 'lucide-react';

interface RequestCardProps {
  request: ProcurementRequest;
  onStatusChange?: (id: string, newStatus: ProcurementRequest['status']) => void;
  showActions?: boolean;
}

export function RequestCard({ request, onStatusChange, showActions = false }: RequestCardProps) {
  const getStatusColor = (status: ProcurementRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'in-review': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', { 
      style: 'currency', 
      currency: 'PHP' 
    }).format(amount);
  };

  const totalCost = request.quantity * request.estimatedCost;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {request.itemName}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={getStatusColor(request.status)}>
              {request.status.replace('-', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{request.requestor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{request.department}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(request.dateRequested).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>Qty: {request.quantity}</span>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              <span>{formatCurrency(request.estimatedCost)} each</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              <span>Total: {formatCurrency(totalCost)}</span>
            </div>
          </div>
        </div>

        {request.budgetCode && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm"><strong>Procurement No.:</strong> {request.budgetCode}</p>
          </div>
        )}

        {request.link && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm"><strong>Link:</strong> <a href={request.link} target="_blank" rel="noreferrer" className="text-blue-600 underline">{request.link}</a></p>
          </div>
        )}

        {request.transactionType && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm"><strong>Transaction Type:</strong> {request.transactionType === 'trade' ? 'Trade' : 'Non-trade'}</p>
          </div>
        )}

        {request.purpose && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Justification:</p>
                <p className="text-sm text-muted-foreground mt-1">{request.purpose}</p>
              </div>
            </div>
          </div>
        )}

        {showActions && onStatusChange && request.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onStatusChange(request.id, 'in-review')}
            >
              Review
            </Button>
            <Button 
              size="sm" 
              onClick={() => onStatusChange(request.id, 'approved')}
            >
              Approve
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onStatusChange(request.id, 'rejected')}
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}