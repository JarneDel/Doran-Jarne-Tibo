import { Module } from "@nestjs/common";
import { LoanableMaterialsService } from "./loanable-materials.service";
import { LoanableMaterialsResolver } from "./loanable-materials.resolver";
import { LoanableMaterial } from "./entities/loanable-material.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  providers: [LoanableMaterialsResolver, LoanableMaterialsService],
  imports: [TypeOrmModule.forFeature([LoanableMaterial])],
  exports: [LoanableMaterialsService],
})
export class LoanableMaterialsModule {}
