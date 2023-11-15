// Common
import { Module } from '@nestjs/common';
// Service
import { RepairRequestService } from './repair-request.service';
// Resolver
import { RepairRequestResolver } from './repair-request.resolver';
// Typeorm
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { RepairRequest } from './entities/repair-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RepairRequest])],
  providers: [RepairRequestResolver, RepairRequestService],
  exports: [RepairRequestService],
})
export class RepairRequestModule {}
