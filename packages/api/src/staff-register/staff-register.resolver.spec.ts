import { Test, TestingModule } from '@nestjs/testing';
import { StaffRegisterResolver } from './staff-register.resolver';
import { StaffRegisterService } from './staff-register.service';

describe('StaffRegisterResolver', () => {
  let resolver: StaffRegisterResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffRegisterResolver, StaffRegisterService],
    }).compile();

    resolver = module.get<StaffRegisterResolver>(StaffRegisterResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
