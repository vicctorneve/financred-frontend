import axios from 'axios';

// This is a mock API service that simulates API calls
export const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status >= 200 && status < 300
});

// // Mock data for development
// const mockUsers: User[] = [
//   {
//     idCliente: '1',
//     name: 'Admin User',
//     email: 'admin@finly.com',
//     data_nascimento: '17/12/2003',
//     cpf: '08191741575',
//     renda_mensal: 1000,
//     role: 'ADMIN',
//     createdAt: '2023-01-01T00:00:00Z',
//     token: 'mock-jwt-token-admin',
//   },
//   {
//     idCliente: '2',
//     name: 'Attendant User',
//     email: 'attendant@finly.com',
//     data_nascimento: '17/12/2003',
//     cpf: '08191741571',
//     renda_mensal: 1000,
//     role: 'ADMIN',
//     createdAt: '2023-01-02T00:00:00Z',
//     token: 'mock-jwt-token-attendant',
//   },
//   {
//     idCliente: '3',
//     name: 'Client User',
//     email: 'client@example.com',
//     data_nascimento: '17/12/2003',
//     cpf: '08191741572',
//     renda_mensal: 1000,
//     role: 'CLIENTE',
//     createdAt: '2023-01-03T00:00:00Z',
//     token: 'mock-jwt-token-client',
//   },
// ];

// const mockClients: Client[] = [
//   {
//     id: '1',
//     name: 'John Doe',
//     cpf: '123.456.789-00',
//     email: 'john@example.com',
//     phone: '(11) 99999-9999',
//     data_nascimento: '17/12/2003',
//     renda_mensal: '2.000,00',
//     score: '500',
//     address: {
//       street: 'Main Street',
//       number: '123',
//       district: 'Downtown',
//       city: 'São Paulo',
//       state: 'SP',
//       zipCode: '01001-000',
//     },
//     financialData: {
//       income: 5000,
//       profession: 'Software Developer',
//       company: 'Tech Company',
//       bankAccount: {
//         bank: 'Banco do Brasil',
//         agency: '1234',
//         account: '56789-0',
//       },
//     },
//     createdAt: '2023-01-10T00:00:00Z',
//     userId: '3',
//   },
//   {
//     id: '2',
//     name: 'Jane Smith',
//     cpf: '987.654.321-00',
//     email: 'jane@example.com',
//     data_nascimento: '17/12/2003',
//     renda_mensal: '2.000,00',
//     score: '200',
//     phone: '(11) 88888-8888',
//     address: {
//       street: 'Secondary Street',
//       number: '456',
//       district: 'Center',
//       city: 'Rio de Janeiro',
//       state: 'RJ',
//       zipCode: '20000-000',
//     },
//     financialData: {
//       income: 6000,
//       profession: 'Designer',
//       company: 'Design Studio',
//       bankAccount: {
//         bank: 'Itaú',
//         agency: '5678',
//         account: '12345-6',
//       },
//     },
//     createdAt: '2023-01-15T00:00:00Z',
//   },
//   {
//     id: '3',
//     name: 'Jane Smith',
//     cpf: '987.654.321-00',
//     email: 'jane@example.com',
//     data_nascimento: '17/12/2003',
//     renda_mensal: '2.000,00',
//     score: '200',
//     phone: '(11) 88888-8888',
//     address: {
//       street: 'Secondary Street',
//       number: '456',
//       district: 'Center',
//       city: 'Rio de Janeiro',
//       state: 'RJ',
//       zipCode: '20000-000',
//     },
//     financialData: {
//       income: 6000,
//       profession: 'Designer',
//       company: 'Design Studio',
//       bankAccount: {
//         bank: 'Itaú',
//         agency: '5678',
//         account: '12345-6',
//       },
//     },
//     createdAt: '2023-01-15T00:00:00Z',
//   },
// ];

// const mockLoans: Loan[] = [
//   {
//     id: '1',
//     clientId: '1',
//     amount: 10000,
//     interestRate: 1.5,
//     term: 12,
//     installmentAmount: 888.49,
//     totalAmount: 10661.88,
//     startDate: '2023-02-01T00:00:00Z',
//     endDate: '2024-02-01T00:00:00Z',
//     status: 'active',
//     payments: [],
//     createdAt: '2023-02-01T00:00:00Z',
//   },
//   {
//     id: '2',
//     clientId: '2',
//     amount: 5000,
//     interestRate: 2.0,
//     term: 6,
//     installmentAmount: 858.57,
//     totalAmount: 5151.42,
//     startDate: '2023-01-15T00:00:00Z',
//     endDate: '2023-07-15T00:00:00Z',
//     status: 'paid',
//     payments: [],
//     createdAt: '2023-01-15T00:00:00Z',
//   },
//   {
//     id: '3',
//     clientId: '1',
//     amount: 15000,
//     interestRate: 1.8,
//     term: 24,
//     installmentAmount: 757.13,
//     totalAmount: 18171.12,
//     startDate: '2023-03-10T00:00:00Z',
//     endDate: '2025-03-10T00:00:00Z',
//     status: 'late',
//     payments: [],
//     createdAt: '2023-03-10T00:00:00Z',
//   },
// ];

