import { Module } from '@nestjs/common';
import { SportsService } from './sports.service';
import { SportsResolver } from './sports.resolver';

@Module({
  providers: [SportsResolver, SportsService],
})
export class SportsModule {}
