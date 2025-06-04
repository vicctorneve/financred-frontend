
export type UserRole = 'ROLE_ADMIN' | 'ROLE_CLIENTE';

export interface User {
  idCliente: string;
  nome: string;
  email: string;
  cpf: string;
  data_nascimento: string;
  renda_mensal: number;
  role: UserRole;
  createdAt: string;
  token?: string;
}



export interface Client {
  id: string;
  nomeCompleto: string;
  cpf: string;
  email: string;
  telefone: string;
  rua: string;
  nascimento: string;
  numero: string;
  complemento: string;
  estado: string;
  cidade: string;
  cep: string;
  renda: number;
  profissao: string;
  empresa: string;
  banco: string;
  agencia: string;
  conta: string;
  score: number;
  scorolere: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
  };
  financialData: {
    income: number;
    profession: string;
    company?: string;
    bankAccount?: {
      bank: string;
      agency: string;
      account: string;
    };
  };
  createdAt: string;
  userId?: string;
}

export type LoanStatus = 'active' | 'paid' | 'late';

export interface Loan {
  id: string,
  valorSolicitado: number,
  totalComJuros: string,
  valorJuros: string,
  taxaMultaAtraso: string,
  emailCliente: string,
  taxaJuros: number,
  numeroParcelas: string,
  status: string,
  dataInicio: string ,
  dataFim: string ,
  clienteId: string,
  tipoEmprestimo: string,
  observacao: string
  dataSolicitacao: string,
  dataAprovacao: string
  cliente: string
  pagamentos: Pagamentos[];
}

export interface EmprestimoParcelas {
  parcela: Parcela[]
}

export interface Parcela {
  id: string,
  valorParcela: number,
  valorJuros: string,
  statusParcela: string,
  diasAtraso: number,
  numeroParcela: number,
  multa: string,
  observacao: string ,
  emprestimoId: string ,
  dataVencimento: string,
  tipoEmprestimo: string,
  dataPagamento: string
  dataSolicitacao: string,
  createdAt: string
  updatedAt: string;
}

export interface Pagamentos {
  dataPagamento: string
  formaPagamento: string
  numeroParcela: number
  observacao: string
  statusPagamento: string
  tipoEmprestimo: string
  valorPago: number
}

export interface LoanSimulation {
  totalComJuros: number;
  valorSolicitado: number;
  numeroParcelas: number;
  valorParcela: number;
  dataInicio: string;
  tipoEmprestimo: string;
}

export interface LoginCredentials {
  name: string;
  email: string;
  senha: string;
  cpf: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DashboardStats {
  totalClients: number;
  totalLoans: number;
  totalActiveLoans: number;
  totalLateLoans: number;
  totalLoanAmount: number;
  totalPaidAmount: number;
  loansByStatus: {
    status: LoanStatus;
    count: number;
  }[];
  loansByMonth: {
    month: string;
    amount: number;
  }[];
}
