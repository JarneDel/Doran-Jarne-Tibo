import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createGroupInputStub, groupStub, updateGroupInputStub } from './stubs/groups.stub';

describe('GroupsService', () => {
  let service: GroupsService;
  let mockRepository: Repository<Group>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: getRepositoryToken(Group),
          useValue: {
            save: jest.fn().mockResolvedValue(groupStub()),
            find: jest.fn().mockResolvedValue([groupStub()]),
            findOneByOrFail: jest.fn().mockResolvedValue(groupStub()),
            findOne: jest.fn().mockResolvedValue(groupStub()),
            update: jest.fn().mockResolvedValue(null),
            merge: jest.fn().mockResolvedValue(groupStub()),
          },
        },
      ],
    }).compile()

    service = module.get<GroupsService>(GroupsService);
    mockRepository = module.get<Repository<Group>>(
      getRepositoryToken(Group)
    )
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a group', async () => {
      const group = await service.create('',createGroupInputStub())
      expect(group).toEqual(groupStub());
    });
  });

  describe('findAll', () => {
    it('should return an array of groups', async () => {
      const groups = await service.findAll()
      expect(groups).toEqual([groupStub()]);
    });
  });

  describe('findOne', () => {
    it('should return a group', async () => {
      const group = await service.findOne('656a1085a90f2e4962ae915a')
      expect(group).toEqual(groupStub());
    });
  });

  describe('findOneByUid', () => {
    it('should return a group', async () => {
      const group = await service.findOneByUid('abc123')
      expect(group).toEqual(groupStub());
    });
  });

  describe('update', () => {
    it('should update a group', async () => {
      const group = await service.update(
        '656a1085a90f2e4962ae915a',
        updateGroupInputStub(),
      )
      expect(group).toEqual(groupStub());
    });
  });

  describe('updateScore', () => {
    it('should update a group score', async () => {
      const group = await service.updateScore(
        '656a1085a90f2e4962ae915a',
        50,
      )
      expect(group).toEqual(groupStub());
    });
  });

  describe('updateProfilePictureUrl', () => {
    it('should update a group profile picture url', async () => {
      const group = await service.updateProfilePictureUrl(
        'abc123',
        'https://www.google.com',
      )
      expect(group).toEqual(groupStub());
    });
  });
});
