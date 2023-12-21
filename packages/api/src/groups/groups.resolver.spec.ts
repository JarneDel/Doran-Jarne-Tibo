import { Test, TestingModule } from '@nestjs/testing'
import { GroupsService } from 'src/groups/groups.service'
import { UsersService } from 'src/users/users.service'
import { StaffService } from 'src/staff/staff.service'
import { GroupsResolver } from './groups.resolver'
import { CreateGroupInput } from './dto/create-group.input'
import { UserRecord } from 'firebase-admin/auth'
import { groupStub } from './stubs/groups.stub'
import { UpdateGroupInput } from './dto/update-group.input'

jest.mock('./groups.service')
jest.mock('../staff/staff.service')
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


describe('GroupsResolver', () => {
  let resolver: GroupsResolver
  let mockGroupsService: GroupsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsResolver,
        GroupsService,
        StaffService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile()

    resolver = module.get<GroupsResolver>(GroupsResolver)
    mockGroupsService = module.get<GroupsService>(GroupsService)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  // Test create
  describe('create Group', () => {
    let myGroupDTO: CreateGroupInput
    let resultGroups

    beforeEach(async () => {
      myGroupDTO = {
        name: 'test',
        profilePictureUrl: 'test',
        email: 'test',
        btwNumber: 'test',
      }
      resultGroups = await resolver.createGroup(myGroupDTO, user)
    })

    it('should call the create method of the GroupsService', () => {
      expect(mockGroupsService.create).toHaveBeenCalledWith("1",myGroupDTO)
    })

    it('should return a group', () => {
      expect(resultGroups).toEqual(groupStub())
    })
  })

  // Test findAll
  describe('findAll', () => {
    let resultGroups

    beforeEach(async () => {
      resultGroups = await resolver.findAll()
    })

    it('should call the findAll method of the GroupsService', () => {
      expect(mockGroupsService.findAll).toHaveBeenCalled()
    })

    it('should return a list of groups', () => {
      expect(resultGroups).toEqual([groupStub()])
    })
  })

  // Test findOne
  describe('findOne', () => {
    let resultGroup

    beforeEach(async () => {
      resultGroup = await resolver.findOne('')
    })

    it('should call the findOne method of the GroupsService', () => {
      expect(mockGroupsService.findOne).toHaveBeenCalledWith('')
    })

    it('should return a group', () => {
      expect(resultGroup).toEqual(groupStub())
    })
  })

  // Test update
  describe('update', () => {
    let myGroupDTO: UpdateGroupInput
    let resultGroups

    beforeEach(async () => {
      myGroupDTO = {
        _id: '',
        name: 'test',
        profilePictureUrl: 'test',
        email: 'test',
        btwNumber: 'test',
        score: 0,

      }
      resultGroups = await resolver.updateGroup(myGroupDTO)
    })

    it('should call the update method of the GroupsService', () => {
      expect(mockGroupsService.update).toHaveBeenCalledWith('', myGroupDTO)
    })

    it('should return a group', () => {
      expect(resultGroups).toEqual(groupStub())
    })
  })

  // Test updateProfilePictureUrl
  describe('updateProfilePictureUrl', () => {
    let resultGroups

    beforeEach(async () => {
      resultGroups = await resolver.updateGroupProfilePictureUrl('', user)
    })

    it('should call the updateProfilePictureUrl method of the GroupsService', () => {
      expect(mockGroupsService.updateProfilePictureUrl).toHaveBeenCalledWith(
        '1',
        '',
      )
    })

    it('should return a group', () => {
      expect(resultGroups).toEqual(groupStub())
    })
  })

  // Test updateScore
  describe('updateScore', () => {
    let resultGroups

    beforeEach(async () => {
      resultGroups = await resolver.updateScore('', 0)
    })

    it('should call the updateScore method of the GroupsService', () => {
      expect(mockGroupsService.updateScore).toHaveBeenCalledWith('', 0)
    })

    it('should return a group', () => {
      expect(resultGroups).toEqual(groupStub())
    })
  })

})
