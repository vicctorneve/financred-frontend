
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Lock } from 'lucide-react';
import { LoginCredentials } from '@/types';

const loginFormSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/emprestimos');
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login(data as LoginCredentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-primary text-primary-foreground p-3 rounded-full">
              <Lock className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold">Login</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-primary underline hover:text-primary/80">
              Registre-se aqui
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
