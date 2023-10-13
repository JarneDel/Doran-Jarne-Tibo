import { Injectable } from '@nestjs/common'
import { CreateGroupInput } from './dto/create-group.input'
import { UpdateGroupInput } from './dto/update-group.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Group } from './entities/group.entity'
import { Repository } from 'typeorm'
import { ObjectId } from 'mongodb'
import { Role } from 'src/users/entities/user.entity'

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  findAll() {
    return this.groupRepository.find()
  }

  create(uid: string,createGroupInput: CreateGroupInput) {
    const g = new Group()
    g.name = createGroupInput.name
    g.btw_number = createGroupInput.btw_number
    g.locale = createGroupInput.locale
    g.UID = uid
    g.score = 50
    g.role = Role.GROUP 

    return this.groupRepository.save(g)
  }

  async findOne(id: string) {
    //@ts-ignore
    return await this.groupRepository.findOne({ _id:new ObjectId(id)})
  }

  async findOneByUid(uid: string) {
    //@ts-ignore
    console.info(uid)
    return await this.groupRepository.findOneByOrFail({ UID: uid})
  }

  async update(id: string, updateGroupInput: UpdateGroupInput) {
    const g = await this.findOne(id)
    g.name = updateGroupInput.name
    if (updateGroupInput.btw_number)
    g.btw_number = updateGroupInput.btw_number
    if (updateGroupInput.score)
    g.score = updateGroupInput.score
    return this.groupRepository.save( g)
    
  }
  async updateScore(id: string, amount:number) {
   const exGroup=await this.findOne(id)
    exGroup.score = exGroup.score + amount
    this.groupRepository.update(id, exGroup) 
    return exGroup
  }

  remove(id: number) {
    this.groupRepository.delete(id)
  }

  save(group: Group[]) {
    return this.groupRepository.save(group)
  }

  truncate() {
    return this.groupRepository.clear()
  }
}
