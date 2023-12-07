import { CreateLoanableMaterialInput } from "../dto/create-loanable-material.input"
import { LoanableMaterial } from "../entities/loanable-material.entity"


export const createLoanableMaterialInputStub = (): CreateLoanableMaterialInput => {
  const LoanableMaterial = new CreateLoanableMaterialInput()
  LoanableMaterial.name = 'Test'
  LoanableMaterial.description = 'Test'
  LoanableMaterial.price = 100
  LoanableMaterial.wantedAmount = 5
  LoanableMaterial.totalAmount = 3
  LoanableMaterial.isComplete = true
  LoanableMaterial.SportId = ['Voetbal', 'Tennis', 'Basketbal']
  return LoanableMaterial
}

export const loanableMaterialStub = (): LoanableMaterial => {
  const loanableMaterial = new LoanableMaterial()
  loanableMaterial.id = 'abc123'
  loanableMaterial.name = 'Test'
  loanableMaterial.description = 'Test'
  loanableMaterial.price = 100
  loanableMaterial.wantedAmount = 5
  loanableMaterial.totalAmount = 3
  loanableMaterial.isComplete = true
  loanableMaterial.SportId = ['Voetbal', 'Tennis', 'Basketbal']
  loanableMaterial.createdAt = new Date()
  loanableMaterial.updatedAt = new Date()
  loanableMaterial.sports = [
    {
      id: '1',
      name: 'Voetbal',
      description: 'Test',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
  return loanableMaterial
}