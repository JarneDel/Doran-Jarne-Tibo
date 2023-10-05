// Common
import { Module } from '@nestjs/common';
// Services
import { RoomService } from './room.service';
// Resolvers
import { RoomResolver } from './room.resolver';
// TypeOrm
import {TypeOrmModule} from "@nestjs/typeorm";
// Entities
import {Room} from "./entities/room.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  providers: [RoomResolver, RoomService],
  exports: [RoomService],
})
export class RoomModule {}
