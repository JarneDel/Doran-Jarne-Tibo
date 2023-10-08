import { Module } from '@nestjs/common'
import { ServiceService } from './service.service'
import { ServiceResolver } from './service.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Service } from './entities/service.entity'
import { StaffModule } from '../staff/staff.module'

@Module({
  imports: [TypeOrmModule.forFeature([Service]), StaffModule],
  providers: [ServiceResolver, ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
