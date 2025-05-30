
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { api } from '@/services/api';
import { Loan } from '@/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Edit, FileText, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';

const ClientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  
  const { data: client, isLoading: isLoadingClient } = useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      const response = await api.get(
        `clientes/${id}`,
        { 
          headers: {  
            Authorization: `Bearer ${user.token}`  
          }   
        } 
      );   
      return response.data;
    }
  });
  
  const { data: loans, isLoading: isLoadingLoans } = useQuery({
    queryKey: ['client-loans', id],
    queryFn: async () => {
      const response = await api.get(
        `/emprestimos/${id}`,
        {  
          headers: {  
            Authorization: `Bearer ${user.token}`  
          }   
        } 
      ); 
      return response.data;
    },
    enabled: !!id
  });
  
  if (isLoadingClient) {
    return (
      <AppLayout requiredRole="ROLE_CLIENTE">
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!client) {
    return (
      <AppLayout requiredRole="ROLE_CLIENTE">
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold">Cliente não encontrado</h2>
          <Button asChild className="mt-4">
            <Link to="/clientes">Voltar para a lista</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout requiredRole="ROLE_CLIENTE">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{client.name}</h1>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link to={`/clients/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
          <Button asChild>
            <Link to="/emprestimos/novo" state={{ client }}>
              <FileText className="h-4 w-4 mr-2" />
              Novo Empréstimo
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">CPF</p>
              <p>{client.cpf}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{client.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p>{client.phone}</p>
            </div>
            <Separator />
            {client.cidade && (
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p>
                  {client.cidade}, {client.numero}
                  {client.complemento}
                </p>
                <p>
                  {client.rua}, {client.cidade}/{client.estado}
                </p>
                <p>CEP: {client.cep}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dados Financeiros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Renda Mensal</p>
              <p>{formatCurrency(client.renda)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profissão</p>
              <p>{client.profissao}</p>
            </div>
            {client.empresa && (
              <div>
                <p className="text-sm text-muted-foreground">Empresa</p>
                <p>{client.empresa}</p>
              </div>
            )}
            {client.banco && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Dados Bancários</p>
                  <p>Banco: {client.banco}</p>
                  <p>Agência: {client.agencia}</p>
                  <p>Conta: {client.conta}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">Histórico de Empréstimos</h2>
      
      {isLoadingLoans ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Valor</TableHead>
                <TableHead>Taxa de Juros</TableHead>
                <TableHead>Prazo (meses)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Início</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans && loans.length > 0 ? (
                loans.map((loan: Loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>{formatCurrency(loan.valorSolicitado)}</TableCell>
                    <TableCell>{loan.taxaJuros}%</TableCell>
                    <TableCell>{loan.numeroParcelas}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      {new Date(loan.dataInicio).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="hover:bg-accent"
                      >
                        <Link to={`/emprestimo/${loan.id}`}>Detalhes</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Nenhum empréstimo encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </AppLayout>
  );
};

export default ClientDetailsPage;
