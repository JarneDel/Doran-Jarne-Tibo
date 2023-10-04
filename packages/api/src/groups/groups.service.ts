import { Injectable } from '@nestjs/common'
import { CreateGroupInput } from './dto/create-group.input'
import { UpdateGroupInput } from './dto/update-group.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Group } from './entities/group.entity'
import { Repository } from 'typeorm'
import { ObjectId } from 'mongodb'

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  findAll() {
    return this.groupRepository.find()
  }

  create(createGroupInput: CreateGroupInput) {
    const g = new Group()
    g.name = createGroupInput.name
    g.btw_number = createGroupInput.btw_number
    return this.groupRepository.save(g)
  }

  async findOne(id: string) {
    console.log(id)
    const o = new ObjectId(id)
    //@ts-ignore
    console.log(await this.groupRepository.findOne({where:{ _id:o }}))
    //@ts-ignore
    return await this.groupRepository.findOne({ _id:new ObjectId(id)})
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
    const g = new Group()
    g.score = exGroup.score + amount
    this.groupRepository.update(id, g)
    return g.score
  }

  remove(id: number) {
    return `This action removes a #${id} group`
  }

  save(group: Group[]) {
    return this.groupRepository.save(group)
  }

  truncate() {
    return this.groupRepository.clear()
  }
}
