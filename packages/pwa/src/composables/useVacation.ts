const getConnectedVacationDays = (vacationDates: Date[]): Date[][] => {
  vacationDates = vacationDates.sort((a, b) => a.getTime() - b.getTime())

  const connectedVacationDays: Date[][] = []
  vacationDates.forEach(vacationDate => {
    const lastArray = connectedVacationDays[connectedVacationDays.length - 1]
    if (
      lastArray &&
      lastArray[lastArray.length - 1].getDate() === vacationDate.getDate() - 1
    ) {
      lastArray.push(vacationDate)
    } else {
      connectedVacationDays.push([vacationDate])
    }
  })
  return connectedVacationDays
}

export default function useVacation() {
  return {
    getConnectedVacationDays,
  }
}
