
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { api } from '@/services/api';
import { Loan, Parcela } from '@/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@/components/ui/table';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';


const LoanDetailsPage = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>(); 


  const { data, isLoading, refetch  } = useQuery({ 
    queryKey: ['loans', id],
    queryFn: async () => {   
      const response = await api.get(
        `/emprestimos/${id}/parcelas`,
        { 
          headers: {  
            Authorization: `Bearer ${user.token}`  
          }   
        } 
      );   
      return response.data;   
    } 
  });

  const filteredLoans = data?.filter((loan: Loan) => {
      return data
  }) || [];
 
  if (!filteredLoans) {
    return (
      <AppLayout requiredRole="ROLE_CLIENTE">
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold">Empréstimo não encontrado</h2>
          <Button asChild className="mt-4"> 
            <Link to="/emprestimos">Voltar para a lista</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const pagarEmprestimo = async () =>{
    try {
      const response = await api.post(
        `/emprestimos/quitar`,
        {
        "idEmprestimo": id
        },
        { 
          headers: { 
            Authorization: `Bearer ${user.token}`  
          }   
        } 
      );

      await refetch();

      toast.success('Empréstimo quitado com sucesso')
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data ,{
          duration: 3000,
        })
      } else if (error.request) {
        console.error('Sem resposta do servidor:', error.request);
      } else {
        console.error('Erro ao configurar a requisição:', error.message);
      }
    }
    
  }

  const normalizarData = (data: string): string => {
    const [ano, mes, dia] = data.split('-');
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  };

  const pagarParcela = async (event: React.MouseEvent<HTMLParagraphElement>) =>{   
    try {

      const dataVencimento = event.currentTarget.getAttribute("data-id");
      const dataFormatada = normalizarData(dataVencimento);
  
      const parcela = filteredLoans.filter((dadosParcela: Parcela) => {
        return dadosParcela?.dataVencimento === dataFormatada;
      });
  
      if ( parcela[0].statusParcela == "PAGA"){
        toast.error(`Parcela da data vencimento: ${dataVencimento}, já está paga!`)
        return
      }
      const response = await api.post(
        `/emprestimos/parcelas/quitar`,
        {
        "dataVencimento": dataVencimento,
        "idEmprestimo": id
        },
        { 
          headers: { 
            Authorization: `Bearer ${user.token}`  
          }   
        } 
      );   
  
      await refetch();
  
      toast.success(`Parcela da data vencimento ${dataVencimento} paga!`)
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data ,{
          duration: 3000,
        })
      } else if (error.request) {
        console.error('Sem resposta do servidor:', error.request);
      } else {
        console.error('Erro ao configurar a requisição:', error.message);
      }
    }
  }

  return (
    <AppLayout requiredRole="ROLE_CLIENTE">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Empréstimo </h1>
        <div className="flex space-x-2">
          <Button asChild>
            <Link to="/emprestimos">Voltar</Link>
          </Button>
        </div>
      </div>
      <CardHeader>
        <div className="flex justify-between items-center mb-6">
          <CardTitle>Detalhes do Empréstimo</CardTitle>
          <Button 
            className="hover:bg-white cursor-pointer text-white bg-purple-400"
            asChild
          >
            <p onClick={pagarEmprestimo}>Quitar Empréstimo</p>
          </Button>
        </div>
      </CardHeader>

      
      <div className="border rounded-md max-h-[800px] overflow-y-auto">
        <Table className="min-w-full">
          <thead className="bg-white sticky top-0 z-10">
            <TableRow>
              <TableHead>Numero Parcela</TableHead>
              <TableHead>Valor Parcela</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Vencimento</TableHead> 
              <TableHead>Multa</TableHead> 
              <TableHead>Dias Atraso</TableHead> 
              <TableHead>Valor Juros</TableHead>
              <TableHead>Observação</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </thead>

          <TableBody
            className=''>
            {filteredLoans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  Nenhum detalhe encontrado para este empréstimo
                </TableCell>
              </TableRow>
            ) : (
              filteredLoans.map((dadosParcela: Parcela) => (
                <TableRow key={dadosParcela.id}>
                  <TableCell>{dadosParcela.numeroParcela}</TableCell>
                  <TableCell>{formatCurrency(dadosParcela.valorParcela)}</TableCell>
                  <TableCell>{dadosParcela.statusParcela}</TableCell>
                  <TableCell>{new Date(dadosParcela.dataVencimento).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{dadosParcela.multa}</TableCell>
                  <TableCell>{dadosParcela.diasAtraso}</TableCell>
                  <TableCell>{dadosParcela.valorJuros}</TableCell>
                  <TableCell>{dadosParcela.observacao}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost"
                      size="sm"
                      asChild
                      id={dadosParcela.id}
                      className="hover:bg-white cursor-pointer text-white bg-purple-400"
                    >
                      <p data-id={dadosParcela.dataVencimento} onClick={pagarParcela}>Pagar</p>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
};

export default LoanDetailsPage;
