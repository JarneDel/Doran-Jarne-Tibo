import { Test, TestingModule } from '@nestjs/testing';
import { RepairRequestService } from './repair-request.service';

describe('RepairRequestService', () => {
  let service: RepairRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepairRequestService],
    }).compile();

    service = module.get<RepairRequestService>(RepairRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
