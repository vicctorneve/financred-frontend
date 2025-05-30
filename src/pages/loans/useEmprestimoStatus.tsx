import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { useAuth } from '@/contexts/AuthContext';

type StatusUpdate = { id: string; status: string };

const useEmprestimoStatus = (
  idCliente: string,
  onStatusUpdate: (status: StatusUpdate) => void
) => {
  const clientRef = useRef<Client | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const socket = new SockJS(`http://localhost:8080/api/v1/ws?token=${user.token}`);
    
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ Conectado ao WebSocket');

        client.subscribe(`/topic/status-emprestimo/${idCliente}`, (message) => {
          const body: StatusUpdate = JSON.parse(message.body);
          console.log('📥 Status recebido:', body);
          onStatusUpdate(body);
        });
      }, 
      onStompError: (frame) => {
        console.error('❌ Erro STOMP:', frame.headers['message']);
      },
    });
    
    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      console.log('🔌 Desconectado do WebSocket');
    };
  }, [idCliente, onStatusUpdate, user.token]);
};

export default useEmprestimoStatus;
