export type DecimalValue = string;

export function normalizeDecimalInput(input: string): DecimalValue {
  const trimmed = input.trim().replace(/\s+/g, "").replace(",", ".");

  if (!/^[-]?\d+(\.\d{0,2})?$/.test(trimmed)) {
    throw new Error(
      "Informe um valor monetário válido com até duas casas decimais.",
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

  throw new Error("A API retornou um valor monetário inválido.");
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

export function decimalToCents(value: DecimalValue): number {
  const normalized = normalizeDecimalInput(value);
  const negative = normalized.startsWith("-");
  const unsigned = negative ? normalized.slice(1) : normalized;
  const [wholePart, fractionPart = "00"] = unsigned.split(".");
  const cents =
    Number.parseInt(wholePart, 10) * 100 + Number.parseInt(fractionPart, 10);

  return negative ? -cents : cents;
}

export function centsToDecimal(value: number): DecimalValue {
  if (!Number.isInteger(value)) {
    throw new Error("O valor em centavos precisa ser um inteiro.");
  }

  const negative = value < 0;
  const absolute = Math.abs(value);
  const wholePart = Math.floor(absolute / 100);
  const fractionPart = String(absolute % 100).padStart(2, "0");

  return `${negative ? "-" : ""}${wholePart}.${fractionPart}`;
}

export function sumDecimalValues(values: DecimalValue[]): DecimalValue {
  const total = values.reduce(
    (accumulator, value) => accumulator + decimalToCents(value),
    0,
  );
  return centsToDecimal(total);
}

export function toRawJsonDecimal(value: DecimalValue): string {
  return normalizeDecimalInput(value);
}
