import { useEffect, useState } from 'react';
import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Plus, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';

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
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([]);
  const [deptLoading, setDeptLoading] = useState<boolean>(false);
  const [deptError, setDeptError] = useState<string | null>(null);

  const [users, setUsers] = useState<{ value: string; label: string }[]>([]);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [requestorOpen, setRequestorOpen] = useState<boolean>(false);
  const [deptOpen, setDeptOpen] = useState<boolean>(false);

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

  useEffect(() => {
    let isMounted = true;
    async function loadDepartments() {
      try {
        setDeptLoading(true);
        setDeptError(null);
        const res = await fetch('http://localhost:8055/items/department');
        if (!res.ok) throw new Error(`Failed to load departments: ${res.status}`);
        const json = await res.json();
        const items: any[] = Array.isArray(json?.data) ? json.data : [];
        const mapped = items.map((it) => {
          const value = (it?.department_id ?? it?.id ?? it?.value ?? it?.code ?? it?.slug ?? it?.department ?? it?.title ?? it?.name ?? '').toString();
          const label = (it?.department_name ?? it?.label ?? it?.name ?? it?.department ?? it?.title ?? value).toString();
          return { value, label };
        }).filter((d) => d.value && d.label);
        if (isMounted) {
          setDepartments(mapped);
        }
      } catch (err: any) {
        if (isMounted) setDeptError(err?.message || 'Unable to load departments');
      } finally {
        if (isMounted) setDeptLoading(false);
      }
    }
    loadDepartments();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadUsers() {
      try {
        setUserLoading(true);
        setUserError(null);
        const res = await fetch('http://localhost:8055/items/user');
        if (!res.ok) throw new Error(`Failed to load users: ${res.status}`);
        const json = await res.json();
        const items: any[] = Array.isArray(json?.data) ? json.data : [];
        const mapped = items.map((it) => {
          const fname = (it?.user_fname ?? '').toString().trim();
          const lname = (it?.user_lname ?? '').toString().trim();
          const full = [fname, lname].filter(Boolean).join(' ').trim();
          const value = full;
          const label = full;
          return { value, label };
        }).filter((d) => d.value && d.label);
        if (isMounted) {
          setUsers(mapped);
        }
      } catch (err: any) {
        if (isMounted) setUserError(err?.message || 'Unable to load users');
      } finally {
        if (isMounted) setUserLoading(false);
      }
    }
    loadUsers();
    return () => { isMounted = false; };
  }, []);

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
              <Popover open={requestorOpen} onOpenChange={setRequestorOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={requestorOpen}
                    className="w-full justify-between"
                    id="requestor"
                  >
                    {formData.requestor || (userLoading ? 'Loading users...' : 'Select user')}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Type a name..." />
                    <CommandList>
                      {userLoading && <CommandEmpty>Loading users...</CommandEmpty>}
                      {!userLoading && userError && <CommandEmpty>Failed to load users</CommandEmpty>}
                      {!userLoading && !userError && users.length === 0 && (
                        <CommandEmpty>No users found.</CommandEmpty>
                      )}
                      {!userLoading && !userError && users.length > 0 && (
                        <CommandGroup>
                          {users.map((u) => (
                            <CommandItem
                              key={u.value}
                              value={u.label}
                              onSelect={() => {
                                handleInputChange('requestor', u.label);
                                setRequestorOpen(false);
                              }}
                            >
                              {u.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Popover open={deptOpen} onOpenChange={setDeptOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={deptOpen}
                    className="w-full justify-between"
                    id="department"
                  >
                    {formData.department || (deptLoading ? 'Loading departments...' : 'Select department')}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Type a department..." />
                    <CommandList>
                      {deptLoading && <CommandEmpty>Loading departments...</CommandEmpty>}
                      {!deptLoading && deptError && <CommandEmpty>Failed to load departments</CommandEmpty>}
                      {!deptLoading && !deptError && departments.length === 0 && (
                        <CommandEmpty>No departments available</CommandEmpty>
                      )}
                      {!deptLoading && !deptError && departments.length > 0 && (
                        <CommandGroup>
                          {departments.map((d) => (
                            <CommandItem
                              key={d.value}
                              value={d.label}
                              onSelect={() => {
                                handleInputChange('department', d.label);
                                setDeptOpen(false);
                              }}
                            >
                              {d.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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