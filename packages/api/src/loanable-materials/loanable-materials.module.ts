// Common
import { Module } from "@nestjs/common";
// Service
import { LoanableMaterialsService } from "./loanable-materials.service";
// Resolver
import { LoanableMaterialsResolver } from "./loanable-materials.resolver";
// Entities
import { LoanableMaterial } from "./entities/loanable-material.entity";
// Typeorm
import { TypeOrmModule } from "@nestjs/typeorm";
import { SportModule } from "src/sport/sport.module";

@Module({
  imports: [TypeOrmModule.forFeature([LoanableMaterial]),SportModule],
  providers: [LoanableMaterialsResolver, LoanableMaterialsService],
  exports: [LoanableMaterialsService],
})
export class LoanableMaterialsModule {}
