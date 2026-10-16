## Primeiro passo npm i e depois npm run dev ✔

Frontend do desafio da Comven construído com React, TypeScript e Vite.

Este projeto foi pensado para demonstrar de forma direta os fluxos mais importantes do mini billing:

- consulta de extrato com filtro por cliente e período
- criação de nova operação com chave de idempotência visível
- simulação de falha de provedor para validar replay e estorno único
- visualização de saldo disponível e valor ainda a faturar
- consolidação de faturas para clientes pós-pagos

## 1. Introdução 📘

O enunciado cita Angular ou Vue como opções preferenciais, mas permite a tecnologia de maior familiaridade desde que isso seja explicado.

Aqui a escolha por React reduz o tempo de setup e mantém o foco nos pontos mais sensíveis do desafio: idempotência, saldo, estorno e faturamento.

## 2. Tecnologias Utilizadas 🖥

As principais tecnologias utilizadas no projeto:

- React 18
- TypeScript 5
- Vite 5
- Fetch API nativa para integração com o backend
- Variáveis de ambiente para configuração entre desenvolvimento e produção

## 3. Estrutura do Projeto 🧩

### Telas principais

- src/pages/ExtratoPage.tsx: tela principal com resumo da conta, filtros, tabela de operações e entrada para nova operação
- src/pages/FaturasPage.tsx: tela de faturas consolidadas para clientes pós-pagos

### Componentes principais

- src/components/FiltroPeriodo.tsx: seletor de cliente e período com ação de recarga
- src/components/NovaOperacaoModal.tsx: formulário de criação de operação com idempotência e simulação de timeout
- src/components/ScreenTabs.tsx: alternância entre extrato e faturas
- src/components/SummaryCard.tsx: cartões de resumo no topo das telas
- src/components/TabelaOperacoes.tsx: listagem de movimentações do extrato
- src/components/TabelaFaturas.tsx: listagem de faturas abertas e fechadas

### Hooks, serviços e tipos

- src/hooks/useExtrato.ts: carregamento e recarga do extrato
- src/hooks/useFaturas.ts: consolidação de faturas a partir do extrato
- src/services/api.ts: cliente HTTP, resolução de base URL e tratamento de erros da API
- src/services/extratoService.ts: consulta de extrato
- src/services/operacoesService.ts: criação de operações
- src/services/faturasService.ts: montagem da visão de faturamento
- src/types/Extrato.ts: tipos do extrato, labels de conta e clientes de exemplo
- src/types/Operacao.ts: payloads e contratos de operação
- src/types/Fatura.ts: tipos de status e resumo de fatura
- src/types/decimal.ts: utilitários para valores monetários tratados como texto decimal

## 4. Endpoints / Integração com backend 🔌

Este frontend consome a API do backend da Comven por chamadas para rotas iniciadas em /api.

Configuração esperada:

- defina em .env ou no ambiente de deploy a variável VITE_API_URL com a URL base da API
- em desenvolvimento, o Vite também pode encaminhar chamadas /api usando VITE_API_PROXY_TARGET
- o frontend faz tratamento de erros estruturados para exibir mensagens mais legíveis na interface

Variáveis disponíveis no projeto:

- VITE_API_URL=https://comven-mini-billing-backend.onrender.com
- VITE_API_PROXY_TARGET=http://localhost:5086

Clientes de exemplo já disponíveis na interface:

- Ada Lovelace: cliente pré-pago
- Grace Hopper: cliente pós-pago

## 5. Como rodar o frontend (dev) 🚀

- Instale as dependências: npm i
- Se necessário, copie o arquivo de exemplo de ambiente: copy .env.example .env
- Inicie a aplicação: npm run dev
- O frontend será servido em http://localhost:5173

## 6. Scripts disponíveis ⚙

- npm run dev: inicia o servidor de desenvolvimento
- npm run build: executa o TypeScript em modo build e gera o bundle de produção
- npm run lint: faz checagem de tipos com tsc --noEmit
- npm run preview: serve o build localmente para validação

## 7. Observações 📝

- os valores monetários são mantidos como decimal textual para evitar perda de precisão em number
- a tela de faturas deriva os ciclos a partir do extrato e do valor ainda em aberto
- a interface não depende de roteamento; a navegação entre telas é feita por estado local
- o arquivo .env.example documenta os valores base usados no projeto

## 8. Build de produção 📦

- Gere o build com: npm run build
- Se quiser validar o build localmente: npm run preview