// const mockPayments: Payment[] = [
//   {
//     id: '1',
//     loanId: '1',
//     installmentNumber: 1,
//     dueDate: '2023-03-01T00:00:00Z',
//     amount: 888.49,
//     status: 'paid',
//     paidAt: '2023-02-28T00:00:00Z',
//   },
//   {
//     id: '2',
//     loanId: '1',
//     installmentNumber: 2,
//     dueDate: '2023-04-01T00:00:00Z',
//     amount: 888.49,
//     status: 'paid',
//     paidAt: '2023-04-01T00:00:00Z',
//   },
//   {
//     id: '3',
//     loanId: '1',
//     installmentNumber: 3,
//     dueDate: '2023-05-01T00:00:00Z',
//     amount: 888.49,
//     status: 'pending',
//   },
//   {
//     id: '4',
//     loanId: '2',
//     installmentNumber: 1,
//     dueDate: '2023-02-15T00:00:00Z',
//     amount: 858.57,
//     status: 'paid',
//     paidAt: '2023-02-14T00:00:00Z',
//   },
//   {
//     id: '5',
//     loanId: '2',
//     installmentNumber: 2,
//     dueDate: '2023-03-15T00:00:00Z',
//     amount: 858.57,
//     status: 'paid',
//     paidAt: '2023-03-15T00:00:00Z',
//   },
//   {
//     id: '6',
//     loanId: '3',
//     installmentNumber: 1,
//     dueDate: '2023-04-10T00:00:00Z',
//     amount: 757.13,
//     status: 'paid',
//     paidAt: '2023-04-10T00:00:00Z',
//   },
//   {
//     id: '7',
//     loanId: '3',
//     installmentNumber: 2,
//     dueDate: '2023-05-10T00:00:00Z',
//     amount: 757.13,
//     status: 'late',
//     lateFee: 75.71,
//   },
// ];

// // Add payments to loans
// mockLoans.forEach(loan => {
//   loan.payments = mockPayments.filter(payment => payment.loanId === loan.id);
// });

// // Intercept API requests and provide mock responses
// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (!error.response) {
//       // Simulate API responses
//       const { url, method, data: requestData } = error.config;
//       let mockResponse = null;

//       // Handle registration
//       if (url === '/api/auth/register' && method === 'post') {
//         const userData = JSON.parse(requestData);
        
//         // Create a new user
//         const newUser = {
//           id: (mockUsers.length + 1).toString(),
//           name: userData.name,
//           email: userData.email,
//           role: userData.role || 'client',
//           createdAt: new Date().toISOString(),
//           token: `mock-jwt-token-${userData.role || 'client'}-${Date.now()}`,
//         };
        
//         // Check if email is already in use
//         const existingUser = mockUsers.find(u => u.email === userData.email);
//         if (existingUser) {
//           mockResponse = {
//             data: {
//               success: false,
//               error: 'Este email já está em uso',
//             },
//           };
//         } else {
//           // Add the new user
//           mockUsers.push(newUser);
          
//           // If it's a client, also create a client record
//           if (newUser.role === 'client') {
//             const newClient = {
//               id: (mockClients.length + 1).toString(),
//               name: userData.name,
//               cpf: '',
//               email: userData.email,
//               phone: '',
//               address: {
//                 street: '',
//                 number: '',
//                 district: '',
//                 city: '',
//                 state: '',
//                 zipCode: '',
//               },
//               financialData: {
//                 income: 0,
//                 profession: '',
//               },
//               createdAt: new Date().toISOString(),
//               userId: newUser.id,
//             };
//             mockClients.push(newClient);
//           }
          
//           mockResponse = {
//             data: {
//               success: true,
//               data: newUser,
//             },
//           };
//         }
//       }
      
//       else if (url === '/api/auth/login' && method === 'post') {
//         const credentials = JSON.parse(requestData) as LoginCredentials;
//         const user = mockUsers.find(u => u.email === credentials.email);
        
//         if (user && credentials.senha === 'password') { // Simple mock authentication
//           mockResponse = {
//             data: {
//               success: true,
//               data: user,
//             } as ApiResponse<User>,
//           };
//         } else {
//           mockResponse = {
//             data: {
//               success: false,
//               error: 'Invalid credentials',
//             } as ApiResponse<User>,
//           };
//         }
//       }
      
