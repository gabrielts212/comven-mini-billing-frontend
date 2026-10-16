import { invoiceStatusLabel, type InvoiceSummary } from "../types/Fatura";
import { formatDecimalCurrency } from "../types/decimal";

interface TabelaFaturasProps {
  items: InvoiceSummary[];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(value));
}

function statusClass(status: InvoiceSummary["status"]) {
  switch (status) {
    case "closed":
      return "badge-succeeded";
    case "failed":
    case "reversed":
      return "badge-failed";
    case "open":
      return "badge-open";
    default:
      return "badge-pending";
  }
}

export function TabelaFaturas({ items }: TabelaFaturasProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        Nenhuma fatura encontrada para o cliente e período informados.
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="statement-table">
        <thead>
          <tr>
            <th>Período</th>
            <th>Gerada em</th>
            <th>Valor total</th>
            <th>Operações faturadas</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.invoiceId}>
              <td>
                {formatDate(item.periodStart)} a {formatDate(item.periodEnd)}
              </td>
              <td>{formatDate(item.generatedAt)}</td>
              <td>{formatDecimalCurrency(item.totalAmount)}</td>
              <td>{item.operationCount}</td>
              <td>
                <span className={`inline-badge ${statusClass(item.status)}`}>
                  {invoiceStatusLabel[item.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
