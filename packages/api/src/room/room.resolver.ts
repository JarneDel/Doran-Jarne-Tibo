// GraphQL
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
// Services
import { RoomService } from './room.service'
// Inputs
import { CreateRoomInput } from './dto/create-room.input'
import { UpdateRoomInput } from './dto/update-room.input'
// Entities
import { Room } from './entities/room.entity'
// Common
import { UseGuards } from '@nestjs/common'
// Firebase
import { FirebaseGuard } from '../authentication/guards/firebase.guard'
import { UserRecord } from 'firebase-admin/auth'
import { FirebaseUser } from '../authentication/decorators/user.decorator'
import { GraphQLError } from 'graphql/error'
import { Sport } from 'src/sport/entities/sport.entity'
import { SportService } from 'src/sport/sport.service'

@Resolver(() => Room)
export class RoomResolver {
  constructor(
    private readonly roomService: RoomService,
    private readonly sportService: SportService
  ) {}

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
    return this.roomService.update(updateRoomInput._id, updateRoomInput)
  }

  @Mutation(() => String)
  removeRoomById(@Args('id', { type: () => String }) id: string) {
    return this.roomService
      .remove(id)
      .then((res) => {
        const obj = JSON.parse(JSON.stringify(res))
        if (obj.raw.deletedCount > 0) {
          return 'Deleted room with id: ' + id + ' succesfully'
        } else {
          return 'No room with id: ' + id + ' found'
        }
      })
      .catch((err) => {
        console.log(err)
        return err
      })
  }

  @ResolveField() // "sports" must be the same as the field in the room entity
  async sports(@Parent() room: Room): Promise<Sport[]> {
    const { SportId } = room
    if (!SportId) throw new GraphQLError('No SportId found')
    let sports: Sport[] = []
    for (let id of SportId) {
      const sport = await this.sportService.findOneById(id)
      if (!sport) throw new GraphQLError('No sport found')
      sports.push(sport)
    }
    return sports
  }
}
