'use client';

import { useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from "axios";
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
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gfuiughkbdvblrbxmqbl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdWl1Z2hrYmR2YmxyYnhtcWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODQ5OTgsImV4cCI6MjA2ODY2MDk5OH0.Jtt9fiy_DL0WXjKJs6ZgsHORsXEHOSk2slhGOBgw-yM';


const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

type Store = {
  store_name: string,
  location: string,
  store_status: string,
  opening_hour: string,
  closing_hour: string,
  store_desc: string,
  days_open: string,
  menu_items: string[],
  id: string;
  name: string;
  category: string;
  image: string;
  hint: string;
};

type ChartData = {
  name: string;
  total: number;
};

    
const BuyerHome = () => {
        const [stores, setStores] = useState<Store[]>([]);
        const fetchStores = async () => {
            const res = await fetch('http://localhost:8000/stores/store/all');
            const data = await res.json();
            return data;
        };

    useEffect(() => {
            const fetchStoreItems = async (storeId: string) => {
            const res = await fetch(`http://localhost:8000/stores/items/${storeId}`);
            if (!res.ok) throw new Error('Failed to fetch store items');
            return await res.json();
        };
        fetchStores().then((data) => {
            if (Array.isArray(data)) {
                setStores(data);
            } else if (Array.isArray(data?.stores)) {
                setStores(data.stores);
            } else {
                setStores([]);
            }
        });
    }, []);

    return (
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
};

const createStore = async (storeData: any) => {
  const res = await fetch('http://localhost:8000/stores/store', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(storeData),
  });
  return res.json();
};

const fetchStore = async (ownerId: string, storeId: string) => {
  const res = await fetch(`http://localhost:8000/stores/store/${ownerId}/${storeId}`);
  return res.json();
};

const updateStore = async (ownerId: string, storeId: string, updateData: any) => {
  const res = await fetch(`http://localhost:8000/stores/store/${ownerId}/${storeId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });
  return res.json();
};

const deleteStore = async (ownerId: string, storeId: string) => {
  const res = await fetch(`http://localhost:8000/stores/store/${ownerId}/${storeId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Delete failed');
  return true;
};

const restoreStore = async (storeData: string, storeId: string, ownerId: string) => {
  const res = await fetch(`http://localhost:8000/stores/store/${ownerId}/${storeId}/restore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(storeData),
  });
  return res.json();
};

const updateStoreStatus = async (storeId: string) => {
  const res = await fetch(`http://localhost:8000/stores/${storeId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to update store status');
  return res.json();
};

const fetchStoreReport = async (storeId: string) => {
  const res = await fetch(`http://localhost:8000/reports/${storeId}`);
  if (!res.ok) throw new Error('Failed to fetch store report');
  return res.json();
};

const getSalesOverview = async (storeId: string) => {
  const res = await fetch(`http://localhost:8000/sales-overview/${storeId}`);
  if (!res.ok) throw new Error('Failed to fetch sales overview');
  return res.json();
};

const fetchVendorStoreItems = async (storeId: string) => {
  const res = await fetch(`http://localhost:8000/stores/items/${storeId}`);
  if (!res.ok) throw new Error('Failed to fetch store items');
  return res.json();
};

const createStoreItem = async (storeId: string, itemData: any, token?: string) => {
  const res = await fetch(`http://localhost:8000/stores/items/store/${storeId}/item`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(itemData),
  });
  if (!res.ok) throw new Error('Failed to create item');
  return res.json();
};

const uploadStoreItemImages = async (files: File[]) => {
  const formData = new FormData();
  files.forEach(file => formData.append('images_urls', file));
  const res = await fetch('http://localhost:8000/stores/items/store/upload_images', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload images');
  return res.json();
};

const updateStoreItem = async (storeId: string, itemId: string, updateData: any, token?: string) => {
  const res = await fetch(`http://localhost:8000/stores/items/store_item/${storeId}/${itemId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) throw new Error('Failed to update item');
  return res.json();
};

const deleteStoreItem = async (storeId: string, itemId: string, token?: string) => {
  const res = await fetch(`http://localhost:8000/stores/items/store_item/${storeId}/${itemId}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) throw new Error('Failed to delete item');
  return res.json();
};

//const { useState, useEffect, useContext } = React as typeof import("react");

interface VendorHomeProps {
  storeId?: string;
}


const OrderStatus = ['pending','received', 'processing', 'for-pickup', 'complete'] as const;


const VendorHome = ({ storeId }: VendorHomeProps) => {
    const searchParams = useSearchParams();
    const context = useContext(AppContext);

    console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log(process.env.NEXT_PUBLIC_SUPABASE_KEY);

    const [storeStats, setStoreStats] = useState<{ income: number; orders: number; customers: number }>({
    income: 0,
    orders: 0,
    customers: 0,
  });

  const [storeItems, setStoreItems] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<{ chartData: ChartData[] }>({ chartData: [] });
  const [store, setStore] = useState<Store | null>(null);

  //const id = context?.id ?? '';
  const storeIdFromQuery = searchParams.get('storeId');
  const [id, setid] = useState<string | null>(
    storeId ?? context?.storeId ?? storeIdFromQuery ?? null
  );

  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemPrice, setItemPrice] = useState<string>("");
  const [itemStock, setItemStock] = useState<string>("");


    useEffect(() => {
    if(!id) {
        setid(storeId ?? context?.storeId ?? storeIdFromQuery ?? null);
    }
    }, [storeId, context?.storeId]);

    //if (!id) {
    //return <p>Loading store information...</p>;
//  }

useEffect(() => {
  if (!id) return;
  fetchVendorStoreItems(id)
    .then(data => {
      if (Array.isArray(data)) {
        setStoreItems(data);
      } else if (Array.isArray(data?.items)) {
        setStoreItems(data.items);
      } else {
        setStoreItems([]);
      }
    })
    .catch(err => console.error(err));
}, [id]);

useEffect(() => {
  //if (!id) return;
  const fetchTodayStats = async () => {
    try {
      const res = await fetch(`http://localhost:8000/stats/${storeId}?period=today`);
      const data = await res.json();
      setStoreStats({
        income: data.income ?? 0,
        orders: data.orders ?? 0,
        customers: data.customers ?? 0,
      });
    } catch (error) {
      console.error("Error fetching today's stats:", error);
    }
  };
  fetchTodayStats();
}, [id]);

useEffect(() => {
  if (!id) return;
  fetchStoreReport(id)
    .then(report => console.log("Report:", report))
    .catch(err => console.error(err));
}, [id]);
  
useEffect(() => {
  if (!id) return;
  getSalesOverview(id)
    .then(data => {
      setDashboardData({ chartData: data.chartData || [] });
    })
    .catch(err => console.error(err));
}, [id]);

const fetchStoreDetails = async (ownerId: string, id: string) => {
  //if (!id) return;
  try {
    const data = await fetchStore(context?.id || '', id);
    setStore(data);
  } catch (error) {
    console.error("Error fetching store details:", error);  
    }
    }



    
const handleSaveItem = async () => {
  try {

    
    const newItem = {
      name: itemName,
      description: itemDesc,
      price: itemPrice,
      stock: itemStock,
    };

    const token = localStorage.getItem('authtoken') || '';
    if (!id) throw new Error("Store ID is required to create an item");
    await createStoreItem(id, newItem, token);
    const updatedItems = await fetchVendorStoreItems(id);
    setStoreItems(updatedItems);
    setItemName("");
    setItemDesc("");
    setItemPrice("");
    setItemStock("");
  } catch (error) {
    console.error("Error creating item:", error);
  }
};

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
                        <Card className="bg-card shadow-lg rounded-2xl border-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">₱{storeStats.income.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card shadow-lg rounded-2xl border-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{storeStats.orders}</div>
                                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card shadow-lg rounded-2xl border-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">New Customers</CardTitle>
                                <User className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{storeStats.customers}</div>
                                <p className="text-xs text-muted-foreground">+19% from last month</p>
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="mt-6 bg-card shadow-lg rounded-2xl border-none">
                        <CardHeader>
                            <CardTitle className="text-foreground">Income Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={[]}>
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₱${value}`} />
                                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
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
                            <SheetTrigger asChild><Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 text-base font-bold"><PlusCircle className="mr-2 h-4 w-4" />Add Item</Button></SheetTrigger>
                            <SheetContent className="bg-background"><SheetHeader><SheetTitle className="text-foreground">Add a new item</SheetTitle><SheetDescription className="text-muted-foreground">Fill in the details for your new menu item.</SheetDescription></SheetHeader>
                                <div className="space-y-4 py-4">
                                   <Input
                                     id="name"
                                  value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    placeholder="Item Name"
                                    className="bg-secondary text-foreground rounded-full h-12 px-5 border-none"
                                />
                                <Textarea
                                      id="description"
                                      value={itemDesc}
                                      onChange={(e) => setItemDesc(e.target.value)}
                                      placeholder="Item Description"
                                      className="bg-secondary text-foreground rounded-2xl px-5 border-none"
                                    />
                                <Input
                                    id="price"
                                    type="number"
                                    value={itemPrice}
                                    onChange={(e) => setItemPrice(e.target.value)}
                                    placeholder="Price (PHP)"
                                    className="bg-secondary text-foreground rounded-full h-12 px-5 border-none"
                                />
                                    <Input
                                    id="stock"
                                         type="number"
                                         value={itemStock}
                                            onChange={(e) => setItemStock(e.target.value)}
                                            placeholder="Initial Stock"
                                        className="bg-secondary text-foreground rounded-full h-12 px-5 border-none"
                                        />
                                    <Button
                                    onClick={handleSaveItem}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 text-base font-bold"
                                >
                                Save Item
                                </Button>

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
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4 text-muted-foreground" /></Button>
                                            <Button variant="ghost" size="icon"><Trash className="h-4 w-4 text-destructive" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent><TabsContent value="settings" className="mt-6">
                <Card className="bg-card shadow-lg rounded-2xl border-none">
                    <CardHeader>
                        <CardTitle className="text-foreground">Store Settings</CardTitle>
                        <CardDescription className="text-muted-foreground">Update your store's public information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="storeName" className="text-sm font-medium text-foreground">Store Name</label>
                            <Input id="storeName" defaultValue="Siomai King" className="bg-secondary text-foreground rounded-full h-12 px-5 border-none" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="storeDescription" className="text-sm font-medium text-foreground">Store Description</label>
                            <Textarea id="storeDescription" defaultValue="The best siomai on campus! Get your fix of savory dumplings and refreshing gulaman." className="bg-secondary text-foreground rounded-2xl px-5 border-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Store Banner Image</label>
                            <Input type="file" className="bg-secondary text-foreground rounded-full h-12 px-5 border-none file:text-muted-foreground file:font-medium" />
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
  return <VendorHome storeId={context?.storeId ?? ''} />;
}

  return null;
}