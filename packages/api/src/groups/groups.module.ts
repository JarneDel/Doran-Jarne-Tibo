import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsResolver } from './groups.resolver';
import { Group } from './entities/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [GroupsResolver, GroupsService],
  imports: [TypeOrmModule.forFeature([Group])],
  exports: [GroupsService],
})
export class GroupsModule {}
