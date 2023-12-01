import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { StaffRegisterService } from './staff-register.service'
import { UseGuards } from '@nestjs/common'
import { Role } from '../users/entities/user.entity'
import { AllowedRoles } from '../authentication/decorators/role.decorator'
import { CreateStaffRegisterInput } from './dto/create-staff-register.input'
import { StaffRegister } from './entities/staff-register.entity'
import { StaffRegisterArgs } from './args/staff-register.args'
import { MailerService } from '@nestjs-modules/mailer'
import { StaffService } from '../staff/staff.service'
import { GraphQLError } from 'graphql/error'
import { Staff } from '../staff/entities/staff.entity'
import { StaffSignUpInput } from './dto/staff-sign-up.input'

@Resolver()
export class StaffRegisterResolver {
  constructor(
    private readonly staffRegisterService: StaffRegisterService,
    private readonly staffService: StaffService,
    private readonly mailerService: MailerService,
  ) {}

  @UseGuards()
  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @Mutation(() => StaffRegister)
  async createStaffRegister(
    @Args('createStaffRegisterInput')
    createStaffRegisterInput: CreateStaffRegisterInput,
  ) {
    const staffRegister = new StaffRegister()
    staffRegister.email = createStaffRegisterInput.email
    staffRegister.firstName = createStaffRegisterInput.firstName
    staffRegister.lastName = createStaffRegisterInput.lastName
    staffRegister.isRegistered = false
    staffRegister.role = createStaffRegisterInput.role
    staffRegister.expiresAt = new Date(
      new Date().getTime() + 1000 * 60 * 60 * 24 * 7,
    ) // 7 days
    const staffRegisterResult =
      await this.staffRegisterService.create(staffRegister)
    const frontendUrl = process.env.URL_FRONTEND || 'http://localhost:3000'
    const signupUrl = `${frontendUrl}/staff-register/${staffRegisterResult.id}`
    console.log(signupUrl)
    await this.mailerService.sendMail({
      to: staffRegister.email,
      subject: 'Welcome to the team',
      template: './welcome',
      context: {
        firstName: staffRegisterResult.firstName,
        lastName: staffRegisterResult.lastName,
        originalUrl: signupUrl,
      },
    })

    return staffRegisterResult
  }

  @UseGuards()
  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @Query(() => [StaffRegister], { name: 'staffRegisterAll' })
  async findAllStaffRegister() {
    return this.staffRegisterService.findAll()
  }

  @UseGuards()
  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @Query(() => StaffRegister, { name: 'staffRegister', nullable: true })
  findOne(@Args() args: StaffRegisterArgs) {
    if (args.email) {
      return this.staffRegisterService.findOneByEmail(args.email)
    } else if (args.id) {
      return this.staffRegisterService.findOne(args.id)
    }
  }

  @Query(() => StaffRegister, { name: 'staffRegisterById', nullable: true })
  findById(@Args('id') id: string) {
    return this.staffRegisterService.findOne(id)
  }

  @Mutation(() => Staff)
  async signUpUser(@Args('staffSignUpInput') input: StaffSignUpInput) {
    const staffRegister = await this.staffRegisterService.findOne(input.id)
    staffRegister.isRegistered = true
    if (!staffRegister) {
      throw new GraphQLError('404')
    }
    const staff = new Staff()
    staff.email = staffRegister.email
    staff.firstName = staffRegister.firstName
    staff.lastName = staffRegister.lastName
    staff.role = staffRegister.role
    staff.UID = input.uid
    staff.locale = input.locale
    staff.holidayDates = []
    staff.holidaysLeft = staffRegister.holidayCount || 25
    staff.holidaysTotal = staffRegister.holidayCount || 25
    staff.phone = input.phone

    const registeredStaff =
      await this.staffService.createFromStaffRegister(staff)

    await this.staffRegisterService.update(staffRegister)
    return registeredStaff
  }
}
