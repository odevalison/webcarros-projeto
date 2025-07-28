export const numberFormat = (nonFormattedNumber: number) => {
  return Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'decimal',
  }).format(nonFormattedNumber)
}
