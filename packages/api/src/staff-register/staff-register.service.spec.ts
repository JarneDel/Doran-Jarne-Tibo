import { Test, TestingModule } from '@nestjs/testing';
import { StaffRegisterService } from './staff-register.service';

describe('StaffRegisterService', () => {
  let service: StaffRegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffRegisterService],
    }).compile();

    service = module.get<StaffRegisterService>(StaffRegisterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
