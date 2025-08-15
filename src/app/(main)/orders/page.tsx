'use client';

import { useContext, useState } from 'react';
import { AppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type OrderStatus = 'pending'|'received' | 'processing' | 'complete' | 'for-pickup';

//router = APIRouter(prefix="/orders")

const createOrder = async (orderId: string, userId: string, storeId: string, orderData: any) => 
{
	const res = await fetch('http://localhost:8000/orders/',
	{
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'},
  body: JSON.stringify(orderData),
  });
	if (!res.ok) throw new Error('Failed to create order');
  return res.json();
  };

const storeOrders = async (storeId: string) => {
  const res = await fetch(`http://localhost:8000/orders/orders/store/${storeId}`);
  if (!res.ok) throw new Error('Failed to fetch store orders');
  return res.json();
};

const userOrders = async (storeId: string) => {
  const res = await fetch(`http://localhost:8000/orders/`);
  if (!res.ok) throw new Error('Failed to fetch user orders');
  return res.json();
};

const orderItems = async (order_id: string) => {
  const res = await fetch(`http://localhost:8000/orders/orders/${order_id}/details`);
  if (!res.ok) throw new Error('Failed to fetch user orders');
  return res.json();
};

const updateOrderStatus = async (updateData: any, order_id: string) => {
  const res = await fetch(`http://localhost:8000/orders/orders/${order_id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) throw new Error('Failed to update item');
  return res.json();
};

const uploadOrderAttachment = async (order_id: string, files: File[]) => 
{
	const formData = new FormData();
  files.forEach(file => formData.append('images_urls', file));
  const res = await fetch('http://localhost:8000/orders/orders/{order_id}/upload', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload attachments');
  return res.json();
};


/*
const buyerOrders = [
  { id: 'ORD123', storeName: 'Siomai King', time: '10 mins ago', content: '2x Pork Siomai, 1x Gulaman', price: 95.00, status: 'processing' as OrderStatus },
  { id: 'ORD122', storeName: 'Quick Prints', time: '1 day ago', content: '10 pages b&w printing', price: 50.00, status: 'complete' as OrderStatus },
];

const vendorOrders = [
  { id: 'ORD123', customerName: 'Juan Dela Cruz', time: '10 mins ago', content: '2x Pork Siomai, 1x Gulaman', price: 95.00, status: 'received' as OrderStatus },
  { id: 'ORD124', customerName: 'Maria Clara', time: '15 mins ago', content: '4x Beef Siomai', price: 70.00, status: 'received' as OrderStatus },
  { id: 'ORD121', customerName: 'Crisostomo Ibarra', time: '45 mins ago', content: '1x Pork Siomai', price: 35.00, status: 'for-pickup' as OrderStatus },
];
*/

const statusConfig: Record<OrderStatus, { text: string; color: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { text: "Pending", color: "default"},  
    received: { text: "Received", color: "default" },
    processing: { text: "Processing", color: "secondary" },
    'for-pickup': { text: "For Pickup", color: "outline" },
    complete: { text: "Complete", color: "default" },
};
statusConfig.complete.color = 'default' // This is just to make it look green with my theme

const OrderCard = ({ order, role }: { order: any; role: 'buyer' | 'vendor' }) => {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  
  const currentStatus = statusConfig[status];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-lg">{role === 'buyer' ? order.storeName : order.customerName}</CardTitle>
              <CardDescription>{order.time}</CardDescription>
            </div>
            <Badge variant={currentStatus.color === "default" && status === "complete" ? "secondary": currentStatus.color} className={status === "complete" ? "bg-green-500 text-white" : ""}>{currentStatus.text}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-semibold">{order.content}</p>
        <p className="text-lg font-bold mt-2">₱{order.price.toFixed(2)}</p>
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
  const orders = role === 'buyer' ? userOrders : storeOrders;
  const title = role === 'buyer' ? 'Your Orders' : 'Incoming Orders';

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
