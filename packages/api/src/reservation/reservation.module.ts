import { Module } from '@nestjs/common'
import { ReservationService } from './reservation.service'
import { ReservationResolver } from './reservation.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reservation } from './entities/reservation.entity'
import { SportModule } from 'src/sport/sport.module'
@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation],),SportModule, 
  ],
  providers: [ReservationResolver, ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
