import { Group } from '../entities/group.entity'
import { CreateGroupInput } from '../dto/create-group.input'
import { Role } from 'src/users/entities/user.entity'

export const createGroupInputStub = (): CreateGroupInput => {
  const group = new CreateGroupInput()
  group.name = 'Test'
  group.email = 'Test.test@test.test'
  group.btwNumber = '123456789'
  group.profilePictureUrl = 'https://www.google.com'

  return group
}

export const groupStub = (): Group => {
  const group = new Group()
  group.id = 'abc123'
  group.name = 'Test'
  group.email = 'Test.test@test.test'
  group.btwNumber = '123456789'
  group.profilePictureUrl = 'https://www.google.com'
  group.UID = 'abc123'
  group.role = Role.GROUP

  return group
}
