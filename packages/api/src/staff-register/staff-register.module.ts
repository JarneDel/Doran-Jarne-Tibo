import { Module } from '@nestjs/common'
import { StaffRegisterService } from './staff-register.service'
import { StaffRegisterResolver } from './staff-register.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StaffRegister } from './entities/staff-register.entity'

@Module({
  imports: [TypeOrmModule.forFeature([StaffRegister])],
  exports: [StaffRegisterService],
  providers: [StaffRegisterResolver, StaffRegisterService],
})
export class StaffRegisterModule {}
