import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { RoomService } from './room.service'
import { Room } from './entities/room.entity'
import { CreateRoomInput } from './dto/create-room.input'
import { UpdateRoomInput } from './dto/update-room.input'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from '../authentication/guards/firebase.guard'
import { UserRecord } from 'firebase-admin/auth'
import { FirebaseUser } from '../authentication/decorators/user.decorator'

@Resolver(() => Room)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @Mutation(() => Room)
  createRoom(
    @Args('createRoomInput')
    createRoomInput: CreateRoomInput
  ) {
    return this.roomService.create(createRoomInput)
  }

  @Query(() => [Room], {
    name: 'GetAllRooms',
  })
  findAll() {
    return this.roomService.findAll()
  }

  @Query(() => Room, {
    name: 'GetRoomById',
    nullable: true,
  })
  findOneById(@Args('id', { type: () => String }) id: string) {
    return this.roomService.findOneById(id)
  }

  @Query(() => Room, { name: 'room' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.roomService.findOneById(id)
  }

  @Mutation(() => Room)
  updateRoom(@Args('updateRoomInput') updateRoomInput: UpdateRoomInput) {
    return this.roomService.update(updateRoomInput.id, updateRoomInput)
  }

  @Mutation(() => Room)
  removeRoomById(@Args('id', { type: () => String }) id: string) {
    this.roomService.remove(id)
    return 'Deleted room with id: ' + id
  }
}
