export function formatToBRL(value: string): string {
  const numericString = Number(value).toFixed(2);
  // Substituir o ponto por vírgula
  const stringValue = numericString.replace(".", ",");

  // Garantir que a string tenha pelo menos um dígito antes da vírgula
  const parts = stringValue.split(",");
  let integerPart = parts[0];
  const decimalPart = parts[1];

  if (integerPart.length < 1) {
    integerPart = "0" + integerPart;
  }

  // Retornar no formato "R$ X,XX"
  const formatted = `R$ ${integerPart},${decimalPart}`;
  return formatted
}