import { useCallback, useEffect, useState } from "react";
import { buscarExtrato } from "../services/extratoService";
import type { ExtratoOverview } from "../types/Extrato";

export function useExtrato(
  customerExternalId: string,
  from: string,
  to: string,
) {
  const [data, setData] = useState<ExtratoOverview | null>(null);
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
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Nao foi possivel carregar o extrato.",
      );
    } finally {
      setLoading(false);
    }
  }, [customerExternalId, from, to]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, error, loading, reload: load };
}
