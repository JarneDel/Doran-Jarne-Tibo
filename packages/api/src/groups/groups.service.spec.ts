import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { groupStub } from './stubs/groups.stub';

describe('GroupsService', () => {
  let service: GroupsService;
  let mockRepository: Repository<Group>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsService,
        {
          provide: getRepositoryToken(Group),
          useValue: {
            save: jest.fn().mockResolvedValue(groupStub()),
            find: jest.fn().mockResolvedValue([groupStub()]),
            findOneByOrFail: jest.fn().mockResolvedValue(groupStub()),
          },
        },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    mockRepository = module.get<Repository<Group>>(
      getRepositoryToken(Group)
    )
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
