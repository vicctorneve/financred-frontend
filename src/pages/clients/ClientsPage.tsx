
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Client } from '@/types';
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
import { UserPlus, Search, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  
  
  const { data, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await api.get(
        `/clientes`,
        { 
          headers: {  
            Authorization: `Bearer ${user.token}`  
          }   
        } 
      );   

      return response.data;
    }
  });

  const filteredClients = data?.filter((client: Client) => 
    // client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    // client.cpf.includes(searchTerm) ||
    // client.data_nascimento ||
    // client.renda_mensal ||
    // client.score ||
    // client.email.toLowerCase().includes(searchTerm.toLowerCase())
    data
  ) || [];

  return (
    <AppLayout requiredRole="ROLE_CLIENTE">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, CPF ou email"
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Data de nascimento</TableHead>
                <TableHead>Renda mensal</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client: Client,  index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{client.nomeCompleto}</TableCell>
                    <TableCell>{client.cpf}</TableCell>
                    <TableCell>{client.nascimento}</TableCell>
                    <TableCell>{client.renda}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.score}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="hover:bg-accent"
                      >
                        <Link to={`/clients/${client.id}`}>Detalhes</Link>
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

export default ClientsPage;
