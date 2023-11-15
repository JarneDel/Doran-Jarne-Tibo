function getDates(startDate: Date, endDate: Date): number {
  return (
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) +
    1
  )
}

export const useDates = () => {
  return {
    getDates,
  }
}
