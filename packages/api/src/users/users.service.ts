import { Injectable } from '@nestjs/common'
import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'
import { read } from 'fs'
import { Repository } from 'typeorm'
import { Role, User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  create(uid: string, createUserInput: CreateUserInput) {
    const user = new User()
    user.UID = uid
    user.locale = createUserInput.locale ?? 'nl'
    user.role = Role.USER //BUG: default columns doesn't seem to work.
    return this.userRepository.save(user)
  }

  findAll() {
    return this.userRepository.find()
  }

  findOne(id: string) {
    return new Error(`This action returns a #${id} user`)
  }

  findOneByUid(uid: string) {
    return this.userRepository.findOneByOrFail({ UID: uid })
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return new Error(`This action updates a #${id} user`)
  }

  remove(id: string) {
    return new Error(`This action removes a #${id} user`)
  }

}
  