import { Test, TestingModule } from '@nestjs/testing'
import { StaffResolver } from './staff.resolver'
import { StaffService } from './staff.service'
import { GroupsService } from 'src/groups/groups.service'
import { UsersService } from 'src/users/users.service'
import { UpdateStaffInputStub, createStaffInputStub, staffStub } from './stubs/staff.stub'
import { UserRecord } from 'firebase-admin/auth'
import { Role } from 'src/users/entities/user.entity'

jest.mock('./staff.service')
jest.mock('../groups/groups.service')
const user: UserRecord = {
  uid: '1',
  displayName: 'test',
  email: 'test@test.test',
  emailVerified: true,
  phoneNumber: '123456789',
  photoURL: 'test',
  disabled: false,
  metadata: {
    lastSignInTime: '1',
    creationTime: '1',
    toJSON: jest.fn(),
  },
  providerData: [
    {
      uid: '1',
      displayName: 'test',
      email: 'test@test.test',
      phoneNumber: '123456789',
      photoURL: 'test',
      providerId: '1',
      toJSON: jest.fn(),
    },
  ],
  toJSON: jest.fn(),
}

describe('StaffResolver', () => {
  let resolver: StaffResolver
  let service: StaffService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffResolver,
        StaffService,
        GroupsService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile()

    resolver = module.get<StaffResolver>(StaffResolver)
    service = module.get<StaffService>(StaffService)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  // Test create
  describe('create Staff', () => {
    let myStaffDTO
    let resultStaff

    beforeEach(async () => {
      myStaffDTO = {
        firstName: 'test',
        lastName: 'test',
        email: 'gsfd',
      }
      resultStaff = await resolver.createStaff(createStaffInputStub(), user)
    })

    it('should call the service', () => {
      expect(service.create).toHaveBeenCalled()
    })

    it('should return a staff', () => {
      expect(resultStaff).toEqual(staffStub())
    })
  })

  // Test findAll
  describe('findAll Staff', () => {
    let resultStaff

    beforeEach(async () => {
      resultStaff = await resolver.findAllStaff()
    })

    it('should call the service', () => {
      expect(service.findAll).toHaveBeenCalled()
    })

    it('should return a staff', () => {
      expect(resultStaff).toEqual([staffStub()])
    })
  })

  // Test findOne Staff by uid
  describe('findOne Staff', () => {
    let resultStaff

    beforeEach(async () => {
      resultStaff = await resolver.findOneByUid(user)
    })

    it('should call the service', () => {
      expect(service.findOneByUid).toHaveBeenCalled()
    })

    it('should return a staff', () => {
      expect(resultStaff).toEqual(staffStub())
    })
  })

  // Test findOne
  describe('findOne Staff', () => {
    let resultStaff

    beforeEach(async () => {
      resultStaff = await resolver.findOne('1')
    })

    it('should call the service', () => {
      expect(service.findOne).toHaveBeenCalled()
    })

    it('should return a staff', () => {
      expect(resultStaff).toEqual(staffStub())
    })
  })

  // Test update
  describe('update Staff', () => {
    let resultStaff

    beforeEach(async () => {
      resultStaff = await resolver.update(UpdateStaffInputStub())
    })

    it('should call the service', () => {
      expect(service.update).toHaveBeenCalled()
    })

    it('should return a staff', () => {
      expect(resultStaff).toEqual(staffStub())
    })
  })

  // Test remove
  describe('remove Staff', () => {
    let resultStaff

    beforeEach(async () => {
      resultStaff = await resolver.remove('1')
    })

    it('should call the service', () => {
      expect(service.remove).toHaveBeenCalled()
    })

    it('should return a staff', () => {
      expect(resultStaff).toEqual(staffStub())
    })
  })

  // Test updateProfilePictureUrl
  describe('updateProfilePictureUrl Staff', () => {
    let resultStaff

    beforeEach(async () => {
      resultStaff = await resolver.updateStaffProfilePictureUrl('1', user)
    })

    it('should call the service', () => {
      expect(service.updateProfilePictureUrl).toHaveBeenCalled()
    })

    it('should return a staff', () => {
      expect(resultStaff).toEqual(staffStub())
    })
  })

  // Test updateRole
  describe('updateRole Staff', () => {
    let resultStaff

    beforeEach(async () => {
      resultStaff = await resolver.updateRole('1', Role.SUPER_ADMIN, user)
    })

    it('should call the service', () => {
      expect(service.updateRole).toHaveBeenCalled()
    })

    it('should return a staff', () => {
      expect(resultStaff).toEqual(staffStub())
    })
  })
})
