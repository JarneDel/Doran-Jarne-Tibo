import { Test, TestingModule } from '@nestjs/testing'
import { StaffService } from './staff.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Staff } from './entities/staff.entity'
import { UpdateStaffInputStub, createStaffInputStub, staffStub } from './stubs/staff.stub'

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
            update: jest.fn().mockResolvedValue(createStaffInputStub()),
            findOneByOrFail: jest.fn().mockResolvedValue(createStaffInputStub()),
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

  describe('findAll', () => {
    it('should return an array of staff members', async () => {
      const staff = await service.findAll()
      expect(staff).toEqual(createStaffInputStub())
    })
  })

  describe('findOne', () => {
    it('should return a staff member', async () => {
      const staff = await service.findOne('656a1085a90f2e4962ae915a')
      expect(staff).toEqual(createStaffInputStub())
    })
  })

  describe('update', () => {
    it('should update a staff member', async () => {
      const staff = await service.update(
        '656a1085a90f2e4962ae915a',
        UpdateStaffInputStub(),
      )
      expect(staff).toEqual(createStaffInputStub())
    })
  })

  describe('remove', () => {
    it('should delete a staff member', async () => {
      const staff = await service.remove('656a1085a90f2e4962ae915a')
      expect(staff).toEqual('This action removes a #656a1085a90f2e4962ae915a staff')
    })
  })

  describe('findByUIDs', () => {
    it('should return an array of staff members', async () => {
      const staff = await service.findByUIDs(['656a1085a90f2e4962ae915a'])
      expect(staff).toEqual(createStaffInputStub())
    })
  })

  describe('find', () => {
    it('should return an array of staff members', async () => {
      const staff = await service.find(['656a1085a90f2e4962ae915a'])
      expect(staff).toEqual(createStaffInputStub())
    })
  })

  describe('createFromStaffRegister', () => {
    it('should create a staff member', async () => {
      const staff = await service.createFromStaffRegister(staffStub())
      expect(staff).toEqual(createStaffInputStub()  )
    })
  })
  
})
