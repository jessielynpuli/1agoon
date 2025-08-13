'use client';

import { useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import { AppContext } from '@/context/app-context';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ShoppingBag, Printer, BookOpen, DollarSign, Package, User, Edit, Trash, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

const initialChartData = [
    { name: 'Jan', total: 0 },
    { name: 'Feb', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Apr', total: 0 },
    { name: 'May', total: 0 },
    { name: 'Jun', total: 0 },
  ];

const storeItems = [
    { id: 1, name: 'Pork Siomai (4pcs)', description: 'Steamed pork dumplings.', price: 35.00, stock: 100 },
    { id: 2, name: 'Beef Siomai (4pcs)', description: 'Steamed beef dumplings.', price: 35.00, stock: 80 },
    { id: 3, name: 'Gulp-sized Gulaman', description: 'Sweet jelly drink.', price: 25.00, stock: 150 },
];

const BuyerHome = () => (
    <div className="p-4 md:p-8 bg-background">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search stores..." className="pl-12 h-14 text-base bg-secondary border-none rounded-full" />
      </div>
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-secondary rounded-full h-12 p-1">
          <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground">All</TabsTrigger>
          <TabsTrigger value="food" className="rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground"><ShoppingBag className="w-4 h-4 mr-2 hidden sm:inline-block" />Food</TabsTrigger>
          <TabsTrigger value="printing" className="rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground"><Printer className="w-4 h-4 mr-2 hidden sm:inline-block"/>Printing</TabsTrigger>
          <TabsTrigger value="isko" className="rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground"><BookOpen className="w-4 h-4 mr-2 hidden sm:inline-block"/>Isko Store</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map(store => (
            <Card key={store.id} className="overflow-hidden shadow-lg rounded-2xl bg-card border-none">
                <CardHeader className="p-0">
                <Image src={store.image} alt={store.name} width={600} height={400} className="w-full h-40 object-cover" data-ai-hint={store.hint} />
                </CardHeader>
                <CardContent className="p-4">
                <CardTitle className="text-lg font-bold font-headline text-foreground">{store.name}</CardTitle>
                <CardDescription className="capitalize text-muted-foreground">{store.category}</CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 text-base font-bold">Visit Store</Button>
                </CardFooter>
            </Card>
            ))}
        </div>
        </TabsContent>
         <TabsContent value="food">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.filter(s => s.category === 'food').map(store => (
            <Card key={store.id} className="overflow-hidden shadow-lg rounded-2xl bg-card border-none">
                <CardHeader className="p-0">
                <Image src={store.image} alt={store.name} width={600} height={400} className="w-full h-40 object-cover" data-ai-hint={store.hint} />
                </CardHeader>
                <CardContent className="p-4">
                <CardTitle className="text-lg font-bold font-headline text-foreground">{store.name}</CardTitle>
                <CardDescription className="capitalize text-muted-foreground">{store.category}</CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 text-base font-bold">Visit Store</Button>
                </CardFooter>
            </Card>
            ))}
        </div>
        </TabsContent>
         <TabsContent value="printing">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.filter(s => s.category === 'printing').map(store => (
            <Card key={store.id} className="overflow-hidden shadow-lg rounded-2xl bg-card border-none">
                <CardHeader className="p-0">
                <Image src={store.image} alt={store.name} width={600} height={400} className="w-full h-40 object-cover" data-ai-hint={store.hint} />
                </CardHeader>
                <CardContent className="p-4">
                <CardTitle className="text-lg font-bold font-headline text-foreground">{store.name}</CardTitle>
                <CardDescription className="capitalize text-muted-foreground">{store.category}</CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 text-base font-bold">Visit Store</Button>
                </CardFooter>
            </Card>
            ))}
        </div>
        </TabsContent>
        <TabsContent value="isko">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.filter(s => s.category === 'isko').map(store => (
            <Card key={store.id} className="overflow-hidden shadow-lg rounded-2xl bg-card border-none">
                <CardHeader className="p-0">
                <Image src={store.image} alt={store.name} width={600} height={400} className="w-full h-40 object-cover" data-ai-hint={store.hint} />
                </CardHeader>
                <CardContent className="p-4">
                <CardTitle className="text-lg font-bold font-headline text-foreground">{store.name}</CardTitle>
                <CardDescription className="capitalize text-muted-foreground">{store.category}</CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 text-base font-bold">Visit Store</Button>
                </CardFooter>
            </Card>
            ))}
        </div>
        </TabsContent>
      </Tabs>
  </div>
);

