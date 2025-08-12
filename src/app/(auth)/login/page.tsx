'use client';

import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AppContext } from '@/context/app-context';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const signupSchema = z.object({
  username: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type View = 'login' | 'signup';

export default function LoginPage() {
  const context = useContext(AppContext);
  const [view, setView] = useState<View>('login');
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  function onLogin(values: z.infer<typeof loginSchema>) {
    context?.login({ email: values.email, username: values.email.split('@')[0] });
  }

  function onSignup(values: z.infer<typeof signupSchema>) {
    context?.login({ email: values.email, username: values.username });
  }

  const FormContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-3xl shadow-lg w-full">
        {children}
    </div>
  )

  const renderLogin = () => (
    <>
      <div className="flex flex-col items-center mb-8">
        <Image src="/images/logo.png" alt="Campus Hub Logo" width={100} height={100} />
      </div>
      <h2 className="text-2xl font-bold text-center mb-2 text-foreground"></h2>
      <p className="text-foreground text-center mb-6">Food, Printing, and the Lagoon in one app</p>
      <FormContainer>
        <Form {...loginForm}>
          <form id="login-form" onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} className="bg-background text-foreground rounded-full h-12 px-5 border-border" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                        <FormControl>
                        <Input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className="bg-background text-foreground rounded-full h-12 px-5 pr-12 border-border"
                        />
                        </FormControl>
                        <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-transparent"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                        {passwordVisible ? <EyeOff /> : <Eye />}
                        </Button>
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
                />
          </form>
        </Form>
      </FormContainer>
       <Button form="login-form" type="submit" size="lg" className="w-full !mt-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 text-base font-bold">
        Continue
      </Button>
      <p className="text-center mt-6 text-muted-foreground">
        First time here?{' '}
        <Button variant="link" className="p-0 h-auto text-primary font-semibold" onClick={() => setView('signup')}>
          Sign up
        </Button>
      </p>
    </>
  );

  const renderSignup = () => (
     <>
      <div className="flex flex-col items-center mb-8">
        <Image src="/images/logo.png" alt="Campus Hub Logo" width={100} height={100} />
      </div>
      <h2 className="text-2xl font-bold text-center mb-2 text-foreground"></h2>
       <p className="text-foreground text-center mb-6">Food, Printing, and the Lagoon in one app</p>
      <FormContainer>
        <Form {...signupForm}>
          <form id="signup-form" onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
            <FormField
                control={signupForm.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input placeholder="your_username" {...field} className="bg-background text-foreground rounded-full h-12 px-5 border-border" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
              control={signupForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} className="bg-background text-foreground rounded-full h-12 px-5 border-border"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                        <FormControl>
                        <Input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className="bg-background text-foreground rounded-full h-12 px-5 pr-12 border-border"
                        />
                        </FormControl>
                        <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-transparent"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                        {passwordVisible ? <EyeOff /> : <Eye />}
                        </Button>
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
                />
          </form>
        </Form>
      </FormContainer>
       <Button form="signup-form" type="submit" size="lg" className="w-full !mt-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 text-base font-bold">
          Continue
        </Button>
        <p className="text-center mt-6 text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" className="p-0 h-auto text-primary font-semibold" onClick={() => setView('login')}>
            Log in
            </Button>
        </p>
    </>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        {view === 'login' ? renderLogin() : renderSignup()}
      </div>
    </div>
  );
}
