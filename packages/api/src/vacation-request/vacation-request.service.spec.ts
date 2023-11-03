import { Test, TestingModule } from '@nestjs/testing';
import { VacationRequestService } from './vacation-request.service';

describe('VacationRequestService', () => {
  let service: VacationRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VacationRequestService],
    }).compile();

    service = module.get<VacationRequestService>(VacationRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
