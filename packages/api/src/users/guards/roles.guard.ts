// common

import { CanActivate, ExecutionContext, Global, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { UsersService } from '../users.service'
import { Role } from '../entities/user.entity'
import { ROLES_KEY } from '../decorators/role.decorator'
import { GroupsService } from 'src/groups/groups.service'
import { StaffService } from 'src/staff/staff.service'
import { Group } from 'src/groups/entities/group.entity'
import { Staff } from 'src/staff/entities/staff.entity'


// Injectable
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UsersService,
    private readonly groupservice: GroupsService,
    private readonly StaffService: StaffService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) {
      throw new Error('No roles defined')
    }

    const ctx = GqlExecutionContext.create(context)
    const { user } = ctx.getContext().req // WAAROM WERKT DIT? OMDAT WE ZELF AL GUARD HIERVOOR HEBBEN.
    //@ts-ignore
    let role: Role
    try {
      role= (await this.StaffService.findOneByUid(user.uid)).role
    } catch (error) {
    }
    // new Promise<Staff>(
    //   // await this.groupservice.findOneByUid(user.uid),
    //   this.StaffService.findOneByUid(user.uid),
    // )
    if (role===undefined) {
      role = (await this.groupservice.findOneByUid(user.uid)).role
    }
    console.log(role)

    return requiredRoles.includes(role)
  }
}
