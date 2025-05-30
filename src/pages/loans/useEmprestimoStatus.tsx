import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const useEmprestimoStatus = (idCliente: string, onStatusUpdate: (status: string) => void) => {
  const clientRef = useRef<Client | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const socket = new SockJS(`http://localhost:8080/api/v1/ws?token=${user.token}`); 
    const client = new Client({
      webSocketFactory: () => socket, 
      reconnectDelay: 5000, // tenta reconectar automaticamente
      onConnect: () => {
        console.log('Connected'); 

        client.subscribe(`/topic/status-emprestimo/${idCliente}`, (message) => {
          const body = JSON.parse(message.body);
          console.log('Status recebido:', body); 
          onStatusUpdate(body);
        });
      }, 
      onStompError: (frame) => {
        console.error('Erro STOMP:', frame.headers['message']);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      console.log('Desconectado do WebSocket');
    };
  }, [idCliente, onStatusUpdate]);
};

export default useEmprestimoStatus;
