
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { LoanSimulation } from '@/types';
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
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Calculator } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { formatCurrency } from '@/utils/formatters';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
const formSchema = z.object({
  valorSolicitado: z.coerce.number().min(1, 'Valor deve ser maior que zero'),
  parcelas: z.coerce.number().int().min(1, 'Prazo deve ser um número inteiro maior que zero'),
  dataInicio: z.coerce.string(),
  tipoEmprestimo: z.coerce.string(),
});

type FormValues = z.infer<typeof formSchema>;

const LoanSimulationPage = () => {
  const [simulation, setSimulation] = useState<LoanSimulation | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorSolicitado: 0,
      parcelas: 0,
      dataInicio: '',
      tipoEmprestimo: '',
    },
  });
  
  const simulationMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await api.post('emprestimos/simular', data);
      return response.data;
    },
    onSuccess: (data) => {
      setSimulation(data);
    },
  });

  const optionsTipoEmprestimo = [
    {value: 'pessoal', label: "Pessoal"}
  ]
  
  const onSubmit = (values: FormValues) => {
    simulationMutation.mutate(values);
  };
  
  return (
    <AppLayout requiredRole="ROLE_CLIENTE">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Simulação de Empréstimo</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Parâmetros da Simulação</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

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
                  name="valorSolicitado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor do Empréstimo</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          step="100"
                          {...field} 
                        />
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
                      <FormLabel>Número de parcelas</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="12"
                          min={1}
                          max={240}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  disabled={simulationMutation.isPending}
                  className="w-full"
                >
                  {simulationMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calculando...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Calcular
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {simulation && (
          <Card>
            <CardHeader>
              <CardTitle>Resultado da Simulação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Valor do Empréstimo</p>
                  <p className="text-lg font-medium">{formatCurrency(simulation.totalComJuros)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Juros</p>
                  <p className="text-lg font-medium">4% a.m.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">parcelas</p>
                  <p className="text-lg font-medium">{simulation.numeroParcelas} meses</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor da Parcela</p>
                  <p className="text-lg font-medium">{formatCurrency(simulation.valorParcela)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-lg font-medium">{formatCurrency(simulation.totalComJuros)}</p>
                </div>
              </div>
              
              <Separator />
              
             <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded flex items-start space-x-2">
              <HiOutlineInformationCircle className="w-5 h-5 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold mb-1">Simulação de Empréstimo</h3>
                <p className="text-sm">
                  Esta é apenas uma simulação. Para contratar um empréstimo, é necessário passar por análise e aprovação de crédito.
                </p>
              </div>
            </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default LoanSimulationPage;
