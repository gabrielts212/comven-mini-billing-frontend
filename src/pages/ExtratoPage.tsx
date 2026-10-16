import { useMemo, useState } from 'react'
import { FiltroPeriodo } from '../components/FiltroPeriodo'
import { NovaOperacaoModal } from '../components/NovaOperacaoModal'
import { SummaryCard } from '../components/SummaryCard'
import { TabelaOperacoes } from '../components/TabelaOperacoes'
import { useExtrato } from '../hooks/useExtrato'
import { accountTypeLabel } from '../types/Extrato'
import { formatDecimalCurrency } from '../types/decimal'

export function ExtratoPage() {
  const [customerExternalId, setCustomerExternalId] = useState('cli-pre-001')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [flashMessage, setFlashMessage] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data, error, loading, reload } = useExtrato(customerExternalId, from, to)

  const accountLabel = useMemo(() => {
    if (!data) {
      return 'Carregando'
    }

    return accountTypeLabel[data.accountType] ?? 'Desconhecido'
  }, [data])

  async function handleOperationSuccess(message: string) {
    setFlashMessage(message)
    await reload()
  }

  return (
    <>
      <main className="shell">
        <section className="hero">
          <div className="hero-grid">
            <div>
              <span className="eyebrow">Comven Challenge</span>
              <h1>Extrato e nova operacao com mais consistencia.</h1>
              <p>
                Consulte historico, filtre por periodo e registre novas operacoes em um fluxo
                unico, com mensagens claras retornadas pela API.
              </p>
            </div>

            <aside className="hero-aside">
              <div className="hero-chip">
                <strong>Dinheiro tratado como decimal textual</strong>
                <span className="muted">A interface evita manter valores monetarios em number para preservar precisao.</span>
              </div>
              <div className="hero-chip">
                <strong>Fluxos PRE e POS</strong>
                <span className="muted">Alterne o cliente para validar saldo imediato ou faturamento posterior.</span>
              </div>
            </aside>
          </div>

          <div className="summary-grid">
            <SummaryCard
              title="Cliente"
              value={data?.customerName ?? 'Carregando...'}
              hint={data?.customerExternalId ?? 'Aguardando API'}
            />
            <SummaryCard
              title="Saldo disponivel"
              value={formatDecimalCurrency(data?.availableBalance ?? '0.00')}
              hint={`Modelo: ${accountLabel}`}
            />
            <SummaryCard
              title="A faturar"
              value={formatDecimalCurrency(data?.outstandingInvoiceAmount ?? '0.00')}
              hint="Uso pos-pago ainda nao fechado"
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
                    <p className="muted">Acompanhe movimentacoes e veja quem atendeu cada operacao.</p>
                  </div>

                  <button className="button button-primary" onClick={() => setIsModalOpen(true)} type="button">
                    Nova operacao
                  </button>
                </div>

                <FiltroPeriodo
                  customerExternalId={customerExternalId}
                  from={from}
                  to={to}
                  onCustomerChange={setCustomerExternalId}
                  onFromChange={setFrom}
                  onRefresh={() => void reload()}
                  onToChange={setTo}
                />

                {flashMessage ? <div className="alert alert-success">{flashMessage}</div> : null}
                {error ? <div className="alert alert-error">{error}</div> : null}
                {loading && !data ? <div className="alert alert-info">Carregando extrato...</div> : null}
                {data ? <TabelaOperacoes items={data.items} /> : null}
              </div>
            </article>
          </section>

          <aside className="stack">
            <article className="panel">
              <div className="panel-body sidebar-copy">
                <h3>Leitura rapida</h3>
                <div className="summary-strip">
                  <div className="summary-pill">
                    <span>Tipo de conta</span>
                    <strong>{accountLabel}</strong>
                  </div>
                  <div className="summary-pill">
                    <span>Periodo</span>
                    <strong>{from || 'Inicio'} a {to || 'Hoje'}</strong>
                  </div>
                  <div className="summary-pill">
                    <span>Operacoes</span>
                    <strong>{data?.items.length ?? 0}</strong>
                  </div>
                </div>
                <p className="muted">Erros estruturados da API sao convertidos para mensagens legiveis antes de chegar na tela.</p>
                <p className="muted">A chave de idempotencia fica visivel no modal para reproduzir cenarios de timeout e clique duplo.</p>
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
  )
}