
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

const registerFormSchema = z.object({
  nomeCompleto: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(6, 'CPF invalido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme sua senha'),
}).refine((data) => data.senha === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      nomeCompleto: '',
      email: '',
      cpf: '',
      senha: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // Register the user
      const response = await api.post('/auth/register', {
        nomeCompleto: data.nomeCompleto,
        email: data.email,
        senha: data.senha,
        cpf: data.cpf
      });
      


      if (response.status == 200) {
        // Auto login after registration
        await login({
          name: data.nomeCompleto,
          email: data.email,
          senha: data.senha,
          cpf: data.cpf
        });
        
        toast({
          title: "Registro realizado com sucesso!",
          description: "Sua conta foi criada e você está logado.",
        });
        
        // Redirect to client dashboard
        navigate('/client/register');
      } else {
        toast({
          variant: "destructive",
          title: "Falha no registro",
          description: response.data.error || "Ocorreu um erro ao criar sua conta.",
        });
      }
    } catch (error) {
      console.error("Register error:", error);
      toast({
        variant: "destructive",
        title: "Falha no registro",
        description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-primary text-primary-foreground p-3 rounded-full">
              <UserPlus className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold">Criar Conta</CardTitle>
          <CardDescription className="text-center">
            Preencha os campos para se registrar como cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="nomeCompleto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="nome@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input type="text" maxLength={11}  placeholder="nome@exemplo.com" {...field} />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Registrando..." : "Criar conta"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            Já possui uma conta?{" "}
            <Link to="/login" className="text-primary underline hover:text-primary/80">
              Entre aqui
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
