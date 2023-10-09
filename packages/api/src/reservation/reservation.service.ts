import { Injectable } from '@nestjs/common';
import { CreateReservationInput } from './dto/create-reservation.input';
import { UpdateReservationInput } from './dto/update-reservation.input';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}
  create(createReservationInput: CreateReservationInput) {
    const r = new Reservation();
    r.date = createReservationInput.date;
    r.start_time = createReservationInput.start_time;
    r.end_time = createReservationInput.end_time;
    r.group_id = createReservationInput.group_id;
    r.price = createReservationInput.price;
    // r.rooms = createReservationInput.rooms;
    // r.reserved_materials = createReservationInput.reserved_materials;


    return this.reservationRepository.save(r);
  }

  findAll() {
    return this.reservationRepository.find();
  }

  // findOne(id: string) {
  //   return `This action returns a #${id} reservation`;
  // }

  // update(id: string, updateReservationInput: UpdateReservationInput) {
  //   return `This action updates a #${id} reservation`;
  // }

  // remove(id: string) {
  //   return `This action removes a #${id} reservation`;
  // }
}
