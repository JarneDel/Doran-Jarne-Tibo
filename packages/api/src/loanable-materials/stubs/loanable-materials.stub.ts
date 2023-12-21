import { CreateLoanableMaterialInput } from "../dto/create-loanable-material.input"
import { UpdateLoanableMaterialInput } from "../dto/update-loanable-material.input"
import { LoanableMaterial } from "../entities/loanable-material.entity"


export const createLoanableMaterialInputStub = (): CreateLoanableMaterialInput => {
  const LoanableMaterial = new CreateLoanableMaterialInput()
  LoanableMaterial.name = 'Test'
  LoanableMaterial.description = 'Test'
  LoanableMaterial.price = 100
  LoanableMaterial.wantedAmount = 5
  LoanableMaterial.totalAmount = 3
  LoanableMaterial.isComplete = true
  LoanableMaterial.SportId = ['656a1085a90f2e4962ae915a']
  return LoanableMaterial
}

export const updateLoanableMaterialInputStub = (): UpdateLoanableMaterialInput => {
  const LoanableMaterial = new UpdateLoanableMaterialInput()
  LoanableMaterial.name = 'Test'
  LoanableMaterial.description = 'Test'
  LoanableMaterial.price = 100
  LoanableMaterial.wantedAmount = 5
  LoanableMaterial.totalAmount = 3
  LoanableMaterial.isComplete = true
  LoanableMaterial.SportId = ['656a1085a90f2e4962ae915a']
  return LoanableMaterial
}

export const loanableMaterialStub = (): LoanableMaterial => {
  const loanableMaterial = new LoanableMaterial()
  loanableMaterial.id = '656a1085a90f2e4962ae915a'
  loanableMaterial.name = 'Test'
  loanableMaterial.description = 'Test'
  loanableMaterial.price = 100
  loanableMaterial.wantedAmount = 5
  loanableMaterial.totalAmount = 3
  loanableMaterial.isComplete = true
  loanableMaterial.SportId = ['656a1085a90f2e4962ae915a']
  loanableMaterial.createdAt = new Date('2023-12-07T15:04:51.996Z')
  loanableMaterial.updatedAt = new Date('2023-12-07T15:04:51.996Z')
  loanableMaterial.sports = [
    {
      id: '656a1085a90f2e4962ae915a',
      name: 'Voetbal',
      description: 'Test',
      createdAt: new Date('2023-12-07T15:04:51.996Z'),
      updatedAt: new Date('2023-12-07T15:04:51.996Z'),
    },
  ]
  return loanableMaterial
}