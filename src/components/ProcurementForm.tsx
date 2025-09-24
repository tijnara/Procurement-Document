import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Plus } from 'lucide-react';

export interface ProcurementRequest {
  id: string;
  itemName: string;
  quantity: number;
  estimatedCost: number;
  purpose: string;
  requestor: string;
  department: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-review';
  dateRequested: string;
  budgetCode: string;
  link?: string;
  transactionType?: 'trade' | 'non-trade';
  priority?: 'urgent' | 'routine' | 'planned';
}

interface ProcurementFormProps {
  onSubmit: (request: Omit<ProcurementRequest, 'id' | 'status' | 'dateRequested'>) => void;
}

export function ProcurementForm({ onSubmit }: ProcurementFormProps) {
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: 1,
    estimatedCost: 0,
    purpose: '',
    requestor: '',
    department: '',
    transactionType: 'trade' as const,
    budgetCode: '',
    link: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemName || !formData.requestor || !formData.department) {
      alert('Please fill in all required fields');
      return;
    }
    
    onSubmit(formData);
    
    // Reset form
    setFormData({
      itemName: '',
      quantity: 1,
      estimatedCost: 0,
      purpose: '',
      requestor: '',
      department: '',
      transactionType: 'trade',
      budgetCode: '',
      link: '',
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Procurement Request
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Description *</Label>
              <Input
                id="itemName"
                value={formData.itemName}
                onChange={(e) => handleInputChange('itemName', e.target.value)}
                placeholder="e.g., Laptop (i7, 16GB RAM)"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Cost (₱)</Label>
              <Input
                id="estimatedCost"
                type="number"
                min="0"
                step="0.01"
                value={formData.estimatedCost}
                onChange={(e) => handleInputChange('estimatedCost', parseFloat(e.target.value) || 0)}
                placeholder="45000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budgetCode">Procurement No.</Label>
              <Input
                id="budgetCode"
                value={formData.budgetCode}
                onChange={(e) => handleInputChange('budgetCode', e.target.value)}
                placeholder="IT-2024-Q4"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requestor">Requestor Name *</Label>
              <Input
                id="requestor"
                value={formData.requestor}
                onChange={(e) => handleInputChange('requestor', e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">Information Technology</SelectItem>
                  <SelectItem value="HR">Human Resources</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transactionType">Transaction Type</Label>
              <Select value={formData.transactionType} onValueChange={(value: 'trade' | 'non-trade') => handleInputChange('transactionType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trade">Trade</SelectItem>
                  <SelectItem value="non-trade">Non-trade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              value={formData.link}
              onChange={(e) => handleInputChange('link', e.target.value)}
              placeholder="https://example.com/item"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose / Justification</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
              placeholder="Explain why this item is needed and how it will be used..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Procurement Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}