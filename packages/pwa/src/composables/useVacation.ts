const getConnectedVacationDays = (vacationDates: Date[]): Date[][] => {
  vacationDates = vacationDates.sort((a, b) => a.getTime() - b.getTime())

  const connectedVacationDays: Date[][] = []
  vacationDates.forEach(vacationDate => {
    vacationDate = new Date(vacationDate)

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

const parseVacationDays = (vacationDays: Date[][]): string[][] => {
  // convert to locale date string only day and month and year
  return vacationDays.map(vacationDay => {
    return vacationDay.map(day => day.toLocaleDateString())
  })
}

export default function useVacation() {
  return {
    getConnectedVacationDays,
    parseVacationDays,
  }
}

const vd = [[new Date('2023-11-15T00:00:00.000Z')]]

// const vd = [
//   new Date('2021-01-01'),
//   new Date('2021-01-02'),
//   new Date('2021-01-03'),
//   new Date('2021-01-07'),
//   new Date('2021-01-06'),
// ]
// const connected = getConnectedVacationDays(vd)
// console.log(connected)
const formatted = parseVacationDays(vd)
console.log(formatted)
