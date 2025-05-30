
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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

const LoansPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();
  const [status, setStatus] = useState<string>(null);
  const [loans, setLoans] = useState<Loan[]>([]);


  useEmprestimoStatus(user.idCliente, (novoStatus) => {
    console.log('Atualizando status', novoStatus);
    // setLoans((prevLoans) =>
    //   prevLoans.map((loan) =>
    //     loan.id === novoStatus.id
    //       ? { ...loan, status: novoStatus.status }
    //       : loan
    //   )
    // );
  });

  const rotaApiEmprestimo = user.role == "ROLE_ADMIN" ? "emprestimos/admin" : `/emprestimos/me`
  
  const { data, isLoading } = useQuery({ 
    queryKey: ['loans'],
    queryFn: async () => {    
      const response = await api.get(
          rotaApiEmprestimo,
          { 
            headers: { 
              Authorization: `Bearer ${user.token}`  
            }   
          } 
      );   
      console.log(response) 
      return response.data;   
    } 
  });


  const filteredLoans = data?.filter((loan: Loan) => {
    const matchesSearch = 
      loan.id.includes(searchTerm) || 
      loan.clienteId.includes(searchTerm);
    
    if (statusFilter === 'all') {
      return matchesSearch;
    } else {
      return matchesSearch && loan.status === statusFilter;
    }
  }) || [];

  return (
    <AppLayout requiredRole="ROLE_CLIENTE">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Empréstimos</h1>
        <div className="flex space-x-2"> 
          {/* <Button asChild variant="outline">
            <Link to="/emprestimo/simulacao">
              <Calculator className="h-4 w-4 mr-2" />
              Simular
            </Link>
          </Button> */}
          <Button asChild>
            <Link to="/emprestimos/novo">
              <FileText className="h-4 w-4 mr-2" />
              Novo Empréstimo
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID do empréstimo ou cliente"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
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
                      {new Date(loan.dataSolicitacao).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {loan.dataInicio == null ? (
                          <p></p>
                      ): (
                        new Date(loan.dataInicio).toLocaleDateString('pt-BR')
                      )}
                    </TableCell>
                    <TableCell>{loan.observacao}</TableCell>
                    {user.role == "ROLE_ADMIN" && (
                      <TableHead>{loan.emailCliente}</TableHead>
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
