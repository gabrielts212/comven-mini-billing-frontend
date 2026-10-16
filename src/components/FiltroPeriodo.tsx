import { customerOptions } from "../types/Extrato";

interface FiltroPeriodoProps {
  customerExternalId: string;
  from: string;
  to: string;
  onCustomerChange: (value: string) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onRefresh: () => void;
}

export function FiltroPeriodo({
  customerExternalId,
  from,
  to,
  onCustomerChange,
  onFromChange,
  onToChange,
  onRefresh,
}: FiltroPeriodoProps) {
  return (
    <>
      <div className="filters">
        <div className="field">
          <label htmlFor="customer">Cliente</label>
          <select
            id="customer"
            value={customerExternalId}
            onChange={(event) => onCustomerChange(event.target.value)}
          >
            {customerOptions.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="from">De</label>
          <input
            id="from"
            type="date"
            value={from}
            onChange={(event) => onFromChange(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="to">Ate</label>
          <input
            id="to"
            type="date"
            value={to}
            onChange={(event) => onToChange(event.target.value)}
          />
        </div>
      </div>

      <div className="actions">
        <button
          className="button button-secondary"
          onClick={onRefresh}
          type="button"
        >
          Atualizar extrato
        </button>
      </div>
    </>
  );
}
