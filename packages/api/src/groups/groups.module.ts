import { Global, Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsResolver } from './groups.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { UsersModule } from 'src/users/users.module';
import { StaffModule } from 'src/staff/staff.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Group]),
  ],
  providers: [GroupsResolver, GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
