import { Module } from '@nestjs/common'
import { VacationRequestService } from './vacation-request.service'
import { VacationRequestResolver } from './vacation-request.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VacationRequest } from './entities/vacation-request.entity'
import { StaffModule } from '../staff/staff.module'

@Module({
  imports: [TypeOrmModule.forFeature([VacationRequest]), StaffModule],
  providers: [VacationRequestResolver, VacationRequestService],
  exports: [VacationRequestService],
})
export class VacationRequestModule {}
