
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { 
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
} from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#4f46e5', '#22c55e', '#ef4444'];

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_CLIENTE';

  
  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get(
        '/dashboard/stats',
        { 
          headers: {  
            Authorization: `Bearer ${user.token}`  
          }   
        }  
      ); 
      return response.data;
    },
    enabled: isAdmin
  });

  const rotaApiCliente = user.role == "ROLE_ADMIN" ? "clientes" : `/me`

  
  const { data: clientData, isLoading: isLoadingClient } = useQuery({
    queryKey: ['client-dashboard', user?.idCliente],
    queryFn: async () => {
      const clientsResponse = await api.get(
          rotaApiCliente,
          { 
            headers: {  
              Authorization: `Bearer ${user.token}`  
            }    
          } 
        );   

      const client = clientsResponse.data;

      
      if (!client) {
        return { client: null, emprestimos: [], parcelas: [] };
      }

      const emprestimosResponse = await api.get(
        '/emprestimos/me',
        { 
          headers: {  
            Authorization: `Bearer ${user.token}`  
          }   
        }  
      );
      
      const emprestimos = emprestimosResponse.data;
      console.log(emprestimos)
       
      const parcelas = emprestimos.flatMap(emprestimo => emprestimo.parcelas);
      
      return { client, emprestimos, parcelas };
    },
    enabled: user?.role === 'ROLE_CLIENTE'
  });

  const renderContent = () => {
    if (user?.role === 'ROLE_CLIENTE') {
      if (isLoadingClient) {
        return (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        );
      }
      
      const { client, emprestimos, parcelas } = clientData || {};

      
      if (!client) { 
        return (
          <div className="text-center py-8">
            <p className="text-xl mb-4">Bem-vindo, {user.name}!</p>
            <p>Seus dados de cliente não foram encontrados no sistema.</p>
            <p className="mt-2">Entre em contato com o suporte para mais informações.</p>
          </div>
        );
      }
      
      const emprestimosAtivos = emprestimos?.filter(l => l.status === 'APROVADO') || [];
      const emprestimosQuitados = emprestimos?.filter(l => l.status === 'QUITADO') || [];
      
      const parcelasPendentes = parcelas?.filter(p => p.status === 'PENDENTE') || [];
      const parcelasAtrasadas = parcelas?.filter(p => p.status === 'ATRASADA') || [];
      
      const proximaParcela = parcelasPendentes.length > 0 
        ? parcelasPendentes.sort((a, b) => 
            new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime()
          )[0]
        : null;
      
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Bem-vindo, {client.nomeCompleto}!</CardTitle>
                <CardDescription>
                  Resumo da sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Empréstimos Ativos</p>
                    <p className="text-2xl font-bold">{emprestimosAtivos.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Empréstimos Quitados</p>
                    <p className="text-2xl font-bold">{emprestimosQuitados.length}</p>
                  </div>
                </div>
                
                {/* {lateemprestimos.length > 0 && (
                  <div className="bg-red-50 p-3 rounded-md flex items-center">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-800">
                        Você tem {lateemprestimos.length} empréstimo{lateemprestimos.length > 1 ? 's' : ''} em atraso
                      </p>
                      <p className="text-sm text-red-700">
                        É importante regularizar sua situação o quanto antes.
                      </p>
                    </div>
                  </div>
                )} */}
                
                <div className="flex space-x-3">
                  <Button asChild>
                    <Link to="/emprestimos">Ver Meus Empréstimos</Link>
                  </Button>
                  {/* <Button asChild variant="outline">
                    <Link to={`/emprestimo/${emprestimos.id}`}>Ver Parcelas</Link>
                  </Button> */}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Próximo Pagamento</CardTitle>
                <CardDescription>
                  {proximaParcela 
                    ? `Vencimento em ${new Date(proximaParcela.dataVencimento).toLocaleDateString('pt-BR')}`
                    : 'Não há pagamentos pendentes'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {proximaParcela ? (
                  <>
                    <p className="text-3xl font-bold mb-2">
                      {formatCurrency(proximaParcela.valorParcela)}
                    </p>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-1">
                        Dias até o vencimento:
                      </p>
                      <p className="font-bold text-lg">
                        {Math.max(0, Math.floor((new Date(proximaParcela.dataVencimento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} dias
                      </p>
                    </div>
                    
                    <Button className="mt-4" variant="outline" asChild>
                      <Link to="/pagamentos">Ver Todos os Pagamentos</Link>
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                    <p className="text-xl font-medium text-center">
                      Você não possui pagamentos pendentes!
                    </p>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      Todos os seus pagamentos estão em dia.
                    </p>
                    
                    <Button className="mt-6" variant="outline" asChild>
                      <Link to="/emprestimo/simulacao">Simular Novo Empréstimo</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {parcelasAtrasadas.length > 0 && (
            <Card className="mb-6">
              <CardHeader className="pb-2 text-red-600">
                <CardTitle>Pagamentos em Atraso</CardTitle>
                <CardDescription>
                  Você tem {parcelasAtrasadas.length} pagamento{parcelasAtrasadas.length > 1 ? 's' : ''} em atraso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parcela</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Multa</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parcelasAtrasadas.map(parcela => (
                        <TableRow key={parcela.id}>
                          <TableCell>{parcela.numeroParcela}</TableCell>
                          <TableCell>
                            {new Date(parcela.dataVencimento).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>{formatCurrency(parcela.valorParcela)}</TableCell>
                          <TableCell>
                            {parcela.lateFee 
                              ? formatCurrency(parcela.multa)
                              : '-'}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency((parcela.valorParcela + (parcela.multa || 0)))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <p className="mt-4 text-sm text-red-600">
                  Entre em contato com nossa equipe de atendimento para regularizar sua situação.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      );
    } else {
      // Admin dashboard
      if (isLoading) {
        return (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        );
      }
      
      if (!dashboardStats) {
        return (
          <div className="text-center py-8">
            <p>Erro ao carregar estatísticas.</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </div>
        ); 
      }
      
      return (
        <>
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats.totalClientes}
                </div>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link to="/clientes">Ver todos os clientes</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Empréstimos Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats.totalEmprestimosAtivos} / {dashboardStats.totalEmprestimos}
                </div>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link to="/emprestimos">Ver todos os empréstimos</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Emprestado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboardStats.valorTotalEmprestimos)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Empréstimos em Atraso
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* <div className="text-2xl font-bold text-red-600">
                  {dashboardStats.totalLateemprestimos}
                </div> */}
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="stats" className="w-full">
            <TabsList>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="emprestimos">Empréstimos por Período</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Empréstimos por Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dashboardStats?.emprestimosPorStatus}
                          dataKey="quantidade"
                          nameKey="status"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label={({ name, percent }) => 
                            `${name === 'APROVADO' ? 'Ativo' : 
                               name === 'QUITADO' ? 'Quitado' : 
                               name === 'late' ? 'Em Atraso' : name} (${(percent * 100).toFixed(0)}%)`
                          }
                        >
                          {dashboardStats?.emprestimosPorStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => {
                            const statusName = 
                              name === 'APROVADO' ? 'Ativo' : 
                              name === 'QUITADO' ? 'Quitado' : 
                              name === 'late' ? 'Em Atraso' : name;
                            return [value, statusName];
                          }}
                        />
                        <Legend 
                          formatter={(value) => {
                            return value === 'active' ? 'Ativo' : 
                                  value === 'paid' ? 'Quitado' : 
                                  value === 'late' ? 'Em Atraso' : value;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="emprestimos">
              <Card>
                <CardHeader>
                  <CardTitle>Empréstimos por Período</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dashboardStats?.emprestimosPorMes}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis 
                          tickFormatter={(value) => value.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        />
                        <Tooltip 
                          formatter={(value) => formatCurrency(Number(value))}
                          labelFormatter={(label) => `Período: ${label}`}
                        />
                        <Legend />
                        <Bar dataKey="valor" fill="#4f46e5" name="Valor" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        
        </>
      );
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {renderContent()}
    </>
  );
};

const CheckCircle = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AlertTriangle = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

export default Dashboard;
