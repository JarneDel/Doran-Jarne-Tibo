import { staffStub } from '../stubs/staff.stub'

export const StaffService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(staffStub()),
  findAll: jest.fn().mockResolvedValue([staffStub()]),
  findOne: jest.fn().mockResolvedValue(staffStub()),
  update: jest.fn().mockResolvedValue(staffStub()),
  remove: jest.fn().mockResolvedValue(staffStub()),
})
