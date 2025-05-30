
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  nomeCompleto: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatório'),
  endereco: z.object({
    rua: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
    cep: z.string().optional(),
  }),
  dadosFinanceiros: z.object({
    renda: z.coerce.number().min(1, 'Renda é obrigatório'),
    profissao: z.string().optional(),
    empresa: z.string().optional(),
    contaBancaria: z.object({
      banco: z.string().optional(),
      agencia: z.string().optional(),
      conta: z.string().optional(),
    }).optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ClientFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeCompleto: '',
      cpf: '',
      email: '',
      telefone: '',
      dataNascimento: '',
      endereco: {
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
      },
      dadosFinanceiros: {
        renda: 0,
        profissao: '',
        empresa: '',
        contaBancaria: {
          banco: '',
          agencia: '',
          conta: '',
        },
      },
    },
  });
  
  const { isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      const response = await api.get(
        `/clientes/${id}`,
        { 
          headers: {  
            Authorization: `Bearer ${user.token}`  
          }   
        }  
      ); 
    const data = response.data;

    
    form.reset({
      nomeCompleto: data.nomeCompleto,
      cpf: data.cpf,
      email: data.email,
      telefone: data.telefone,
      dataNascimento: data.nascimento,
      endereco: {
        rua: data.rua,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        cep: data.cep,
      },
      dadosFinanceiros: {
        renda: data.renda,
        profissao: data.profissao,
        empresa: data.empresa,
        contaBancaria: {
          banco: data.banco,
          agencia: data.agencia,
          conta: data.conta,
        },
      },
    });
      
    return data;
    },
    enabled: isEditing,
  });

  
  
  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return await api.post('/clientes', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente criado com sucesso!');
      navigate('/clientes');
    },
    onError: () => {
      toast.error('Erro ao criar cliente. Tente novamente.');
    },
  });
  const rotaAtualizarDadosCliente = user.role == "ROLE_ADMIN" ? `/clientes/${id}` : `/me`
  
  const updateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await api.patch(
        rotaAtualizarDadosCliente, data,
        { 
          headers: {  
            Authorization: `Bearer ${user.token}`  
          }   
        }  
      ); 

      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente atualizado com sucesso!');
      navigate(`/clients/${id}`);
    },
    onError: () => {
      toast.error('Erro ao atualizar cliente. Tente novamente.');
    },
  });
  
  const onSubmit = (values: FormValues) => {
    if (isEditing) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };
  
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
        </h1>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nomeCompleto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
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
                        <Input placeholder="000.000.000-00" {...field} />
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
                        <Input 
                          type="email" 
                          placeholder="email@exemplo.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(00) 00000-0000" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataNascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de nascimento</FormLabel>
                      <FormControl>
                        <Input 
                          type='date'
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="endereco.rua"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="endereco.numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder="Número" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endereco.complemento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input placeholder="Complemento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="endereco.bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endereco.cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endereco.cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endereco.estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Estado (UF)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dados Financeiros</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="dadosFinanceiros.renda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Renda Mensal</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dadosFinanceiros.profissao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profissão</FormLabel>
                      <FormControl>
                        <Input placeholder="Profissão" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dadosFinanceiros.empresa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              
              <CardHeader>
                <CardTitle className="text-base">Dados Bancários (opcional)</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="dadosFinanceiros.contaBancaria.banco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banco</FormLabel>
                      <FormControl>
                        <Input placeholder="Banco" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dadosFinanceiros.contaBancaria.agencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agência</FormLabel>
                      <FormControl>
                        <Input placeholder="Agência" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dadosFinanceiros.contaBancaria.conta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conta</FormLabel>
                      <FormControl>
                        <Input placeholder="Conta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/clientes')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? 'Atualizar' : 'Criar'} Cliente
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default ClientFormPage;
