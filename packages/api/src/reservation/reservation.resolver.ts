import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { ReservationService } from './reservation.service'
import { Reservation } from './entities/reservation.entity'
import { CreateReservationInput } from './dto/create-reservation.input'
import { UpdateReservationInput } from './dto/update-reservation.input'
import { GroupsService } from 'src/groups/groups.service'
import { GraphQLError } from 'graphql/error'
import { Group } from 'src/groups/entities/group.entity'
import { AllowedRoles } from 'src/authentication/decorators/role.decorator'
import { Role } from 'src/users/entities/user.entity'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { RolesGuard } from 'src/authentication/guards/roles.guard'
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity'
import { Room } from 'src/room/entities/room.entity'
import { FirebaseUser } from 'src/authentication/decorators/user.decorator'
import { UserRecord } from 'firebase-admin/auth'
import { use } from 'passport'

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly groupService: GroupsService,
  ) {}

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.GROUP)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Reservation)
  createReservation(
    @Args('createReservationInput')
    createReservationInput: CreateReservationInput,
  ) {
    return this.reservationService.create(createReservationInput)
  }
  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Reservation], { name: 'GetAllReservations' })
  findAll() {
    return this.reservationService.findAll()
  }
  @AllowedRoles(Role.GROUP, Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => Reservation, { name: 'GetReservatiounById' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @FirebaseUser() user: UserRecord,
  ) {
    if (Role.GROUP) {
      const group = await this.groupService.findOneByUid(user.uid)
      const reservation = await this.reservationService.findOne(id)
      if (group.id.toString() !== reservation.groupId)
        throw new GraphQLError('Not authorized')
      return reservation
    } else return this.reservationService.findOne(id)
  }
  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Reservation], { name: 'GetReservationsByDate' })
  findByDate(@Args('date', { type: () => Date }) date: Date) {
    return this.reservationService.findByDate(date)
  }
  @AllowedRoles(Role.GROUP, Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Reservation], { name: 'GetReservationsByDateAndUser' })
  async findByDateAndUser(
    @Args('date', { type: () => Date }) date: Date,
    @FirebaseUser() user: UserRecord,
  ) {
    const group = await this.groupService.findOneByUid(user.uid)
    return this.reservationService.findByDateAndUser(date, group.id)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.GROUP)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Reservation, { name: 'UpdateReservation' })
  updateReservation(
    @Args('updateReservationInput')
    updateReservationInput: UpdateReservationInput,
  ) {
    return this.reservationService.update(
      updateReservationInput.id,
      updateReservationInput,
    )
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Reservation, { name: 'DeleteReservation' })
  deleteReservation(@Args('id', { type: () => String }) id: string) {
    return this.reservationService.delete(id)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.GROUP)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [LoanableMaterial], {
    name: 'GetAvailableloanableMaterials',
  })
  findAvailable(
    @Args('date', { type: () => String }) date: string,
    @Args('startTime', { type: () => String }) startTime: string,
    @Args('endTime', { type: () => String }) endTime: string,
    @Args('sportId', { type: () => [String] }) sportId: string[],
  ) {
    return this.reservationService.getAvailableMaterail(
      date,
      startTime,
      endTime,
      sportId,
    )
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.STAFF, Role.GROUP)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Room], {
    name: 'getAvailableRooms',
    nullable: true,
  })
  getAvailableRooms(
    @Args('date', { type: () => String }) date: string,
    @Args('startTime', { type: () => String }) startTime: string,
    @Args('endTime', { type: () => String }) endTime: string,
  ) {
    return this.reservationService.getAvailableRooms(date, startTime, endTime)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.STAFF, Role.GROUP)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Reservation], {
    name: 'GetReservationsByRoomAndDay',
    nullable: true,
  })
  GetReservationsByRoomAndDay(
    @Args('date', { type: () => String }) date: string,
    @Args('roomId', { type: () => String }) roomId: string,
  ) {
    return this.reservationService.getReservationsByRoomAndDay(date, roomId)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.STAFF, Role.GROUP)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Reservation], {
    name: 'getReservationsByUser',
    nullable: true,
  })
  async getReservationsByUser(@FirebaseUser() user: UserRecord) {
    const group = await this.groupService.findOneByUid(user.uid)
    return this.reservationService.getReservationsByUser(group.id)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.STAFF, Role.GROUP)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Reservation, { name: 'cancelReservation' })
  canselReservation(@Args('id', { type: () => String }) id: string) {
    return this.reservationService.cancelReservation(id)
  }

  @ResolveField()
  async group(@Parent() reservation: Reservation): Promise<Group> {
    const { groupId } = reservation
    if (!groupId) throw new GraphQLError(`No groupId found ${reservation}`)
    return this.groupService.findOne(groupId)
  }
}
