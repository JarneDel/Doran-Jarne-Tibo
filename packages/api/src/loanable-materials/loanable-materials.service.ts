import { Injectable } from "@nestjs/common";
import { CreateLoanableMaterialInput } from "./dto/create-loanable-material.input";
import { UpdateLoanableMaterialInput } from "./dto/update-loanable-material.input";
import { InjectRepository } from "@nestjs/typeorm";
import { LoanableMaterial } from "./entities/loanable-material.entity";
import { Repository, UpdateResult } from "typeorm";

@Injectable()
export class LoanableMaterialsService {
  constructor(
    @InjectRepository(LoanableMaterial)
    private readonly LoanableMaterialRepository: Repository<LoanableMaterial>
  ) {}

  findAll() {
    // Get all loanableMaterials
    return this.LoanableMaterialRepository.find();
  }

  create(
    CreateLoanableMaterialInput: CreateLoanableMaterialInput
  ): Promise<LoanableMaterial> {
    const LM = new LoanableMaterial();
    LM.name = CreateLoanableMaterialInput.name;
    LM.loanedOut = CreateLoanableMaterialInput.loanedOut;
    LM.isComplete = CreateLoanableMaterialInput.isComplete;
    LM.totalAmount = CreateLoanableMaterialInput.totalAmount;
    LM.description = CreateLoanableMaterialInput.description;
    // LM.materialInSet = CreateLoanableMaterialInput.materialInSet;

    console.log(LM + "Created");

    return this.LoanableMaterialRepository.save(LM);
  }

  findOne(id: string) {
    return this.LoanableMaterialRepository.find({
      where: { id: id },
    });
  }

  update(
    id: string,
    updateLoanableMaterialInput: UpdateLoanableMaterialInput
  ): Promise<LoanableMaterial> {
    const LM = this.LoanableMaterialRepository.findOne({
      where: { id: id },
    });
    LM.then((value) => {
      value.name = updateLoanableMaterialInput.name;
      value.loanedOut = updateLoanableMaterialInput.loanedOut;
      value.isComplete = updateLoanableMaterialInput.isComplete;
      value.totalAmount = updateLoanableMaterialInput.totalAmount;
      value.description = updateLoanableMaterialInput.description;
      // value.materialInSet = updateLoanableMaterialInput.materialInSet;
      return this.LoanableMaterialRepository.update(
        id,
        value
      );
    });
    return LM;
  }

  remove(id: number) {
    return `This action removes a #${id} loanableMaterial`;
  }
}
