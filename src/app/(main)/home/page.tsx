'use client';

import { useContext, useState } from 'react';
import Image from 'next/image';
import { AppContext } from '@/context/app-context';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ShoppingBag, Printer, BookOpen, DollarSign, Package, User, Edit, Trash, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from '@/components/ui/textarea';

// Mock Data
const stores = [
  { id: 1, name: 'Siomai King', category: 'food', image: 'https://placehold.co/600x400.png', hint: 'food stall' },
  { id: 2, 'name': 'Quick Prints', category: 'printing', image: 'https://placehold.co/600x400.png', hint: 'print shop' },
  { id: 3, 'name': 'Isko Books', category: 'isko', image: 'https://placehold.co/600x400.png', hint: 'book store' },
  { id: 4, 'name': 'Burger Spot', category: 'food', image: 'https://placehold.co/600x400.png', hint: 'burger joint' },
];

const dashboardData = {
  income: 45231,
  orders: 276,
  customers: 89,
  chartData: [
    { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
  ],
};

const storeItems = [
    { id: 1, name: 'Pork Siomai (4pcs)', description: 'Steamed pork dumplings.', price: 35.00, stock: 100 },
    { id: 2, name: 'Beef Siomai (4pcs)', description: 'Steamed beef dumplings.', price: 35.00, stock: 80 },
    { id: 3, name: 'Gulp-sized Gulaman', description: 'Sweet jelly drink.', price: 25.00, stock: 150 },
];

const BuyerHome = () => (
  <div className="p-4 md:p-8">
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input placeholder="Search stores..." className="pl-10 h-12 text-base" />
    </div>
    <Tabs defaultValue="all">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="food"><ShoppingBag className="w-4 h-4 mr-2 hidden sm:inline-block" />Food</TabsTrigger>
        <TabsTrigger value="printing"><Printer className="w-4 h-4 mr-2 hidden sm:inline-block"/>Printing</TabsTrigger>
        <TabsTrigger value="isko"><BookOpen className="w-4 h-4 mr-2 hidden sm:inline-block"/>Isko Store</TabsTrigger>
      </TabsList>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map(store => (
          <Card key={store.id} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow">
            <CardHeader className="p-0">
              <Image src={store.image} alt={store.name} width={600} height={400} className="w-full h-40 object-cover" data-ai-hint={store.hint} />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg font-bold font-headline">{store.name}</CardTitle>
              <CardDescription className="capitalize">{store.category}</CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full">Visit Store</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Tabs>
  </div>
);

const VendorHome = () => (
  <div className="p-4 md:p-8">
    <h1 className="text-3xl font-bold font-headline mb-6">Store Dashboard</h1>
    <Tabs defaultValue="dashboard">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="items">Edit Items</TabsTrigger>
        <TabsTrigger value="settings">Store Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard" className="mt-6">
        <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Revenue</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">₱{dashboardData.income.toLocaleString()}</div><p className="text-xs text-muted-foreground">+20.1% from last month</p></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Orders</CardTitle><Package className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">+{dashboardData.orders}</div><p className="text-xs text-muted-foreground">+180.1% from last month</p></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">New Customers</CardTitle><User className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">+{dashboardData.customers}</div><p className="text-xs text-muted-foreground">+19% from last month</p></CardContent></Card>
        </div>
        <Card className="mt-6">
            <CardHeader><CardTitle>Income Overview</CardTitle></CardHeader>
            <CardContent className="pl-2"><ResponsiveContainer width="100%" height={350}><BarChart data={dashboardData.chartData}><XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₱${value}`} /><Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="items" className="mt-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Your Menu Items</CardTitle>
                    <CardDescription>Manage your store's offerings here.</CardDescription>
                </div>
                 <Sheet>
                    <SheetTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4"/>Add Item</Button></SheetTrigger>
                    <SheetContent><SheetHeader><SheetTitle>Add a new item</SheetTitle><SheetDescription>Fill in the details for your new menu item.</SheetDescription></SheetHeader>
                        <div className="space-y-4 py-4">
                            <Input id="name" placeholder="Item Name"/>
                            <Textarea id="description" placeholder="Item Description"/>
                            <Input id="price" type="number" placeholder="Price (PHP)"/>
                            <Input id="stock" type="number" placeholder="Initial Stock"/>
                            <Button className="w-full">Save Item</Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Price</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {storeItems.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>₱{item.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon" className="text-destructive"><Trash className="h-4 w-4"/></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
              <CardDescription>Update your store's public information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="storeName">Store Name</label>
                <Input id="storeName" defaultValue="Siomai King" />
              </div>
              <div className="space-y-2">
                <label htmlFor="storeDescription">Store Description</label>
                <Textarea id="storeDescription" defaultValue="The best siomai on campus! Get your fix of savory dumplings and refreshing gulaman." />
              </div>
               <div className="space-y-2">
                <label>Store Banner Image</label>
                <Input type="file" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
    </Tabs>
  </div>
);


export default function HomePage() {
  const context = useContext(AppContext);

  if (context?.role === 'buyer') {
    return <BuyerHome />;
  }

  if (context?.role === 'vendor') {
    return <VendorHome />;
  }

  return null;
}
