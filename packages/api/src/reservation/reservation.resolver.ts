import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationInput } from './dto/create-reservation.input';
import { UpdateReservationInput } from './dto/update-reservation.input';
import { GroupsService } from 'src/groups/groups.service';
import { GraphQLError } from 'graphql/error'
import { Group } from 'src/groups/entities/group.entity';
import { AllowedRoles } from 'src/users/decorators/role.decorator';
import { Role } from 'src/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard';
import { RolesGuard } from 'src/users/guards/roles.guard';

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
  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => Reservation, { name: 'GetReservatiounById' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.reservationService.findOne(id)
  }
  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Reservation], { name: 'GetReservationsByDate' })
  findByDate(@Args('date', { type: () => Date }) date: Date) {
    return this.reservationService.findByDate(date)
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

  @ResolveField()
  async group(@Parent() reservation: Reservation): Promise<Group> {
    const { groupId } = reservation
    if (!groupId) throw new GraphQLError(`No groupId found ${reservation}`)
    return this.groupService.findOne(groupId)
  }
}
