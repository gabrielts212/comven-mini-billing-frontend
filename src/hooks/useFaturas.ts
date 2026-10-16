import { useCallback, useEffect, useState } from "react";
import { buscarExtrato } from "../services/extratoService";
import { buildInvoiceSummaries } from "../services/faturasService";
import type { InvoiceSummary } from "../types/Fatura";
import type { ExtratoOverview } from "../types/Extrato";

export function useFaturas(
  customerExternalId: string,
  from: string,
  to: string,
) {
  const [data, setData] = useState<ExtratoOverview | null>(null);
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await buscarExtrato({
        customerExternalId,
        from: from || undefined,
        to: to || undefined,
      });

      setData(response);
      setInvoices(buildInvoiceSummaries(response));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Não foi possível carregar as faturas.",
      );
    } finally {
      setLoading(false);
    }
  }, [customerExternalId, from, to]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, invoices, error, loading, reload: load };
}
