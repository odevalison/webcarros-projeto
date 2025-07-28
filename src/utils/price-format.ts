export const priceFormat = (nonFormattedPrice: number) => {
  return Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(nonFormattedPrice)
}
