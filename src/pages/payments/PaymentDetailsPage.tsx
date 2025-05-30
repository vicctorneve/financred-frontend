
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { Payment, Loan, Client } from '@/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/formatters';

const PaymentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  
  // Find loan and payment
  const { data: loans, isLoading } = useQuery({
    queryKey: ['loans'],
    queryFn: async () => {
      const response = await api.get('/api/loans');
      return response.data.data;
    }
  });
  
  // Find the payment from all loans
  let payment: (Payment & { loan?: Loan }) | undefined;
  let loan: Loan | undefined;
  
  if (loans) {
    for (const l of loans) {
      const p = l.payments.find((p: Payment) => p.id === id);
      if (p) {
        payment = { ...p, loan: l };
        loan = l;
        break;
      }
    }
  }
  
  // Get client data
  const { data: client, isLoading: isLoadingClient } = useQuery({
    queryKey: ['client', loan?.clientId],
    queryFn: async () => {
      const response = await api.get(`/api/clients/${loan?.clientId}`);
      return response.data.data;
    },
    enabled: !!loan?.clientId
  });
  
  // Calculate late fee if payment is late
  const isLate = payment?.status === 'late';
  const lateFee = isLate ? payment?.lateFee : 0;
  const totalAmountDue = isLate && payment ? payment.amount + (payment.lateFee || 0) : payment?.amount;
  
  // Set initial payment amount
  React.useEffect(() => {
    if (totalAmountDue) {
      setPaymentAmount(totalAmountDue);
    }
  }, [totalAmountDue]);
  
  // Update payment status mutation
  const updatePaymentMutation = useMutation({
    mutationFn: async (updateData: { 
      status: 'paid', 
      paidAt: string,
      lateFee?: number
    }) => {
      return await api.put(`/api/payments/${id}`, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast.success('Pagamento registrado com sucesso!');
      setIsPayDialogOpen(false);
      // Navigate back to refresh data
      navigate('/pagamentos');
    },
    onError: () => {
      toast.error('Erro ao registrar pagamento. Tente novamente.');
    }
  });
  
  const handleRegisterPayment = () => {
    const updateData = {
      status: 'paid' as const,
      paidAt: new Date(paymentDate).toISOString(),
      lateFee: isLate ? lateFee : undefined
    };
    
    updatePaymentMutation.mutate(updateData);
  };
  
  if (isLoading) {
    return (
      <AppLayout requiredRole="ROLE_CLIENTE">
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!payment) {
    return (
      <AppLayout requiredRole="ROLE_CLIENTE">
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold">Pagamento não encontrado</h2>
          <Button asChild className="mt-4">
            <Link to="/pagamentos">Voltar para a lista</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout requiredRole="ROLE_CLIENTE">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pagamento </h1>
        <Button asChild>
          <Link to="/pagamentos">Voltar</Link>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Parcela</p>
                <p className="font-medium">{payment.installmentNumber} de {loan?.term}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Vencimento</p>
                <p className="font-medium">
                  {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="font-medium">{formatCurrency(payment.amount)}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className={`
                inline-block px-2 py-1 rounded text-sm font-medium mt-1
                ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : ''}
                ${payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${payment.status === 'late' ? 'bg-red-100 text-red-800' : ''}
              `}>
                {payment.status === 'paid' ? 'Pago' : 
                 payment.status === 'pending' ? 'Pendente' :
                 payment.status === 'late' ? 'Em Atraso' : payment.status}
              </div>
            </div>
            {payment.status === 'paid' && payment.paidAt && (
              <div>
                <p className="text-sm text-muted-foreground">Data de Pagamento</p>
                <p className="font-medium">
                  {new Date(payment.paidAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
            {payment.status === 'late' && payment.lateFee && (
              <div className="bg-red-50 p-3 rounded flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">Multa por Atraso</p>
                  <p className="text-red-700">{formatCurrency(payment.lateFee)}</p>
                  <p className="text-sm text-red-600 mt-1">
                    Valor total com multa: {formatCurrency(payment.amount + payment.lateFee)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          {(payment.status === 'pending' || payment.status === 'late') && (
            <CardFooter>
              <Dialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Registrar Pagamento</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Pagamento</DialogTitle>
                    <DialogDescription>
                      Confirme os detalhes do pagamento abaixo.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentDate">Data do Pagamento</Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentAmount">Valor a Pagar</Label>
                      <Input
                        id="paymentAmount"
                        type="number"
                        value={paymentAmount}
                        disabled
                      />
                    </div>
                    {isLate && (
                      <div className="bg-amber-50 p-3 rounded">
                        <p className="text-sm font-medium text-amber-800 mb-1">
                          Este pagamento está em atraso
                        </p>
                        <p className="text-sm text-amber-700">
                          Valor da parcela: {formatCurrency(payment.amount)}<br />
                          Multa por atraso: {formatCurrency(lateFee || 0)}<br />
                          <span className="font-medium">Total a pagar: {formatCurrency(totalAmountDue || 0)}</span>
                        </p>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsPayDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleRegisterPayment}
                      disabled={updatePaymentMutation.isPending}
                    >
                      {updatePaymentMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confirmar Pagamento
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          )}
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Empréstimo</CardTitle>
          </CardHeader>
          {loan ? (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="font-medium">{formatCurrency(loan.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Juros</p>
                  <p className="font-medium">{loan.interestRate}% a.m.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Prazo</p>
                  <p className="font-medium">{loan.term} meses</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className={`
                    inline-block px-2 py-1 rounded text-xs font-medium
                    ${loan.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    ${loan.status === 'paid' ? 'bg-blue-100 text-blue-800' : ''}
                    ${loan.status === 'late' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {loan.status === 'active' ? 'Ativo' : 
                     loan.status === 'paid' ? 'Quitado' :
                     loan.status === 'late' ? 'Em Atraso' : loan.status}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/loans/${loan.id}`}>Ver Empréstimo</Link>
                </Button>
              </div>
            </CardContent>
          ) : (
            <CardContent>
              <p>Empréstimo não encontrado</p>
            </CardContent>
          )}
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cliente</CardTitle>
          </CardHeader>
          {isLoadingClient ? (
            <CardContent className="flex justify-center items-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </CardContent>
          ) : client ? (
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{client.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{client.cpf}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{client.email}</p>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/clients/${client.id}`}>Ver Cliente</Link>
                </Button>
              </div>
            </CardContent>
          ) : (
            <CardContent>
              <p>Cliente não encontrado</p>
            </CardContent>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default PaymentDetailsPage;
