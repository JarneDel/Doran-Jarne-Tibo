import { Injectable } from '@nestjs/common';
import { CreateGroupInput } from './dto/create-group.input';
import { UpdateGroupInput } from './dto/update-group.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

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
    return this.groupRepository.save(g)
  }

  findOne(id: string) {
    //@ts-ignore
    return this.groupRepository.findOne({ where: { _id:new ObjectId(id) } })
  }

  update(id: number, updateGroupInput: UpdateGroupInput) {
    return `This action updates a #${id} group`
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
