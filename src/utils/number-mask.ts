export const numberMask = (numberToMask: string) => {
  const number = numberToMask.replace(/\D/g, '')

  if (number.length < 3) {
    return number
  }

  return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
