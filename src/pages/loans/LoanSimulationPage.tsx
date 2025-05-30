
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

const formSchema = z.object({
  valorEmprestimo: z.coerce.number().min(1, 'Valor deve ser maior que zero'),
  taxaJuros: z.coerce.number().min(0.1, 'Taxa deve ser maior que 0.1%'),
  parcelas: z.coerce.number().int().min(1, 'Prazo deve ser um número inteiro maior que zero'),
});

type FormValues = z.infer<typeof formSchema>;

const LoanSimulationPage = () => {
  const [simulation, setSimulation] = useState<LoanSimulation | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorEmprestimo: 5000,
      taxaJuros: 1.5,
      parcelas: 12,
    },
  });
  
  const simulationMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await api.post('emprestimo/simulate', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      setSimulation(data);
    },
  });
  
  const onSubmit = (values: FormValues) => {
    simulationMutation.mutate(values);
  };
  
  return (
    <AppLayout requiredRole="any">
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
                  name="valorEmprestimo"
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
                  name="taxaJuros"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxa de Juros (% ao mês)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          step="0.1"
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
                      <FormLabel>Númeuro de parcelas</FormLabel>
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
                  <p className="text-lg font-medium">{formatCurrency(simulation.valorEmprestimo)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Juros</p>
                  <p className="text-lg font-medium">{simulation.taxaJuros}% a.m.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">parcelas</p>
                  <p className="text-lg font-medium">{simulation.parcelas} meses</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor da Parcela</p>
                  <p className="text-lg font-medium">{formatCurrency(simulation.valorParcela)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-lg font-medium">{formatCurrency(simulation.valorTotal)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Custo Efetivo</p>
                <p className="text-lg font-medium">
                  {formatCurrency(simulation.totalAmount - simulation.amount)}
                  <span className="text-sm text-muted-foreground ml-1">
                    ({((simulation.totalAmount / simulation.amount - 1) * 100).toFixed(2)}%)
                  </span>
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Cronograma de Pagamento</h3>
                <div className="border rounded-md max-h-64 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parcela</TableHead>
                        <TableHead>Data de Vencimento</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {simulation.payments.map((payment) => (
                        <TableRow key={payment.installmentNumber}>
                          <TableCell>{payment.installmentNumber}</TableCell>
                          <TableCell>
                            {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
