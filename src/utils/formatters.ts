
/**
 * Formata um valor para moeda brasileira (Real)
 * @param value O valor a ser formatado
 * @returns String formatada (ex: R$ 1.000,00)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formata um valor percentual
 * @param value O valor a ser formatado
 * @returns String formatada (ex: 10,5%)
 */
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

/**
 * Formata um número com separador de milhares
 * @param value O valor a ser formatado
 * @returns String formatada (ex: 1.000)
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

/**
 * Calcular dias de atraso entre duas datas
 * @param dueDate Data de vencimento
 * @param paidDate Data de pagamento (opcional, usa a data atual se não informado)
 * @returns Número de dias de atraso (0 se não há atraso)
 */
export const calculateLateDays = (dueDate: string | Date, paidDate?: string | Date): number => {
  const due = new Date(dueDate);
  const paid = paidDate ? new Date(paidDate) : new Date();
  
  // Reset hours to compare just dates
  due.setHours(0, 0, 0, 0);
  paid.setHours(0, 0, 0, 0);
  
  const diffTime = paid.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

/**
 * Calcular multa por atraso
 * @param amount Valor original
 * @param days Dias de atraso
 * @param rate Taxa de multa diária (em percentual)
 * @returns Valor da multa
 */
export const calculateLateFee = (amount: number, days: number, rate: number = 0.33): number => {
  if (days <= 0) return 0;
  return amount * (days * (rate / 100));
};
