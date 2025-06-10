import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Client, LoanSimulation } from '@/types';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  idCliente: z.coerce.number().min(1, 'Cliente é obrigatório'),
  valorSolicitado: z.coerce.number().min(1, 'Valor deve ser maior que zero'),
  taxaJuros: z.coerce.number().min(0.1, 'Taxa deve ser maior que 0.1%'),
  parcelas: z.coerce.number().int().min(1, 'Prazo deve ser um número inteiro maior que zero'),
  observacao: z.string().optional(),
  tipoEmprestimo: z.string().optional(),
  dataInicio: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const LoanFormPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [simulation, setSimulation] = useState<LoanSimulation | null>(null);
  const [optionsClientes, setOptionsClientes] = useState<{ value: number; label: string }[]>([]);

  const optionsTipoEmprestimo = [
    {value: 'pessoal', label: "Pessoal"}
  ]

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idCliente: Number(user.idCliente),
      valorSolicitado: 0,
      taxaJuros: 4,
      parcelas: 0,
      observacao: '',
      tipoEmprestimo: '',
      dataInicio: '',
    },
  });

  const { data: clientesData } = useQuery({
    queryKey: ['admin-clientes'], 
    queryFn: async () => {
      const response = await api.get(`/clientes`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      return response.data.map((client: Client) => ({
        value: client.id,
        label: client.nomeCompleto
      }));
    },
    enabled: user.role === 'ROLE_ADMIN'
  });

  useEffect(() => {
    if (clientesData) {
      setOptionsClientes(clientesData);
    }
  }, [clientesData]);

  const rotaApiEmprestimo = user.role == "ROLE_ADMIN" ?  `emprestimos/admin` : `/emprestimos`


  const simulationMutation = useMutation({
    mutationFn: async (data: Omit<FormValues, 'clientId' | 'startDate'>) => {
      const response = await api.post(`/emprestimos`, data, { 
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (response.status == 200) {
        toast.success("Empréstimo criado com sucesso!");
        console.log(response.data.id)
        navigate('/emprestimos', { state: {novoId: response.data.id}});
      }
      return response.data;
    }, 
    onSuccess: (data) => setSimulation(data),
    onError: () => toast.error('Erro ao simular empréstimo. Verifique os dados e tente novamente.'),
  });

  const handleSimulate = () => {
    simulationMutation.mutate(form.getValues());
  };

  return (
    <AppLayout requiredRole="ROLE_CLIENTE">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Novo Empréstimo</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Empréstimo</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">

              <FormField
                  control={form.control}
                  name="tipoEmprestimo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo Empréstimo</FormLabel>
                      <Select
                        value={field.value ? String(field.value) : ''}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tipo de empréstimo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {optionsTipoEmprestimo.map((option) => (
                            <SelectItem key={option.value} value={String(option.value)}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="dataInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valorSolicitado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Empréstimo</FormLabel>
                    <FormControl>
                      <Input type="number" step="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxaJuros"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa de Juros</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parcelas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcelas</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={12} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observação</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
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
              onClick={() => navigate('/emprestimos')}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSimulate}
              disabled={simulationMutation.isPending}
            >
              {simulationMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Solicitar empréstimo
            </Button>
          </div>
        </form>
      </Form>
    </AppLayout>
  );
};

export default LoanFormPage;
