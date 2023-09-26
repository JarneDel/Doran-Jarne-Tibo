import { Injectable } from "@nestjs/common";
import { CreateLoanableMaterialInput } from "./dto/create-loanable-material.input";
import { UpdateLoanableMaterialInput } from "./dto/update-loanable-material.input";
import { InjectRepository } from "@nestjs/typeorm";
import { LoanableMaterial } from "./entities/loanable-material.entity";
import { Repository } from "typeorm";

@Injectable()
export class LoanableMaterialsService {
  constructor(
    @InjectRepository(LoanableMaterial)
    private readonly birdRepository: Repository<LoanableMaterial>
  ) {}

  findAll() {
    return this.birdRepository.find();
  }

  create(
    createBirdInput: CreateLoanableMaterialInput
  ): Promise<LoanableMaterial> {
    const LM = new LoanableMaterial();
    LM.name = createBirdInput.name;
    LM.fullname = createBirdInput.fullname;
    LM.category = createBirdInput.category;
    LM.url = createBirdInput.url;
    LM.observations = createBirdInput.observations;
    LM.description = createBirdInput.description;
    console.log(LM + "Created");

    return this.birdRepository.save(LM);
  }

  findOne(id: number) {
    return `This action returns a #${id} loanableMaterial`;
  }

  update(id: number, updateLoanableMaterialInput: UpdateLoanableMaterialInput) {
    return `This action updates a #${id} loanableMaterial`;
  }

  remove(id: number) {
    return `This action removes a #${id} loanableMaterial`;
  }
}
