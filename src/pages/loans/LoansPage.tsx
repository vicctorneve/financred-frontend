import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Loan } from '@/types';
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
import { FileText, Search, Calculator, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';
import useEmprestimoStatus from './useEmprestimoStatus';
import { useLocation } from 'react-router-dom';

const LoansPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const location = useLocation();
  const novoId = location.state?.novoId;
  const rotaApiEmprestimo = user.role == "ROLE_ADMIN" ? "emprestimos/admin" : `/emprestimos/me`;

  const { data, isLoading } = useQuery<Loan[]>({ 
    queryKey: ['loans'],
    queryFn: async () => {    
      const response = await api.get(rotaApiEmprestimo, { 
        headers: { Authorization: `Bearer ${user.token}` } 
      });
      return response.data;
    }
  });

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


  useEffect(() => {
    if (novoId && data && data.length > 0) {
      const fetchStatus = async () => {
        try {
          await delay(5000); 
          await getStatusEmprestimo(novoId);
        } catch (error) {
          console.error('Erro ao atualizar status do empréstimo:', error);
        }
      };

      fetchStatus();
    }
  }, [novoId, data]);

  const queryClient = useQueryClient();

  const getStatusEmprestimo = async (id) =>{
    const response = await api.get(`emprestimos/${id}`, { 
      headers: { Authorization: `Bearer ${user.token}` } 
    });


    queryClient.setQueryData<Loan[]>(['loans'], (oldData) => {
      if (!oldData) return oldData;
      return oldData.map((emprestimo) => {
        if (emprestimo.id === id) {
          return { ...emprestimo, 
            status: response.data.status,
            dataInicio: response.data.dataInicio
          };
        }
        return emprestimo;
      });
    });

    return response.data
  }


  useEffect(() => { 
    if (data) {
      setLoans(data);
    }
  }, [data]);


  const filteredLoans = loans.filter((loan: Loan) => {
    const matchesSearch = 
      loan.id.includes(searchTerm) || 
      loan.clienteId.includes(searchTerm);
    
    if (statusFilter === 'all') {
      return matchesSearch;
    } else {
      return matchesSearch && loan.status === statusFilter;
    }
  });

  return (
    <AppLayout requiredRole="ROLE_CLIENTE">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Empréstimos</h1>
        {user.role == 'ROLE_CLIENTE' && (
          <div className="flex space-x-2"> 
            <Button asChild className='bg-purple-600'>
              <Link to="/emprestimo/simulacao">
                <FileText className="h-4 w-4 mr-2" />
                Simular Empréstimo
              </Link>
            </Button>
            <Button asChild>
              <Link to="/emprestimos/novo">
                <FileText className="h-4 w-4 mr-2" />
                Novo Empréstimo
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex justify-end flex-col md:flex-row gap-4 mb-6">
        <Select 
          value={statusFilter} 
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="APROVADO">Aprovados</SelectItem>
            <SelectItem value="QUITADO">Quitados</SelectItem>
            <SelectItem value="REPROVADO">Reprovados</SelectItem>
          </SelectContent>
        </Select>
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
                <TableHead>Tipo emprestimo</TableHead>
                <TableHead>Valor Solicitado</TableHead>
                <TableHead>Taxa de juros</TableHead>
                <TableHead>Parcela</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Solicitação</TableHead> 
                <TableHead>Data Inicio</TableHead> 
                <TableHead>Observação</TableHead>
                {user.role == "ROLE_ADMIN" && (
                  <TableHead>Cliente</TableHead>
                )}
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Nenhum empréstimo encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredLoans.map((loan: Loan) => (
                  <TableRow key={loan.id}> 
                    <TableCell>{loan.tipoEmprestimo}</TableCell>
                    <TableCell>{formatCurrency(loan.valorSolicitado)}</TableCell>
                    <TableCell>{loan.taxaJuros}%</TableCell>
                    <TableCell>{loan.numeroParcelas}</TableCell>
                    <TableCell>
                      <div className={`inline-block px-2 py-1 rounded text-xs font-medium
                        ${loan.status === 'APROVADO' ? 'bg-green-100 text-green-800' : ''}
                        ${loan.status === 'QUITADO' ? 'bg-blue-100 text-blue-800' : ''}
                        ${loan.status === 'REPROVADO' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {loan.status}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(loan.dataSolicitacao).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {loan.dataInicio == null ? (
                          <p>-</p>
                      ) : (
                        new Date(loan.dataInicio).toLocaleDateString('pt-BR')
                      )}
                    </TableCell>
                    <TableCell>{loan.observacao}</TableCell>
                    {user.role == "ROLE_ADMIN" && (
                      <TableCell>{loan.emailCliente}</TableCell>
                    )}
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
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </AppLayout>
  );
};

export default LoansPage;
