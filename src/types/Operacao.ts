import type { DecimalValue } from "./decimal";

export interface Operacao {
  operationId: string;
  createdAt: string;
  description: string;
  provider: string;
  kind: number;
  status: number;
  amount: DecimalValue;
  balanceAfter: DecimalValue;
}

export interface CriarOperacaoPayload {
  customerExternalId: string;
  amount: DecimalValue;
  description: string;
  kind: number;
  idempotencyKey: string;
  simulateProviderFailure: boolean;
}

export interface CriarOperacaoResponse {
  operationId: string;
  status: number;
  provider: string;
  availableBalance: DecimalValue;
  idempotentReplay: boolean;
  message: string;
}

export const operationKindLabel: Record<number, string> = {
  1: "Autorização",
  2: "Estorno",
  3: "Fechamento de fatura",
};

export const operationStatusLabel: Record<number, string> = {
  1: "Pendente",
  2: "Concluída",
  3: "Falhou",
  4: "Estornada",
};
