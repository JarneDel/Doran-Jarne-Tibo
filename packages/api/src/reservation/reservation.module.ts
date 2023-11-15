import { Module, forwardRef } from '@nestjs/common'
import { ReservationService } from './reservation.service'
import { ReservationResolver } from './reservation.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reservation } from './entities/reservation.entity'
import { RoomModule } from 'src/room/room.module'
import { LoanableMaterialsModule } from 'src/loanable-materials/loanable-materials.module'
@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Reservation],),
      RoomModule,
      LoanableMaterialsModule,
  ],
  providers: [ReservationResolver, ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
