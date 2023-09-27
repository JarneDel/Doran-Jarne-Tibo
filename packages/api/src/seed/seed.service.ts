import { Injectable } from '@nestjs/common'
import { GroupsService } from 'src/groups/groups.service'
import { Group } from 'src/groups/entities/group.entity'

import * as groups from './data/groups.json' // set  "resolveJsonModule": true in tsconfig.json

@Injectable()
export class SeedService {
  constructor(private groupsService: GroupsService) {}

  async addGroupsFromJson(): Promise<Group[]> {
    let theGroups: Group[] = []
    for (let group of groups) {
      const g = new Group()
      g.name = group.name

      theGroups.push(g)
    }

    return this.groupsService.save(theGroups)
  }

  async deleteAllGroups(): Promise<void> {
    return this.groupsService.truncate()
  }
}
