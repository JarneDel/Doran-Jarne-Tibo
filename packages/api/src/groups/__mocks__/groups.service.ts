import { groupStub } from '../stubs/groups.stub'

export const GroupsService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(groupStub()),
  findAll: jest.fn().mockResolvedValue([groupStub()]),
  findOne: jest.fn().mockResolvedValue(groupStub()),
  update: jest.fn().mockResolvedValue(groupStub()),
  updateScore: jest.fn().mockResolvedValue(groupStub()),
  updateProfilePictureUrl: jest.fn().mockResolvedValue(groupStub()),
  findOneByUid: jest.fn().mockResolvedValue(groupStub()),
})
