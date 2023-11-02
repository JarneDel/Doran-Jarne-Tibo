import { Module } from '@nestjs/common'

import { IsAfterConstraint } from './isAfterConstraint.validator'
import { IsBeforeConstraint } from './isBeforeConstraint.validator'

@Module({
  providers: [IsBeforeConstraint, IsAfterConstraint],
  exports: [IsBeforeConstraint, IsAfterConstraint], // Export for use in other modules
})
export class CustomValidatorsModule {}
