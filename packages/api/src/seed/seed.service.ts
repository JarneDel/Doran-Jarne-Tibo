import { Injectable } from '@nestjs/common'
import { Stock } from '../stock/entities/stock.entity'
import { StockService } from '../stock/stock.service'
import * as stock from './data/stock.json'
import * as groups from './data/groups.json' // set  "resolveJsonModule": true in tsconfig.json
import * as loanableMaterials from "./data/loanableMaterials.json";
import { Group } from 'src/groups/entities/group.entity'
import { GroupsService } from 'src/groups/groups.service'
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity'
import { LoanableMaterialsService } from 'src/loanable-materials/loanable-materials.service'


@Injectable()
export class SeedService {
  constructor(private stockService: StockService, private groupsService: GroupsService, private LoanableMaterialsService: LoanableMaterialsService) {
  }

  async addStockFromJson(): Promise<Stock[]> {
    let outStocks: Stock[] = []
    for (let stockItem of stock) {
      const s = new Stock()
      const { name, service, description, idealStock, amountInStock, needToOrderMore } = stockItem
      s.name = name
      s.service = service
      s.description = description
      s.idealStock = idealStock
      s.amountInStock = amountInStock
      s.needToOrderMore = needToOrderMore as unknown as boolean
      outStocks.push(s)
    }

    return await this.stockService.saveAll(outStocks)
  }

  async deleteAllStock(): Promise<void> {
    return this.stockService.truncate()
  }

  async addGroupsFromJson(): Promise<Group[]> {
    let theGroups: Group[] = []
    for (let group of groups) {
      const g = new Group()
      g.name = group.name
      g.btw_number = group.btw_number
      g.score = group.score

      theGroups.push(g)
    }

    return this.groupsService.save(theGroups)
  }

  async deleteAllGroups(): Promise<void> {
    return this.groupsService.truncate()
  }

  async deleteAllBirds(): Promise<void> {
    return this.LoanableMaterialsService.truncate();
  }

  async addLoanableMaterialsFromJson(): Promise<LoanableMaterial[]> {
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
}
