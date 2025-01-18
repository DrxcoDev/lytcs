import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

import "@/styles/login_error.css";

interface LoginPageProps {
  onNavigate: (
    page: 'login' | 'signup' | 'forgot-password' | 'dashboard'
  ) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const validateFormData = () => {
    if (!formData.email || !formData.password) {
      toast({
        title: 'Missing Information',
        description: 'Both email and password are required.',
        variant: 'destructive',
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleDiscordLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
      });

      if (error) throw error;
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to sign in with Discord.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Monitor the auth state and redirect if there's a session
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          toast({
            title: 'Logged in',
            description: 'Redirecting to the dashboard...',
          });
          onNavigate('dashboard');
        }
      }
    );

    // Cleanup the listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [onNavigate, toast]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!validateFormData()) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: "You've been logged in successfully.",
      });

      onNavigate('dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to sign in.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="notifications-container">
        <div className="error-alert">
          <div className="flex">
            <div className="flex-shrink-0">
              
              <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="error-svg">
                <path clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" fill-rule="evenodd"></path>
              </svg>
            </div>
            <div className="error-prompt-container">
              <p className="error-prompt-heading">The login with email has deshabilited
              </p><div className="error-prompt-wrap">
                <ul className="error-prompt-list" role="list">
                  <li>You can with Discord</li>
                </ul>
            </div>
            </div>
          </div>
        </div>
      </div>
      <Card className="w-full max-w-lg p-8 shadow-xl">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-blue-900">Welcome back</h1>
            <p className="text-blue-600">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-blue-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-blue-700">
                    Password
                  </Label>
                  <Button
                    variant="link"
                    className="px-0 font-normal text-blue-600 hover:text-blue-700"
                    onClick={() => onNavigate('forgot-password')}
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoCapitalize="none"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-blue-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-blue-600">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={handleDiscordLogin}
              className="border-blue-200 hover:bg-blue-50"
            >
              {/* <Icons.discord className="mr-2 h-4 w-4" /> */}
              Discord
            </Button>
          </div>

          <p className="text-center text-sm text-blue-600">
            Don't have an account?{' '}
            <Button
              variant="link"
              className="px-0 text-blue-700 hover:text-blue-800"
              onClick={() => onNavigate('signup')}
            >
              Sign up
            </Button>
          </p>
        </div>
      </Card>
    </div>
  );
}
