import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

import '@/styles/login_error.css';

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

  // Manejo de cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Validación del formulario
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

  // Manejo del inicio de sesión con Discord
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

  // Redirección al iniciar sesión correctamente
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          toast({
            title: 'Logged in',
            description: 'Redirecting to the dashboard...',
          });
          onNavigate('dashboard');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [onNavigate, toast]);

  // Envío del formulario
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
  
    if (!validateFormData()) {
      setIsLoading(false);
      return;
    }
  
    const { email, password } = formData;
    console.log('Sending data to Supabase:', { email, password });
  
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
  
      toast({
        title: 'Success!',
        description: "You've been logged in successfully.",
      });
  
      onNavigate('dashboard');
    } catch (error) {
      console.error('Error during login:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign in.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
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
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-blue-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
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

          <Button
            variant="outline"
            disabled={isLoading}
            onClick={handleDiscordLogin}
          >
            Discord
          </Button>

          {/* Botón para redirigir al signup */}
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => onNavigate('signup')}
              className="text-blue-600 hover:text-blue-800"
            >
              Don't have an account? Sign up
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
