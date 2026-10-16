export type DecimalValue = string;

export function normalizeDecimalInput(input: string): DecimalValue {
  const trimmed = input.trim().replace(/\s+/g, "").replace(",", ".");

  if (!/^[-]?\d+(\.\d{0,2})?$/.test(trimmed)) {
    throw new Error(
      "Informe um valor monetario valido com ate duas casas decimais.",
    );
  }

  const negative = trimmed.startsWith("-");
  const unsigned = negative ? trimmed.slice(1) : trimmed;
  const [rawWhole, rawFraction = ""] = unsigned.split(".");
  const whole = rawWhole.replace(/^0+(?=\d)/, "") || "0";
  const fraction = (rawFraction + "00").slice(0, 2);

  return `${negative ? "-" : ""}${whole}.${fraction}`;
}

export function decimalFromApi(value: unknown): DecimalValue {
  if (typeof value === "string") {
    return normalizeDecimalInput(value);
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return normalizeDecimalInput(String(value));
  }

  throw new Error("A API retornou um valor monetario invalido.");
}

export function formatDecimalCurrency(value: DecimalValue): string {
  const normalized = normalizeDecimalInput(value);
  const negative = normalized.startsWith("-");
  const unsigned = negative ? normalized.slice(1) : normalized;
  const [wholePart, fractionPart = "00"] = unsigned.split(".");
  const reversed = wholePart.split("").reverse().join("");
  const grouped =
    reversed
      .match(/.{1,3}/g)
      ?.join(".")
      .split("")
      .reverse()
      .join("") ?? wholePart;

  return `${negative ? "-" : ""}R$ ${grouped},${fractionPart}`;
}

export function isNegativeDecimal(value: DecimalValue): boolean {
  const normalized = normalizeDecimalInput(value);
  return normalized.startsWith("-") && normalized !== "-0.00";
}

export function toRawJsonDecimal(value: DecimalValue): string {
  return normalizeDecimalInput(value);
}
