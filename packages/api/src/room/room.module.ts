import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomResolver } from './room.resolver';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Room} from "./entities/room.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  providers: [RoomResolver, RoomService],
  exports: [RoomService],
})
export class RoomModule {}
