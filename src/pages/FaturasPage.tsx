import { useMemo, useState } from "react";
import { FiltroPeriodo } from "../components/FiltroPeriodo";
import { ScreenTabs } from "../components/ScreenTabs";
import { SummaryCard } from "../components/SummaryCard";
import { TabelaFaturas } from "../components/TabelaFaturas";
import { useFaturas } from "../hooks/useFaturas";
import { accountTypeLabel } from "../types/Extrato";
import { formatDecimalCurrency, sumDecimalValues } from "../types/decimal";

interface FaturasPageProps {
  activeScreen: "extrato" | "faturas";
  customerExternalId: string;
  onCustomerChange: (value: string) => void;
  onScreenChange: (screen: "extrato" | "faturas") => void;
}

export function FaturasPage({
  activeScreen,
  customerExternalId,
  onCustomerChange,
  onScreenChange,
}: FaturasPageProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const { data, invoices, error, loading, reload } = useFaturas(
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

  const totalBilled = useMemo(
    () => sumDecimalValues(invoices.map((invoice) => invoice.totalAmount)),
    [invoices],
  );

  const openInvoices = invoices.filter(
    (invoice) => invoice.status === "open",
  ).length;
  const isPostPaid = data?.accountType === 2;

  return (
    <main className="shell">
      <ScreenTabs activeScreen={activeScreen} onScreenChange={onScreenChange} />

      <section className="hero">
        <div className="hero-grid">
          <div>
            <span className="eyebrow">Comven Challenge</span>
            <h1>Faturas consolidadas para clientes pós-pagos.</h1>
            <p>
              Consulte os fechamentos gerados, acompanhe o valor faturado por
              período e veja quantas operações entraram em cada ciclo.
            </p>
          </div>

          <aside className="hero-aside">
            <div className="hero-chip">
              <strong>Fechamento por período</strong>
              <span className="muted">
                Cada fatura exibe data de geração, quantidade de operações e
                status do ciclo.
              </span>
            </div>
            <div className="hero-chip">
              <strong>Leitura do que já existe</strong>
              <span className="muted">
                O resumo de faturas é derivado do extrato, incluindo fechamentos
                e saldo ainda em aberto.
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
            title="Modelo"
            value={accountLabel}
            hint="Somente clientes pós-pagos geram faturas"
          />
          <SummaryCard
            title="Total no período"
            value={formatDecimalCurrency(totalBilled)}
            hint={`${invoices.length} fatura(s) encontrada(s)`}
          />
          <SummaryCard
            title="Em aberto"
            value={String(openInvoices)}
            hint={formatDecimalCurrency(
              data?.outstandingInvoiceAmount ?? "0.00",
            )}
          />
        </div>
      </section>

      <div className="layout">
        <section className="stack">
          <article className="panel">
            <div className="panel-body">
              <div className="toolbar">
                <div>
                  <h2>Faturas do cliente</h2>
                  <p className="muted">
                    Veja o histórico de faturamento e os ciclos ainda não
                    fechados.
                  </p>
                </div>
              </div>

              <FiltroPeriodo
                customerExternalId={customerExternalId}
                from={from}
                to={to}
                onCustomerChange={onCustomerChange}
                onFromChange={setFrom}
                onRefresh={() => void reload()}
                onToChange={setTo}
                refreshLabel="Atualizar faturas"
              />

              {error ? <div className="alert alert-error">{error}</div> : null}
              {loading && !data ? (
                <div className="alert alert-info">Carregando faturas...</div>
              ) : null}
              {data && !isPostPaid ? (
                <div className="empty-state">
                  Este cliente é pré-pago. Troque para um cliente pós-pago para
                  consultar faturas.
                </div>
              ) : null}
              {data && isPostPaid ? <TabelaFaturas items={invoices} /> : null}
            </div>
          </article>
        </section>

        <aside className="stack">
          <article className="panel">
            <div className="panel-body sidebar-copy">
              <h3>Como a tela funciona</h3>
              <div className="summary-strip">
                <div className="summary-pill">
                  <span>Status</span>
                  <strong>Abertas e fechadas</strong>
                </div>
                <div className="summary-pill">
                  <span>Período</span>
                  <strong>
                    {from || "Inicio"} a {to || "Hoje"}
                  </strong>
                </div>
                <div className="summary-pill">
                  <span>Operações</span>
                  <strong>
                    {invoices.reduce(
                      (accumulator, invoice) =>
                        accumulator + invoice.operationCount,
                      0,
                    )}
                  </strong>
                </div>
              </div>
              <p className="muted">
                Faturas fechadas usam os eventos de fechamento da conta. Quando
                ainda existe valor pendente, a interface mostra um ciclo em
                aberto separado.
              </p>
            </div>
          </article>
        </aside>
      </div>
    </main>
  );
}
