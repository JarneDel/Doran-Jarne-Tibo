import { ConsoleLogger } from '@nestjs/common'

export class CustomLogger extends ConsoleLogger {
  log(message: string, context?: string) {
    // Ignore InstanceLoader logs
    if (context === 'InstanceLoader') {
      return
    }
    // Only pass context if it's defined
    if (context) {
      super.log(message, context)
    } else {
      super.log(message)
    }
  }
}
