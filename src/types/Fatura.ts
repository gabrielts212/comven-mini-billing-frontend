import type { DecimalValue } from "./decimal";

export type InvoiceStatus = "open" | "closed" | "processing" | "failed" | "reversed";

export interface InvoiceSummary {
  invoiceId: string;
  customerExternalId: string;
  customerName: string;
  accountType: number;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  totalAmount: DecimalValue;
  operationCount: number;
  status: InvoiceStatus;
}

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  open: "Em aberto",
  closed: "Fechada",
  processing: "Em processamento",
  failed: "Falhou",
  reversed: "Estornada",
};
