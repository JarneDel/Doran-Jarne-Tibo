import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { Repository } from 'typeorm'

describe('ReservationService', () => {
  let service: ReservationService;
  let mockRepository: Repository<Reservation>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationService],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
