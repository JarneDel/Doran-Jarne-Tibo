const getIsExpired = (date: Date) => {
  const now = new Date()
  return date < now
}
const timeToExpiry = (date: Date): string => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  if (days) {
    return `${days}d ${hours}h`
  }
  if (hours) {
    return `${hours}h ${minutes}m`
  }
  if (minutes) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}

export default function () {
  return {
    getIsExpired,
    timeToExpiry,
  }
}
