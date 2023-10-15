import { Module } from '@nestjs/common';
import { RepairRequestService } from './repair-request.service';
import { RepairRequestResolver } from './repair-request.resolver';

@Module({
  providers: [RepairRequestResolver, RepairRequestService],
})
export class RepairRequestModule {}
