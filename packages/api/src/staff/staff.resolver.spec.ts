import { Test, TestingModule } from '@nestjs/testing';
import { StaffResolver } from './staff.resolver';
import { StaffService } from './staff.service';

describe('StaffResolver', () => {
  let resolver: StaffResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffResolver, StaffService],
    }).compile();

    resolver = module.get<StaffResolver>(StaffResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