//       else if (url === '/api/auth/me' && method === 'get') {
//         const token = error.config.headers.Authorization?.split('Bearer ')[1];
//         const user = mockUsers.find(u => u.token === token);
        
//         if (user) {
//           const { token: _, ...userData } = user;
//           mockResponse = {
//             data: {
//               success: true,
//               data: userData,
//             } as ApiResponse<User>,
//           };
//         } else {
//           mockResponse = {
//             data: {
//               success: false,
//               error: 'Invalid token',
//             } as ApiResponse<User>,
//           };
//         }
//       }
      
//       else if (url === '/api/clients' && method === 'get') {
//         mockResponse = {
//           data: {
//             success: true,
//             data: mockClients,
//           } as ApiResponse<Client[]>,
//         };
//       }
      
//       else if (url.match(/\/api\/clients\/\d+/) && method === 'get') {
//         const clientId = url.split('/').pop();
//         const client = mockClients.find(c => c.id === clientId);
        
//         if (client) {
//           mockResponse = {
//             data: {
//               success: true,
//               data: client,
//             } as ApiResponse<Client>,
//           };
//         } else {
//           mockResponse = {
//             data: {
//               success: false,
//               error: 'Client not found',
//             } as ApiResponse<Client>,
//           };
//         }
//       }
      
//       else if (url === '/api/clients' && method === 'post') {
//         const newClient = JSON.parse(requestData) as Client;
//         newClient.id = (mockClients.length + 1).toString();
//         newClient.createdAt = new Date().toISOString();
//         mockClients.push(newClient);
        
//         mockResponse = {
//           data: {
//             success: true,
//             data: newClient,
//           } as ApiResponse<Client>,
//         };
//       }
      
//       else if (url.match(/\/api\/clients\/\d+/) && method === 'put') {
//         const clientId = url.split('/').pop();
//         const clientIndex = mockClients.findIndex(c => c.id === clientId);
        
//         if (clientIndex !== -1) {
//           const updatedClient = { ...mockClients[clientIndex], ...JSON.parse(requestData) };
//           mockClients[clientIndex] = updatedClient;
          
//           mockResponse = {
//             data: {
//               success: true,
//               data: updatedClient,
//             } as ApiResponse<Client>,
//           };
//         } else {
//           mockResponse = {
//             data: {
//               success: false,
//               error: 'Client not found',
//             } as ApiResponse<Client>,
//           };
//         }
//       }
      
//       else if (url === '/api/loans' && method === 'get') {
//         mockResponse = {
//           data: {
//             success: true,
//             data: mockLoans,
//           } as ApiResponse<Loan[]>,
//         };
//       }
      
//       else if (url.match(/\/api\/loans\/\d+/) && method === 'get') {
//         const loanId = url.split('/').pop();
//         const loan = mockLoans.find(l => l.id === loanId);
        
//         if (loan) {
//           mockResponse = {
//             data: {
//               success: true,
//               data: loan,
//             } as ApiResponse<Loan>,
//           };
//         } else {
//           mockResponse = {
//             data: {
//               success: false,
//               error: 'Loan not found',
//             } as ApiResponse<Loan>,
//           };
//         }
//       }
      
//       else if (url.match(/\/api\/clients\/\d+\/loans/) && method === 'get') {
//         const clientId = url.split('/')[3];
//         const clientLoans = mockLoans.filter(l => l.clientId === clientId);
        
//         mockResponse = {
//           data: {
//             success: true,
//             data: clientLoans,
//           } as ApiResponse<Loan[]>,
//         };
//       }
      
//       else if (url === '/api/loans/simulate' && method === 'post') {
//         const { amount, interestRate, term } = JSON.parse(requestData);
//         const monthlyRate = interestRate / 100;
//         const installmentAmount = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
//         const totalAmount = installmentAmount * term;
        
//         const payments = Array.from({ length: term }, (_, i) => {
//           const dueDate = new Date();
//           dueDate.setMonth(dueDate.getMonth() + i + 1);
          
//           return {
//             installmentNumber: i + 1,
//             dueDate: dueDate.toISOString(),
//             amount: parseFloat(installmentAmount.toFixed(2)),
//           };
//         });
        
//         const simulation: LoanSimulation = {
//           amount,
//           interestRate,
//           term,
//           installmentAmount: parseFloat(installmentAmount.toFixed(2)),
//           totalAmount: parseFloat(totalAmount.toFixed(2)),
//           payments,
//         };
        
//         mockResponse = {
//           data: {
//             success: true,
//             data: simulation,
//           } as ApiResponse<LoanSimulation>,
//         };
//       }
      
