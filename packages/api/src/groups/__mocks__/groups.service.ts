import { groupStub } from '../stubs/groups.stub'

export const GroupsService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(groupStub()),
  findAll: jest.fn().mockResolvedValue([groupStub()]),
  findOne: jest.fn().mockResolvedValue(groupStub()),
  update: jest.fn().mockResolvedValue(groupStub()),
  remove: jest.fn().mockResolvedValue(groupStub()),
})
