import {
  operationKindLabel,
  operationStatusLabel,
  type Operacao,
} from "../types/Operacao";
import { formatDecimalCurrency, isNegativeDecimal } from "../types/decimal";

interface TabelaOperacoesProps {
  items: Operacao[];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusClass(status: number) {
  switch (status) {
    case 2:
      return "badge-succeeded";
    case 3:
    case 4:
      return "badge-failed";
    default:
      return "badge-pending";
  }
}

export function TabelaOperacoes({ items }: TabelaOperacoesProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        Nenhuma movimentacao encontrada para o periodo informado.
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="statement-table">
        <thead>
          <tr>
            <th>Data e hora</th>
            <th>Descricao</th>
            <th>Fornecedor</th>
            <th>Tipo</th>
            <th>Status</th>
            <th>Valor</th>
            <th>Saldo apos</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.operationId}>
              <td>{formatDate(item.createdAt)}</td>
              <td>{item.description}</td>
              <td>{item.provider}</td>
              <td>{operationKindLabel[item.kind] ?? "Desconhecido"}</td>
              <td>
                <span className={`inline-badge ${statusClass(item.status)}`}>
                  {operationStatusLabel[item.status] ?? "Desconhecido"}
                </span>
              </td>
              <td
                className={
                  isNegativeDecimal(item.amount)
                    ? "amount-negative"
                    : "amount-positive"
                }
              >
                {formatDecimalCurrency(item.amount)}
              </td>
              <td>{formatDecimalCurrency(item.balanceAfter)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
