import type {
  CriarOperacaoPayload,
  CriarOperacaoResponse,
} from "../types/Operacao";
import { decimalFromApi, toRawJsonDecimal } from "../types/decimal";
import { requestJson } from "./api";

interface RawCriarOperacaoResponse {
  operationId: string;
  status: number;
  provider: string;
  availableBalance: unknown;
  idempotentReplay: boolean;
  message: string;
}

export async function criarOperacao(
  payload: CriarOperacaoPayload,
): Promise<CriarOperacaoResponse> {
  const requestBody = JSON.stringify({
    ...payload,
    amount: "__DECIMAL__",
  }).replace('"__DECIMAL__"', toRawJsonDecimal(payload.amount));

  const raw = await requestJson<RawCriarOperacaoResponse>("/api/operations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  });

  return {
    ...raw,
    availableBalance: decimalFromApi(raw.availableBalance),
  };
}
