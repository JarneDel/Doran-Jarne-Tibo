import { useDates } from '@/composables/useDates.ts'
import { VacationRequest } from '@/graphql/vacation.request.query.ts'

const { getDates } = useDates()

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

/**
 * Validates the input for creating a vacation request
 * @param startDate Start date of new vacation request
 * @param endDate End date of new vacation request
 * @param confirmedVacationDays Vacation days that are already confirmed -- in staff.holidayDates
 * @param requestedVacationDays Vacation days that are already requested -- in vacationRequests table
 * @param originalVacationDaysLeft Original number of vacation days left
 * @returns Returns true if there is no error, otherwise returns a string with the error
 */
function validateCreateVacationRequestInput(
  startDate: Date,
  endDate: Date,
  confirmedVacationDays: Date[],
  requestedVacationDays: number[],
  originalVacationDaysLeft: number,
) {
  const dateCount = getDates(startDate, endDate)
  const vacationDaysLeft = originalVacationDaysLeft - dateCount
  if (startDate > endDate) {
    return 'Start date must be before end date'
  }
  if (startDate < new Date()) {
    return 'Start date must be in the future'
  }
  if (endDate < new Date()) {
    return 'End date must be in the future'
  }
  if (vacationDaysLeft < 0) {
    return 'You have no more vacation days left'
  }
  if (vacationDaysLeft === originalVacationDaysLeft) {
    return 'You have to request at least one day'
  }
  if (vacationDaysLeft < 0) {
    return 'You have no more vacation days left'
  }

  const startDateDuplicate = new Date(startDate)
  for (let i = 0; i <= dateCount; i++) {
    if (confirmedVacationDays.includes(startDateDuplicate)) {
      return `You already have a vacation planned for ${startDateDuplicate}`
    }

    if (requestedVacationDays.includes(startDateDuplicate.getTime())) {
      return `You already have a vacation planned for ${startDateDuplicate.toLocaleDateString()}`
    }
    startDateDuplicate.setDate(startDateDuplicate.getDate() + 1)
  }
  return true
}

export interface openDates {
  /**
   * localized date string
   */
  startDate: string
  /**
   * localized date string
   */
  endDate: string
  /**
   * number of days between startDate and endDate
   */
  dayCount: number
}

/**
 * returns ranges of requested vacations
 * @param requests vacationRequests
 * @returns array of requested vacation dates, with start date end date and length
 */
function parseOpenRequests(requests: VacationRequest[]) {
  if (requests.length == 0) return
  const dates: openDates[] = []

  requests.forEach(request => {
    if (request.isRejected || request.isApproved) return
    const days = getDates(request.startDate, request.endDate)
    dates.push({
      dayCount: days,
      endDate: request.endDate.toLocaleDateString(),
      startDate: request.startDate.toLocaleDateString(),
    })
  })
  return dates
}

/**
 *
 * @param requests
 * @return timestamps of all requested vacation dates
 */
function getRequestedDates(requests: VacationRequest[]) {
  const raw: number[] = []
  requests.forEach(request => {
    if (request.isApproved || request.isRejected) return
    const days = getDates(request.startDate, request.endDate)
    for (let i = 0; i < days; i++) {
      const newDate = new Date(request.startDate)
      newDate.setDate(newDate.getDate() + i)
      raw.push(newDate.getTime())
    }
  })
  return raw
}

export default function useVacation() {
  return {
    getConnectedVacationDays,
    parseVacationDays,
    validateCreateVacationRequestInput,
    parseOpenRequests,
    getRequestedDates,
  }
}
