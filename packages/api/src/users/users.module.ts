import { Global, Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersResolver } from './users.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { StaffModule } from 'src/staff/staff.module'
import { GroupsModule } from 'src/groups/groups.module'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]),],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