//       else if (url === '/api/loans' && method === 'post') {
//         const newLoan = JSON.parse(requestData) as Loan;
//         newLoan.id = (mockLoans.length + 1).toString();
//         newLoan.createdAt = new Date().toISOString();
        
//         // Create payments for the loan
//         const payments: Payment[] = [];
//         for (let i = 0; i < newLoan.term; i++) {
//           const dueDate = new Date(newLoan.startDate);
//           dueDate.setMonth(dueDate.getMonth() + i);
          
//           payments.push({
//             id: `${mockPayments.length + i + 1}`,
//             loanId: newLoan.id,
//             installmentNumber: i + 1,
//             dueDate: dueDate.toISOString(),
//             amount: newLoan.installmentAmount,
//             status: 'pending',
//           });
//         }
        
//         newLoan.payments = payments;
//         mockLoans.push(newLoan);
//         mockPayments.push(...payments);
        
//         mockResponse = {
//           data: {
//             success: true,
//             data: newLoan,
//           } as ApiResponse<Loan>,
//         };
//       }
      
//       else if (url.match(/\/api\/loans\/\d+\/payments/) && method === 'get') {
//         const loanId = url.split('/')[3];
//         const loanPayments = mockPayments.filter(p => p.loanId === loanId);
        
//         mockResponse = {
//           data: {
//             success: true,
//             data: loanPayments,
//           } as ApiResponse<Payment[]>,
//         };
//       }
      
//       else if (url.match(/\/api\/payments\/\d+/) && method === 'put') {
//         const paymentId = url.split('/').pop();
//         const paymentIndex = mockPayments.findIndex(p => p.id === paymentId);
        
//         if (paymentIndex !== -1) {
//           const updatedPayment = { ...mockPayments[paymentIndex], ...JSON.parse(requestData) };
//           mockPayments[paymentIndex] = updatedPayment;
          
//           // Update loan status if needed
//           const loanId = updatedPayment.loanId;
//           const loan = mockLoans.find(l => l.id === loanId);
//           if (loan) {
//             const allPayments = mockPayments.filter(p => p.loanId === loanId);
//             const allPaid = allPayments.every(p => p.status === 'paid');
//             const hasLate = allPayments.some(p => p.status === 'late');
            
//             if (allPaid) {
//               loan.status = 'paid';
//             } else if (hasLate) {
//               loan.status = 'late';
//             }
//           }
          
//           mockResponse = {
//             data: {
//               success: true,
//               data: updatedPayment,
//             } as ApiResponse<Payment>,
//           };
//         } else {
//           mockResponse = {
//             data: {
//               success: false,
//               error: 'Payment not found',
//             } as ApiResponse<Payment>,
//           };
//         }
//       }
      
//       else if (url === '/api/dashboard/stats' && method === 'get') {
//         const totalClients = mockClients.length;
//         const totalLoans = mockLoans.length;
//         const totalActiveLoans = mockLoans.filter(l => l.status === 'active').length;
//         const totalLateLoans = mockLoans.filter(l => l.status === 'late').length;
//         const totalLoanAmount = mockLoans.reduce((sum, loan) => sum + loan.amount, 0);
//         const totalPaidAmount = mockPayments
//           .filter(p => p.status === 'paid')
//           .reduce((sum, payment) => sum + payment.amount, 0);
        
//         const loansByStatus = [
//           { status: 'active', count: totalActiveLoans },
//           { status: 'paid', count: mockLoans.filter(l => l.status === 'paid').length },
//           { status: 'late', count: totalLateLoans },
//         ] as { status: LoanStatus, count: number }[];
        
//         const loansByMonth = Array.from({ length: 6 }, (_, i) => {
//           const date = new Date();
//           date.setMonth(date.getMonth() - i);
//           const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
          
//           const amount = mockLoans
//             .filter(loan => {
//               const loanDate = new Date(loan.createdAt);
//               return loanDate.getMonth() === date.getMonth() && loanDate.getFullYear() === date.getFullYear();
//             })
//             .reduce((sum, loan) => sum + loan.amount, 0);
          
//           return { month, amount };
//         }).reverse();
        
//         const stats: DashboardStats = {
//           totalClients,
//           totalLoans,
//           totalActiveLoans,
//           totalLateLoans,
//           totalLoanAmount,
//           totalPaidAmount,
//           loansByStatus,
//           loansByMonth,
//         };
        
//         mockResponse = {
//           data: {
//             success: true,
//             data: stats,
//           } as ApiResponse<DashboardStats>,
//         };
//       }

//       // If we have prepared a mock response, return it
//       if (mockResponse) {
//         return Promise.resolve(mockResponse);
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

export default api;
