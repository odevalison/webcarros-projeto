export const phoneMask = (phoneNumber: string) => {
  const numbers = phoneNumber.replace(/\D/g, '')

  if (numbers.length <= 2) {
    return numbers
  } else if (numbers.length <= 7) {
    return numbers.replace(/(\d{2})(\d+)/, '($1) $2')
  } else if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3')
  }

  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}
