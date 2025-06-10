import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { useAuth } from '@/contexts/AuthContext';

type StatusUpdate = { idEmprestimo: string; statusEmprestimo: string; observacao: string };

const useEmprestimoStatus = (
  idCliente: string,
  onStatusUpdate: (status) => void
) => {
  const clientRef = useRef<Client | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.token || !idCliente) return;

    const socket = new SockJS(`http://localhost:8080/api/v1/ws?token=${user.token}`);

    socket.onerror = (error) => {
      console.error('❌ Erro no WebSocket:', error);
    };

    socket.onmessage = (event) => {
      console.log('[WebSocket RAW MESSAGE]', event.data);
    };

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log('[STOMP DEBUG]', str);
      },
      onConnect: () => {
        client.subscribe(`/topic/status-emprestimo/${idCliente}`, (message) => {
          try {
            const body = JSON.parse(message.body);
            console.log(body)
            onStatusUpdate(body);
          } catch (error) {
            console.error('❌ Erro ao processar mensagem:', error);
          }
        });
      },
      onStompError: (frame) => {
        console.error('❌ Erro STOMP:', frame.headers['message']);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [idCliente, onStatusUpdate, user.token]);
};

export default useEmprestimoStatus;