'use client';

import { useContext } from 'react';
import { AppContext } from '@/context/app-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, LogOut, Repeat, Store } from 'lucide-react';

export default function ProfilePage() {
  const context = useContext(AppContext);

  if (!context || !context.user) {
    return null; // Or a loading skeleton
  }

  const { user, role, setRole, logout } = context;

  const handleRoleSwitch = () => {
    setRole(role === 'buyer' ? 'vendor' : 'buyer');
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Profile</h1>
      <Card className="max-w-lg mx-auto shadow-lg">
        <CardHeader className="items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-3xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-headline">{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleRoleSwitch}>
              {role === 'buyer' ? (
                <>
                  <Store className="h-4 w-4" />
                  <span>Create a Store</span>
                </>
              ) : (
                <>
                  <Repeat className="h-4 w-4" />
                  <span>Return as Buyer</span>
                </>
              )}
            </Button>
            <Button variant="destructive" className="w-full justify-start gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