const VendorHome = () => {
    const [dashboardData, setDashboardData] = useState({
        income: 45231,
        orders: 276,
        customers: 89,
        chartData: initialChartData,
    });
    
    useEffect(() => {
    // This useEffect hook runs only on the client-side after hydration
    // It prevents hydration mismatch errors by ensuring that Math.random() is not run on the server
    setDashboardData(prevData => ({
      ...prevData,
      chartData: initialChartData.map(d => ({...d, total: Math.floor(Math.random() * 5000) + 1000}))
    }));
  }, []);

    return (
        <div className="p-4 md:p-8 bg-background">
            <h1 className="text-3xl font-bold font-headline mb-6 text-foreground">Store Dashboard</h1>
            <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-secondary rounded-full h-12 p-1">
                <TabsTrigger value="dashboard" className="rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground">Dashboard</TabsTrigger>
                <TabsTrigger value="items" className="rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground">Edit Items</TabsTrigger>
                <TabsTrigger value="settings" className="rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground">Store Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="mt-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-card shadow-lg rounded-2xl border-none"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-foreground">₱{dashboardData.income.toLocaleString()}</div><p className="text-xs text-muted-foreground">+20.1% from last month</p></CardContent></Card>
                    <Card className="bg-card shadow-lg rounded-2xl border-none"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle><Package className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-foreground">+{dashboardData.orders}</div><p className="text-xs text-muted-foreground">+180.1% from last month</p></CardContent></Card>
                    <Card className="bg-card shadow-lg rounded-2xl border-none"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">New Customers</CardTitle><User className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-foreground">+{dashboardData.customers}</div><p className="text-xs text-muted-foreground">+19% from last month</p></CardContent></Card>
                </div>
                <Card className="mt-6 bg-card shadow-lg rounded-2xl border-none">
                    <CardHeader><CardTitle className="text-foreground">Income Overview</CardTitle></CardHeader>
                    <CardContent className="pl-2"><ResponsiveContainer width="100%" height={350}><BarChart data={dashboardData.chartData}><XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₱${value}`} /><Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="items" className="mt-6">
                <Card className="bg-card shadow-lg rounded-2xl border-none">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-foreground">Your Menu Items</CardTitle>
                            <CardDescription className="text-muted-foreground">Manage your store's offerings here.</CardDescription>
                        </div>
                        <Sheet>
                            <SheetTrigger asChild><Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 text-base font-bold"><PlusCircle className="mr-2 h-4 w-4"/>Add Item</Button></SheetTrigger>
                            <SheetContent className="bg-background"><SheetHeader><SheetTitle className="text-foreground">Add a new item</SheetTitle><SheetDescription className="text-muted-foreground">Fill in the details for your new menu item.</SheetDescription></SheetHeader>
                                <div className="space-y-4 py-4">
                                    <Input id="name" placeholder="Item Name" className="bg-secondary text-foreground rounded-full h-12 px-5 border-none"/>
                                    <Textarea id="description" placeholder="Item Description" className="bg-secondary text-foreground rounded-2xl px-5 border-none"/>
                                    <Input id="price" type="number" placeholder="Price (PHP)" className="bg-secondary text-foreground rounded-full h-12 px-5 border-none"/>
                                    <Input id="stock" type="number" placeholder="Initial Stock" className="bg-secondary text-foreground rounded-full h-12 px-5 border-none"/>
                                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 text-base font-bold">Save Item</Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead className="text-muted-foreground">Name</TableHead><TableHead className="text-muted-foreground">Price</TableHead><TableHead className="text-right text-muted-foreground">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {storeItems.map(item => (
                                    <TableRow key={item.id} className="border-border">
                                        <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                                        <TableCell className="text-foreground">₱{item.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4 text-muted-foreground"/></Button>
                                            <Button variant="ghost" size="icon"><Trash className="h-4 w-4 text-destructive"/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="settings" className="mt-6">
                <Card className="bg-card shadow-lg rounded-2xl border-none">
                    <CardHeader>
                    <CardTitle className="text-foreground">Store Settings</CardTitle>
                    <CardDescription className="text-muted-foreground">Update your store's public information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="storeName" className="text-sm font-medium text-foreground">Store Name</label>
                        <Input id="storeName" defaultValue="Siomai King" className="bg-secondary text-foreground rounded-full h-12 px-5 border-none"/>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="storeDescription" className="text-sm font-medium text-foreground">Store Description</label>
                        <Textarea id="storeDescription" defaultValue="The best siomai on campus! Get your fix of savory dumplings and refreshing gulaman." className="bg-secondary text-foreground rounded-2xl px-5 border-none"/>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Store Banner Image</label>
                        <Input type="file" className="bg-secondary text-foreground rounded-full h-12 px-5 border-none file:text-muted-foreground file:font-medium"/>
                    </div>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 text-base font-bold">Save Changes</Button>
                    </CardContent>
                </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
};


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
