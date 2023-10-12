import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationInput } from './dto/create-reservation.input';
import { UpdateReservationInput } from './dto/update-reservation.input';
import { GroupsService } from 'src/groups/groups.service';
import { GraphQLError } from 'graphql/error'
import { Group } from 'src/groups/entities/group.entity';

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(private readonly reservationService: ReservationService,
    private readonly groupService:GroupsService) {}

  @Mutation(() => Reservation)
  createReservation(@Args('createReservationInput') createReservationInput: CreateReservationInput) {
    return this.reservationService.create(createReservationInput);
  }

  @Query(() => [Reservation], { name: 'GetAllReservations' })
  findAll() {
    return this.reservationService.findAll();
  }

  @Query(() => Reservation, { name: 'GetReservatiounById' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.reservationService.findOne(id);
  }

  @Query(() => [Reservation], { name: 'GetReservationsByDate' })
  findByDate(@Args('date', { type: () => Date }) date: Date) {
    return this.reservationService.findByDate(date);
  }

  @Mutation(() => Reservation, { name: 'UpdateReservation' })
  updateReservation(@Args('updateReservationInput') updateReservationInput: UpdateReservationInput) {
    return this.reservationService.update(updateReservationInput.id, updateReservationInput);
  }

  @ResolveField()
  async group(@Parent() reservation: Reservation): Promise<Group> {
    const { groupId } = reservation
    if (!groupId) throw new GraphQLError(`No groupId found ${reservation}`)
    return this.groupService.findOne(groupId)
  }
}
