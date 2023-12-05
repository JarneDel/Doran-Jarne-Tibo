import { repairRequestStub } from '../stubs/repair-request.stub'

export const RepairRequestService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(repairRequestStub()),
  findAll: jest.fn().mockResolvedValue([repairRequestStub()]),
  findOne: jest.fn().mockResolvedValue(repairRequestStub()),
  update: jest.fn().mockResolvedValue(repairRequestStub()),
  remove: jest.fn().mockResolvedValue(repairRequestStub()),
})
