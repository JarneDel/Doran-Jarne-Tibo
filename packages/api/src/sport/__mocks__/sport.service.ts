import { sportStub } from '../stubs/sport.stub'

export const SportService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(sportStub()),
  findAll: jest.fn().mockResolvedValue([sportStub()]),
  findOneById: jest.fn().mockResolvedValue(sportStub()),
  update: jest.fn().mockResolvedValue(sportStub()),
  remove: jest.fn().mockResolvedValue({
    raw: { acknowledged: true, deletedCount: 1 },
    affected: 1,
  }),
  save: jest.fn().mockResolvedValue([sportStub()]),
})
