import { loanableMaterialStub } from "../stubs/loanable-materials.stub";


export const LoanableMaterialsService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(loanableMaterialStub()),
  findAll: jest.fn().mockResolvedValue([loanableMaterialStub()]),
  findOne: jest.fn().mockResolvedValue(loanableMaterialStub()),
  update: jest.fn().mockResolvedValue(loanableMaterialStub()),
  remove: jest.fn().mockResolvedValue(loanableMaterialStub()),
})