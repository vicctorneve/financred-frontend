
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Pagamentos, Loan } from '@/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';

const PaymentsPage = () => {
  const { user } = useAuth();

  const rotaApiEmprestimo = user.role == "ROLE_ADMIN" ? "/historico-pagamentos/admin" : `/historico-pagamentos/me`

   
  const { data: pagamentos, isLoading } = useQuery({
    queryKey: ['pagamentos'],
    queryFn: async () => {
      const response = await api.get(
        rotaApiEmprestimo, 
        { 
          headers: {  
            Authorization: `Bearer ${user.token}`  
          }    
        } 
      );   
      return response.data;
    }
  });


  return (
    <AppLayout requiredRole="ROLE_CLIENTE">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pagamentos</h1>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parcela</TableHead>
                <TableHead>Valor Pago</TableHead>
                <TableHead>Data de Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tipo Emprestimo</TableHead>
                <TableHead>Observação</TableHead>
                <TableHead>Forma de Pagamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagamentos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Nenhum pagamento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                pagamentos.map((payment: Pagamentos, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{payment.numeroParcela}</TableCell>
                    <TableCell>{formatCurrency(payment.valorPago)}</TableCell>
                    <TableCell>{new Date(payment.dataPagamento).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{payment.statusPagamento}</TableCell>
                    <TableCell>{payment.tipoEmprestimo}</TableCell>
                    <TableCell>{payment.observacao}</TableCell>
                    <TableCell>{payment.formaPagamento}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </AppLayout>
  );
};

export default PaymentsPage;
