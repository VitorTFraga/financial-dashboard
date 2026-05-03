const exchangeRateApi =import.meta.env.AWESOME_API_URL;

export async function getDkkToBrlRate(): Promise<number> {
  const response = await fetch(exchangeRateApi);
  if (!response.ok) {
    throw new Error("Falha ao buscar taxa DKK/BRL.");
  }

  const data = (await response.json()) as { DKKBRL?: { bid?: string } };
  const rate = Number(data.DKKBRL?.bid ?? 0);

  if (!rate || Number.isNaN(rate)) {
    throw new Error("Taxa DKK/BRL inválida.");
  }

  return rate;
}
