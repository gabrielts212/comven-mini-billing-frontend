import { useEffect, useState } from "react";
import { criarOperacao } from "../services/operacoesService";
import type { CriarOperacaoPayload } from "../types/Operacao";
import { normalizeDecimalInput } from "../types/decimal";

interface NovaOperacaoModalProps {
  open: boolean;
  customerExternalId: string;
  onClose: () => void;
  onSuccess: (message: string) => Promise<void> | void;
}

function randomIdempotencyKey() {
  return `idem-${crypto.randomUUID()}`;
}

export function NovaOperacaoModal({
  open,
  customerExternalId,
  onClose,
  onSuccess,
}: NovaOperacaoModalProps) {
  const [amount, setAmount] = useState("75,00");
  const [description, setDescription] = useState("Pagamento instantaneo");
  const [kind, setKind] = useState("1");
  const [idempotencyKey, setIdempotencyKey] = useState(randomIdempotencyKey);
  const [simulateProviderFailure, setSimulateProviderFailure] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setError(null);
    setSubmitting(false);
  }, [open, customerExternalId]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      const payload: CriarOperacaoPayload = {
        customerExternalId,
        amount: normalizeDecimalInput(amount),
        description,
        kind: Number(kind),
        idempotencyKey,
        simulateProviderFailure,
      };

      const response = await criarOperacao(payload);
      await onSuccess(response.message);

      if (!response.idempotentReplay) {
        setIdempotencyKey(randomIdempotencyKey());
      }

      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Nao foi possivel criar a operacao.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div aria-modal="true" className="modal-panel" role="dialog">
        <div className="modal-header">
          <div>
            <h3>Nova operacao</h3>
            <p className="muted">
              Crie uma operacao com chave de idempotencia e retorno de erro
              claro.
            </p>
          </div>

          <button
            aria-label="Fechar modal"
            className="icon-button"
            onClick={onClose}
            type="button"
          >
            x
          </button>
        </div>

        <div className="panel-body">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="amount">Valor</label>
                <input
                  id="amount"
                  inputMode="decimal"
                  placeholder="75,00"
                  type="text"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="kind">Tipo</label>
                <select
                  id="kind"
                  value={kind}
                  onChange={(event) => setKind(event.target.value)}
                >
                  <option value="1">Autorizacao</option>
                  <option value="2">Estorno</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="idempotencyKey">Chave de idempotencia</label>
                <input
                  id="idempotencyKey"
                  type="text"
                  value={idempotencyKey}
                  onChange={(event) => setIdempotencyKey(event.target.value)}
                />
              </div>
            </div>

            <div className="field" style={{ marginTop: "14px" }}>
              <label htmlFor="description">Descricao</label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <label className="checkbox">
              <input
                checked={simulateProviderFailure}
                type="checkbox"
                onChange={(event) =>
                  setSimulateProviderFailure(event.target.checked)
                }
              />
              Simular timeout em todos os fornecedores e validar estorno unico.
            </label>

            <div className="actions">
              <button
                className="button button-primary"
                disabled={submitting}
                type="submit"
              >
                {submitting ? "Enviando..." : "Criar operacao"}
              </button>
              <button
                className="button button-secondary"
                onClick={onClose}
                type="button"
              >
                Cancelar
              </button>
            </div>

            {error ? <div className="alert alert-error">{error}</div> : null}
          </form>
        </div>
      </div>
    </div>
  );
}
