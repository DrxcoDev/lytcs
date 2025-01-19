import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { Building2, Lock, Mail, User } from "lucide-react";
import { supabase } from '@/lib/supabase';

interface SignupPageProps {
  onNavigate: (page: 'login' | 'signup' | 'forgot-password') => void;
}

export function SignupPage({ onNavigate }: SignupPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    company: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    // Validación básica
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in both email and password.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Intentar registrarse solo con email y contraseña
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      // Si la cuenta se creó exitosamente, luego intentamos agregar la información adicional
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([{ 
            id: data.user.id, 
            full_name: formData.fullName || null,  // Permitimos que el nombre completo sea opcional
            company: formData.company || null       // Permitimos que la compañía sea opcional
          }]);

        if (profileError) {
          throw profileError;
        }

        toast({
          title: "Account created!",
          description: "We've created your account successfully.",
        });
        onNavigate('login');
      }
    } catch (error) {
      console.error(error);  // Mostramos el error completo en la consola para depuración
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg p-8 shadow-xl">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-blue-900">Create an account</h1>
            <p className="text-blue-600">
              Enter your information below to create your account
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName" className="text-blue-700">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="off"
                    disabled={isLoading}
                    className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-blue-700">Email</Label>
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
                <Label htmlFor="company" className="text-blue-700">Company</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
                  <Input
                    id="company"
                    placeholder="Your Company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-blue-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
                  <Input
                    id="password"
                    placeholder="Create a password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoCapitalize="none"
                    autoComplete="new-password"
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
              Sign Up
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
            <Button variant="outline" disabled={isLoading} className="border-blue-200 hover:bg-blue-50">
              <Icons.gitHub className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button variant="outline" disabled={isLoading} className="border-blue-200 hover:bg-blue-50">
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>

          <p className="text-center text-sm text-blue-600">
            Already have an account?{" "}
            <Button
              variant="link"
              className="px-0 text-blue-700 hover:text-blue-800"
              onClick={() => onNavigate('login')}
            >
              Sign in
            </Button>
          </p>
        </div>
      </Card>
    </div>
  );
}
