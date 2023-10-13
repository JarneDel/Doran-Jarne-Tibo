import { Injectable } from "@nestjs/common";
import { CreateLoanableMaterialInput } from "./dto/create-loanable-material.input";
import { UpdateLoanableMaterialInput } from "./dto/update-loanable-material.input";
import { InjectRepository } from "@nestjs/typeorm";
import { LoanableMaterial } from "./entities/loanable-material.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { ObjectId } from "mongodb";

@Injectable()
export class LoanableMaterialsService {
  constructor(
    @InjectRepository(LoanableMaterial)
    private readonly LoanableMaterialRepository: Repository<LoanableMaterial>
  ) {}

  findAll() {
    return this.LoanableMaterialRepository.find()
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

    console.log("Created: " + LM.name);

    return this.LoanableMaterialRepository.save(LM);
  }

  findOneById(id: string): Promise<LoanableMaterial> {
    const obj = new ObjectId(id);
    console.log(obj);
    // @ts-ignore
    return this.LoanableMaterialRepository.findOne({ _id: new ObjectId(id) });
  }

  save(loanableMaterials: LoanableMaterial[]): Promise<LoanableMaterial[]> {
    return this.LoanableMaterialRepository.save(loanableMaterials);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.LoanableMaterialRepository.delete(id);
  }

  truncate(): Promise<void> {
    return this.LoanableMaterialRepository.clear();
  }
}
