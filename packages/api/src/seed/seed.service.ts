import { Injectable } from "@nestjs/common";
import { LoanableMaterial } from "src/loanable-materials/entities/loanable-material.entity";
import { LoanableMaterialsService } from "src/loanable-materials/loanable-materials.service";

import * as loanableMaterials from "./data/loanableMaterials.json"; // set  "resolveJsonModule": true in tsconfig.json

@Injectable()
export class SeedService {
  constructor(private LoanableMaterialsService: LoanableMaterialsService) {}

  async addLoanableServicesFromJson(): Promise<LoanableMaterial[]> {
    let LoanableMaterials: LoanableMaterial[] = [];
    for (let loanableMaterial of loanableMaterials) {
      const lm = new LoanableMaterial();
      lm.name = loanableMaterial.name;
      lm.loanedOut = loanableMaterial.loanedOut;
      lm.isComplete = loanableMaterial.isComplete;
      lm.totalAmount = loanableMaterial.totalAmount;
      lm.description = loanableMaterial.description;

      LoanableMaterials.push(lm);
    }

    return this.LoanableMaterialsService.save(LoanableMaterials);
  }

  async deleteAllBirds(): Promise<void> {
    return this.LoanableMaterialsService.truncate();
  }
}
