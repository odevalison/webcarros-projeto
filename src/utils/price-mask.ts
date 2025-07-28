export const priceMask = (price: string) => {
  const priceToMask = price.replace(/\D/g, '')

  if (!priceToMask.length) {
    return priceToMask
  }

  const maskedValue = priceToMask
    .replace(/\D/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return `R$ ${maskedValue}`
}
