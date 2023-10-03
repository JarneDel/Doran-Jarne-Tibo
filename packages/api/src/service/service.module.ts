import { Module } from '@nestjs/common'
import { ServiceService } from './service.service'
import { ServiceResolver } from './service.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Service } from './entities/service.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  providers: [ServiceResolver, ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
