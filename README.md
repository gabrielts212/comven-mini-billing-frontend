# Comven Mini Billing Frontend

Frontend inicial do desafio da Comven usando React + TypeScript + Vite.

## Por que React

O enunciado cita Angular ou Vue como opcoes preferenciais, mas permite a tecnologia de maior familiaridade desde que isso seja explicado.
Aqui a escolha por React reduz tempo de setup e permite concentrar o esforco nos pontos criticos do teste: idempotencia, saldo, estorno e faturamento.

## Estrutura atual

- src/pages/ExtratoPage.tsx: pagina principal do extrato
- src/components/TabelaOperacoes.tsx: tabela reutilizavel de movimentacoes
- src/components/FiltroPeriodo.tsx: filtros de cliente e periodo
- src/components/NovaOperacaoModal.tsx: criacao de operacao com idempotencia visivel
- src/services/api.ts: cliente HTTP e tratamento de erro da API
- src/services/extratoService.ts: consulta de extrato
- src/services/operacoesService.ts: criacao de operacoes
- src/hooks/useExtrato.ts: carregamento do extrato
- src/types/Operacao.ts: tipos de operacao
- src/types/Extrato.ts: tipos de extrato e cliente
- src/types/decimal.ts: representacao textual de dinheiro

## Como rodar

```bash
npm install
npm run dev
```

## Variaveis uteis

- VITE_API_PROXY_TARGET: sobrescreve o destino do proxy do Vite durante o desenvolvimento

Consulte tambem o arquivo [.env.example](.env.example).

## Build

```bash
npm run build
```
