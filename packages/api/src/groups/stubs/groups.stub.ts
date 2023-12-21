import { Group } from '../entities/group.entity'
import { CreateGroupInput } from '../dto/create-group.input'
import { Role } from 'src/users/entities/user.entity'
import { UpdateGroupInput } from '../dto/update-group.input'

export const createGroupInputStub = (): CreateGroupInput => {
  const group = new CreateGroupInput()
  group.name = 'Test'
  group.email = 'Test.test@test.test'
  group.btwNumber = '123456789'
  group.profilePictureUrl = 'https://www.google.com'

  return group
}

export const updateGroupInputStub = (): UpdateGroupInput => {
  const group = new UpdateGroupInput()
  group._id = '656a1085a90f2e4962ae915a'
  group.name = 'Test'
  group.email = 'Test.test@test.test'
  group.btwNumber = '123456789'
  group.profilePictureUrl = 'https://www.google.com'

  return group
}

export const groupStub = (): Group => {
  const group = new Group()
  group.id = '656a1085a90f2e4962ae915a'
  group.name = 'Test'
  group.email = 'Test.test@test.test'
  group.btwNumber = '123456789'
  group.profilePictureUrl = 'https://www.google.com'
  group.UID = 'abc123'
  group.role = Role.GROUP
  group.score = 50

  return group
}
