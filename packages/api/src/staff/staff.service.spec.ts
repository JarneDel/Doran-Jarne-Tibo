import { Test, TestingModule } from '@nestjs/testing'
import { StaffService } from './staff.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Staff } from './entities/staff.entity'
import { createStaffInputStub } from './stubs/staff.stub'

describe('StaffService', () => {
  let service: StaffService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        {
          provide: getRepositoryToken(Staff),
          useValue: {
            findOne: jest.fn().mockResolvedValue(createStaffInputStub()),
            find: jest.fn().mockResolvedValue(createStaffInputStub()),
            save: jest.fn().mockResolvedValue(createStaffInputStub()),
            delete: jest.fn().mockResolvedValue(createStaffInputStub()),
          },
        },
      ],
    }).compile()

    service = module.get<StaffService>(StaffService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a staff member', async () => {
      const staff = await service.create('abc123', createStaffInputStub())
      expect(staff).toEqual(createStaffInputStub())
    })
  })
})
