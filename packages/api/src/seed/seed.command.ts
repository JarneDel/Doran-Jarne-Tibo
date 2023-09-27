import { Command } from "nestjs-command";
import { Injectable } from "@nestjs/common";
import { SeedService } from "./seed.service";

@Injectable()
export class DatabaseSeedCommand {
  constructor(private readonly seedService: SeedService) {}

  @Command({
    command: "seed:database:loanableMaterials",
    describe: "Seed the database with loanableMaterials",
  })
  async seedLoanableMaterials() {
    console.info("Start seeding of loanableMaterials");
    const loanableMaterials = await this.seedService.addLoanableMaterialsFromJson();
    console.info(`🏀 ${loanableMaterials.length} loanableMaterials are added`);
  }

  @Command({
    command: "seed:reset:loanableMaterials",
    describe: "Delete all data from the loanableMaterials table",
  })
  async delete() {
    console.info("🔪 Start deleting loanableMaterials");
    await this.seedService.deleteAllBirds();
    console.info("Removed loanableMaterials");
  }
}
