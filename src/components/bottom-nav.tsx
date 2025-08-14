'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, User, LayoutDashboard, Store } from 'lucide-react';
import { AppContext } from '@/context/app-context';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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

export default function BottomNav() {
  const pathname = usePathname();
  const context = useContext(AppContext);
  const isMobile = useIsMobile();
  
  if (!isMobile || !context?.isLoggedIn) return null;

  const navItems = context.role === 'buyer' ? buyerNavItems : vendorNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t z-50 md:hidden">
      <nav className="flex h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center text-sm transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className={cn('text-xs', isActive && 'font-bold')}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
