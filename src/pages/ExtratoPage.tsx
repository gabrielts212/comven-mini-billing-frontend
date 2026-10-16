import { useMemo, useState } from "react";
import { FiltroPeriodo } from "../components/FiltroPeriodo";
import { NovaOperacaoModal } from "../components/NovaOperacaoModal";
import { ScreenTabs } from "../components/ScreenTabs";
import { SummaryCard } from "../components/SummaryCard";
import { TabelaOperacoes } from "../components/TabelaOperacoes";
import { useExtrato } from "../hooks/useExtrato";
import { accountTypeLabel } from "../types/Extrato";
import { formatDecimalCurrency } from "../types/decimal";

interface ExtratoPageProps {
  activeScreen: "extrato" | "faturas";
  customerExternalId: string;
  onCustomerChange: (value: string) => void;
  onScreenChange: (screen: "extrato" | "faturas") => void;
}

export function ExtratoPage({
  activeScreen,
  customerExternalId,
  onCustomerChange,
  onScreenChange,
}: ExtratoPageProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, error, loading, reload } = useExtrato(
    customerExternalId,
    from,
    to,
  );

  const accountLabel = useMemo(() => {
    if (!data) {
      return "Carregando";
    }

    return accountTypeLabel[data.accountType] ?? "Desconhecido";
  }, [data]);

  async function handleOperationSuccess(message: string) {
    setFlashMessage(message);
    await reload();
  }

  return (
    <>
      <main className="shell">
        <ScreenTabs
          activeScreen={activeScreen}
          onScreenChange={onScreenChange}
        />

        <section className="hero">
          <div className="hero-grid">
            <div>
              <span className="eyebrow">Comven Challenge</span>
              <h1>Extrato e nova operação com mais consistência.</h1>
              <p>
                Consulte histórico, filtre por período e registre novas
                operações em um fluxo único, com mensagens claras retornadas
                pela API.
              </p>
            </div>

            <aside className="hero-aside">
              <div className="hero-chip">
                <strong>Dinheiro tratado como decimal textual</strong>
                <span className="muted">
                  A interface evita manter valores monetários em number para
                  preservar precisão.
                </span>
              </div>
              <div className="hero-chip">
                <strong>Fluxos PRE e POS</strong>
                <span className="muted">
                  Alterne o cliente para validar saldo imediato ou faturamento
                  posterior.
                </span>
              </div>
            </aside>
          </div>

          <div className="summary-grid">
            <SummaryCard
              title="Cliente"
              value={data?.customerName ?? "Carregando..."}
              hint={data?.customerExternalId ?? "Aguardando API"}
            />
            <SummaryCard
              title="Saldo disponível"
              value={formatDecimalCurrency(data?.availableBalance ?? "0.00")}
              hint={`Modelo: ${accountLabel}`}
            />
            <SummaryCard
              title="A faturar"
              value={formatDecimalCurrency(
                data?.outstandingInvoiceAmount ?? "0.00",
              )}
              hint="Uso pós-pago ainda não fechado"
            />
          </div>
        </section>

        <div className="layout">
          <section className="stack">
            <article className="panel">
              <div className="panel-body">
                <div className="toolbar">
                  <div>
                    <h2>Extrato do cliente</h2>
                    <p className="muted">
                      Acompanhe movimentações e veja quem atendeu cada operação.
                    </p>
                  </div>

                  <button
                    className="button button-primary"
                    onClick={() => setIsModalOpen(true)}
                    type="button"
                  >
                    Nova operação
                  </button>
                </div>

                <FiltroPeriodo
                  customerExternalId={customerExternalId}
                  from={from}
                  to={to}
                  onCustomerChange={onCustomerChange}
                  onFromChange={setFrom}
                  onRefresh={() => void reload()}
                  onToChange={setTo}
                />

                {flashMessage ? (
                  <div className="alert alert-success">{flashMessage}</div>
                ) : null}
                {error ? (
                  <div className="alert alert-error">{error}</div>
                ) : null}
                {loading && !data ? (
                  <div className="alert alert-info">Carregando extrato...</div>
                ) : null}
                {data ? <TabelaOperacoes items={data.items} /> : null}
              </div>
            </article>
          </section>

          <aside className="stack">
            <article className="panel">
              <div className="panel-body sidebar-copy">
                <h3>Leitura rápida</h3>
                <div className="summary-strip">
                  <div className="summary-pill">
                    <span>Tipo de conta</span>
                    <strong>{accountLabel}</strong>
                  </div>
                  <div className="summary-pill">
                    <span>Período</span>
                    <strong>
                      {from || "Inicio"} a {to || "Hoje"}
                    </strong>
                  </div>
                  <div className="summary-pill">
                    <span>Operações</span>
                    <strong>{data?.items.length ?? 0}</strong>
                  </div>
                </div>
                <p className="muted">
                  Erros estruturados da API são convertidos para mensagens
                  legíveis antes de chegar na tela.
                </p>
                <p className="muted">
                  A chave de idempotência fica visível no modal para reproduzir
                  cenários de timeout e clique duplo.
                </p>
              </div>
            </article>
          </aside>
        </div>
      </main>

      <NovaOperacaoModal
        customerExternalId={customerExternalId}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleOperationSuccess}
      />
    </>
  );
}
