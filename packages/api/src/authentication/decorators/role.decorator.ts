// Common
import { SetMetadata } from '@nestjs/common'
// Entities
import { Role } from '../../users/entities/user.entity'

// Exports
export const ROLES_KEY = 'roles'

export const AllowedRoles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)
