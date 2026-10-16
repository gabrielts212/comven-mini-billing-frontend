import type { ExtratoOverview } from "../types/Extrato";
import type { Operacao } from "../types/Operacao";
import { decimalFromApi } from "../types/decimal";
import { requestJson } from "./api";

interface RawOperacao {
  operationId: string;
  createdAt: string;
  description: string;
  provider: string;
  kind: number;
  status: number;
  amount: unknown;
  balanceAfter: unknown;
}

interface RawExtratoOverview {
  customerExternalId: string;
  customerName: string;
  accountType: number;
  availableBalance: unknown;
  outstandingInvoiceAmount: unknown;
  items: RawOperacao[];
}

function mapOperacao(raw: RawOperacao): Operacao {
  return {
    ...raw,
    amount: decimalFromApi(raw.amount),
    balanceAfter: decimalFromApi(raw.balanceAfter),
  };
}

function mapExtrato(raw: RawExtratoOverview): ExtratoOverview {
  return {
    customerExternalId: raw.customerExternalId,
    customerName: raw.customerName,
    accountType: raw.accountType,
    availableBalance: decimalFromApi(raw.availableBalance),
    outstandingInvoiceAmount: decimalFromApi(raw.outstandingInvoiceAmount),
    items: raw.items.map(mapOperacao),
  };
}

export async function buscarExtrato(params: {
  customerExternalId: string;
  from?: string;
  to?: string;
}): Promise<ExtratoOverview> {
  const search = new URLSearchParams({
    customerExternalId: params.customerExternalId,
  });

  if (params.from) {
    search.set("from", params.from);
  }

  if (params.to) {
    search.set("to", params.to);
  }

  const raw = await requestJson<RawExtratoOverview>(
    `/api/statement?${search.toString()}`,
  );
  return mapExtrato(raw);
}
