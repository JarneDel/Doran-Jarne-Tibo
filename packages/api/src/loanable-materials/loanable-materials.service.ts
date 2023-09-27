import { Injectable } from "@nestjs/common";
import { CreateLoanableMaterialInput } from "./dto/create-loanable-material.input";
import { UpdateLoanableMaterialInput } from "./dto/update-loanable-material.input";
import { InjectRepository } from "@nestjs/typeorm";
import { LoanableMaterial } from "./entities/loanable-material.entity";
import { Repository, UpdateResult } from "typeorm";
import { ObjectId } from "mongodb";

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

  findOneById(id: string): Promise<LoanableMaterial> {
    const obj = new ObjectId(id);
    console.log(obj);
    // @ts-ignore
    return this.LoanableMaterialRepository.findOne({ _id: new ObjectId(id) });
  }

  remove(id: number) {
    return `This action removes a #${id} loanableMaterial`;
  }
}
