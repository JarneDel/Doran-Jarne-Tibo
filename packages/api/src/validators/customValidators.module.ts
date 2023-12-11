import { Module } from '@nestjs/common'

import { IsAfterConstraint } from './isAfterConstraint.validator'
import { IsBeforeConstraint } from './isBeforeConstraint.validator'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
} from 'class-validator'

@Module({
  providers: [IsBeforeConstraint, IsAfterConstraint],
  exports: [IsBeforeConstraint, IsAfterConstraint], // Export for use in other modules
})
export class CustomValidatorsModule {

}
@ValidatorConstraint({ name: 'customValidation', async: false })
export class CustomValidation implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    // Your custom validation logic goes here
    const room = args.object['room']
    const loanableMaterial = args.object['loanableMaterial']

    if (!room && !loanableMaterial) {
      return false // Both room and loanableMaterial are empty
    }

    return true
  }

  defaultMessage(args: ValidationArguments) {
    if (args.property === 'room') {
      return 'error.customValidation.room'
    }
    if (args.property === 'loanableMaterial') {
      return 'error.customValidation.loanableMaterial'
    }
  }
}

export function CustomValidationDecorator() {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      // options: {
      //   message: 'error.customValidation',
      // },
      constraints: [],
      validator: CustomValidation,
    })
  }
}