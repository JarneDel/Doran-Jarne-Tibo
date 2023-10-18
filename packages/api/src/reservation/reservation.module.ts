import { Module } from '@nestjs/common'
import { ReservationService } from './reservation.service'
import { ReservationResolver } from './reservation.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reservation } from './entities/reservation.entity'
import { GroupsModule } from 'src/groups/groups.module'
import { UsersModule } from 'src/users/users.module'
import { StaffModule } from 'src/staff/staff.module'
@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
  ],
  providers: [ReservationResolver, ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
