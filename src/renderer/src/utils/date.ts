// Função para gerar a lista de anos
function getYearsInterval(): number[] {
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 2
  const endYear = currentYear

  // Gera a lista de anos entre startYear e endYear
  return Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index)
}

// Função para obter os meses
function getMonths(startDate: Date, endDate: Date): { month: string }[] {
  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]
  const result: { month: string }[] = []
  const current = new Date(startDate)

  while (current <= endDate) {
    result.push({
      month: meses[current.getMonth()]
    })
    current.setMonth(current.getMonth() + 1)
  }

  return result
}

export { getMonths, getYearsInterval }
