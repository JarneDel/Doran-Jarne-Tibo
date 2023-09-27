import { Module } from "@nestjs/common";
import { CommandModule } from "nestjs-command";
import { LoanableMaterialsModule } from "src/loanable-materials/loanable-materials.module";
import { SeedService } from "./seed.service";
import { DatabaseSeedCommand } from "./seed.command";

@Module({
  providers: [DatabaseSeedCommand, SeedService],
  imports: [LoanableMaterialsModule, CommandModule],
})
export class SeedModule {}
