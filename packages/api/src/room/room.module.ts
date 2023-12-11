// Common
import { Module } from '@nestjs/common'
// Services
import { RoomService } from './room.service'
// Resolvers
import { RoomResolver } from './room.resolver'
// TypeOrm
import { TypeOrmModule } from '@nestjs/typeorm'
// Entities
import { Room } from './entities/room.entity'
// Modules
import { SportModule } from 'src/sport/sport.module'

@Module({
  imports: [TypeOrmModule.forFeature([Room]), SportModule],
  providers: [RoomResolver, RoomService],
  exports: [RoomService],
})
export class RoomModule {}
