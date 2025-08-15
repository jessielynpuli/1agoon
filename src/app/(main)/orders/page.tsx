'use client';

import { useContext, useState, useEffect } from 'react';
import { AppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type OrderStatus = 'pending' | 'received' | 'processing' | 'complete' | 'for-pickup';

type Order = {
  id: string;
  storeName?: string;
  customerName?: string;
  time?: string;
  content?: string;
  price?: number;
  status?: OrderStatus;
};

// API functions
const storeOrders = async (storeId: string) => {
  const res = await fetch(`http://localhost:8000/orders/orders/store/${storeId}`);
  if (!res.ok) throw new Error('Failed to fetch store orders');
  return res.json();
};

const userOrders = async (user_id: string) => {
  const res = await fetch(`http://localhost:8000/orders/${user_id}`);
  if (!res.ok) throw new Error('Failed to fetch user orders');
  return res.json();
};

// status styles
const statusConfig: Record<OrderStatus, { text: string; color: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { text: 'Pending', color: 'default' },
  received: { text: 'Received', color: 'default' },
  processing: { text: 'Processing', color: 'secondary' },
  'for-pickup': { text: 'For Pickup', color: 'outline' },
  complete: { text: 'Complete', color: 'default' }
};
statusConfig.complete.color = 'default';

// card component
const OrderCard = ({ order, role }: { order: Order; role: 'buyer' | 'vendor' }) => {
  const [status, setStatus] = useState<OrderStatus>(order.status || 'pending');
  const currentStatus = statusConfig[status];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-lg">
              {role === 'buyer' ? order.storeName : order.customerName}
            </CardTitle>
            <CardDescription>{order.time}</CardDescription>
          </div>
          <Badge
            variant={currentStatus.color === 'default' && status === 'complete' ? 'secondary' : currentStatus.color}
            className={status === 'complete' ? 'bg-green-500 text-white' : ''}
          >
            {currentStatus.text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-semibold">{order.content}</p>
        {order.price !== undefined && <p className="text-lg font-bold mt-2">₱{order.price.toFixed(2)}</p>}
      </CardContent>
      {role === 'vendor' && (
        <CardFooter>
          <div className="w-full">
            <label className="text-sm font-medium text-muted-foreground">Update Status</label>
            <Select value={status} onValueChange={(value) => setStatus(value as OrderStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Set status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="for-pickup">For Pickup</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default function OrdersPage() {
  const context = useContext(AppContext);
  const role = context?.role || 'buyer';
  const [orders, setOrders] = useState<Order[]>([]);

  const title = role === 'buyer' ? 'Your Orders' : 'Incoming Orders';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let fetchedOrders: any[] = [];
        if (role === 'buyer' && context?.id) {
          fetchedOrders = await userOrders(context.id);
        } else if (role === 'vendor' && context?.storeId) {
          fetchedOrders = await storeOrders(context.storeId);
        }
        // ensure we always have an array
        setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]); // fallback to empty array
      }
    };

    fetchOrders();
  }, [role, context?.id, context?.storeId]);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold font-headline mb-6">{title}</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} role={role} />
        ))}
      </div>
    </div>
  );
}
