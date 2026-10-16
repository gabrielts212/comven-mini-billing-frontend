import type { ExtratoOverview } from "../types/Extrato";
import type { InvoiceStatus, InvoiceSummary } from "../types/Fatura";
import { decimalToCents } from "../types/decimal";

function toInvoiceStatus(status: number): InvoiceStatus {
  switch (status) {
    case 2:
      return "closed";
    case 3:
      return "failed";
    case 4:
      return "reversed";
    default:
      return "processing";
  }
}

function isBillableOperation(kind: number, status: number) {
  return kind !== 3 && status === 2;
}

export function buildInvoiceSummaries(
  overview: ExtratoOverview,
  nowIso: string = new Date().toISOString(),
): InvoiceSummary[] {
  if (overview.accountType !== 2) {
    return [];
  }

  const orderedItems = [...overview.items].sort(
    (left, right) =>
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  );

  const invoices: InvoiceSummary[] = [];
  let currentBatch = orderedItems.filter((item) => isBillableOperation(item.kind, item.status));

  for (const item of orderedItems) {
    if (item.kind !== 3) {
      continue;
    }

    const billedOperations = currentBatch.filter(
      (operation) => new Date(operation.createdAt).getTime() <= new Date(item.createdAt).getTime(),
    );

    invoices.push({
      invoiceId: item.operationId,
      customerExternalId: overview.customerExternalId,
      customerName: overview.customerName,
      accountType: overview.accountType,
      periodStart: billedOperations[0]?.createdAt ?? item.createdAt,
      periodEnd: item.createdAt,
      generatedAt: item.createdAt,
      totalAmount: item.amount,
      operationCount: billedOperations.length,
      status: toInvoiceStatus(item.status),
    });

    currentBatch = currentBatch.filter(
      (operation) => new Date(operation.createdAt).getTime() > new Date(item.createdAt).getTime(),
    );
  }

  if (
    currentBatch.length > 0 ||
    decimalToCents(overview.outstandingInvoiceAmount) > 0
  ) {
    invoices.push({
      invoiceId: `open-${overview.customerExternalId}`,
      customerExternalId: overview.customerExternalId,
      customerName: overview.customerName,
      accountType: overview.accountType,
      periodStart: currentBatch[0]?.createdAt ?? orderedItems[0]?.createdAt ?? nowIso,
      periodEnd: nowIso,
      generatedAt: nowIso,
      totalAmount: overview.outstandingInvoiceAmount,
      operationCount: currentBatch.length,
      status: "open",
    });
  }

  return invoices.sort(
    (left, right) =>
      new Date(right.generatedAt).getTime() - new Date(left.generatedAt).getTime(),
  );
}
