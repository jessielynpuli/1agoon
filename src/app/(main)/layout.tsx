'use client';

import React, { useContext, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Package, User, LayoutDashboard, Building, Loader2, LogOut } from 'lucide-react';
import { AppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import BottomNav from '@/components/bottom-nav';

const buyerNavItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/orders', label: 'Orders', icon: Package },
  { href: '/profile', label: 'Profile', icon: User },
];

const vendorNavItems = [
  { href: '/home', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/orders', label: 'Orders', icon: Package },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const context = useContext(AppContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (context && !context.isLoggedIn) {
      router.replace('/login');
    }
  }, [context, router]);

  if (!context || !context.isLoggedIn || !context.user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const { user, role, logout } = context;
  const navItems = role === 'buyer' ? buyerNavItems : vendorNavItems;

  const SidebarNav = () => (
    <aside className="hidden md:flex flex-col w-64 bg-card p-4 border-r border-border">
      <div className="flex items-center gap-3 mb-8 px-2">
         <Image src="https://placehold.co/150x150.png" alt="1agoon Logo" width={40} height={40} data-ai-hint="logo" />
         <span className="text-2xl font-bold tracking-[0.2em] text-primary">
            1agoon
         </span>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} passHref>
              <Button variant={isActive ? 'secondary' : 'ghost'} className="w-full justify-start text-base h-11 gap-3 px-3 rounded-full">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2 px-2 text-left rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );

  return (
    <div className="md:flex min-h-screen bg-background">
      <SidebarNav />
      <div className="flex-1 flex flex-col">
        <main className="flex-grow md:pb-0 pb-16">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
