import { Injectable } from '@nestjs/common'
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ name: 'isBefore', async: false })
@Injectable()
export class IsBeforeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints
    const relatedValue = (args.object as any)[relatedPropertyName]
    return value < relatedValue
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints
    return `${relatedPropertyName} must be before ${args.property}`
  }
}
