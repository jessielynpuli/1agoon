'use client';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '@/context/app-context';
import { Loader2 } from 'lucide-react';

export default function GateKeeper() {
  const router = useRouter();
  const context = useContext(AppContext);

  useEffect(() => {
    if (context) {
      if (context.isLoggedIn) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    }
  }, [context, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
