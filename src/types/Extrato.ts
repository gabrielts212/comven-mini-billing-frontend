import type { Operacao } from "./Operacao";
import type { DecimalValue } from "./decimal";

export interface ExtratoOverview {
  customerExternalId: string;
  customerName: string;
  accountType: number;
  availableBalance: DecimalValue;
  outstandingInvoiceAmount: DecimalValue;
  items: Operacao[];
}

export const accountTypeLabel: Record<number, string> = {
  1: "Pre-pago",
  2: "Pos-pago",
};

export const customerOptions = [
  { id: "cli-pre-001", label: "Ada Lovelace · pre-pago" },
  { id: "cli-post-001", label: "Grace Hopper · pos-pago" },
];
