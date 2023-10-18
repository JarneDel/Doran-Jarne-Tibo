import { Injectable } from '@nestjs/common';
import { CreateReservationInput } from './dto/create-reservation.input';
import { UpdateReservationInput } from './dto/update-reservation.input';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ObjectId } from 'mongodb'

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}
  create(createReservationInput: CreateReservationInput) {
    const r = new Reservation()
    r.date = createReservationInput.date
    r.start_time = createReservationInput.start_time
    r.end_time = createReservationInput.end_time
    r.groupId = createReservationInput.group_id
    r.price = createReservationInput.price
    r.rooms = createReservationInput.rooms
    r.reserved_materials = createReservationInput.reserved_materials
    r.isCancelled = false
    // r.rooms = createReservationInput.rooms;
    // r.reserved_materials = createReservationInput.reserved_materials;

    return this.reservationRepository.save(r)
  }

  findAll() {
    return this.reservationRepository.find()
  }

  findOne(id: string) {
    //@ts-ignore
    return this.reservationRepository.findOneByOrFail({ _id: new ObjectId(id) })
  }

  findByDate(date: Date) {
    return this.reservationRepository.find({ where: { date: date } })
  }

  async update(id: string, updateReservationInput: UpdateReservationInput) {
    let r = await this.findOne(id)
    r.date = updateReservationInput.date
    r.start_time = updateReservationInput.start_time
    r.end_time = updateReservationInput.end_time
    r.groupId = updateReservationInput.group_id
    r.price = updateReservationInput.price
    r.rooms = updateReservationInput.rooms
    r.reserved_materials = updateReservationInput.reserved_materials
    r.isCancelled = updateReservationInput.isCancelled
    // r.rooms = updateReservationInput.rooms;
    // r.reserved_materials = updateReservationInput.reserved_materials;
    return this.reservationRepository.save(r)
  }

  saveAll(services: Reservation[]): Promise<Reservation[]> {
    return this.reservationRepository.save(services)
  }

  truncate() {
    return this.reservationRepository.clear()
  }

  delete(id: string) {
    return this.reservationRepository.delete(id)
  }

  // remove(id: string) {
  //   return `This action removes a #${id} reservation`;
  // }
}
