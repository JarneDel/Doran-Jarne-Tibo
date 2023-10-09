import { Module, Res } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationResolver } from './reservation.resolver';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';

@Module({
  providers: [ReservationResolver, ReservationService],
  imports: [TypeOrmModule.forFeature([Reservation])],
  exports: [ReservationService],
})
export class ReservationModule {}
