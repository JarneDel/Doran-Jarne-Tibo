import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Test, TestingModule } from '@nestjs/testing';

import { RoomService } from './room.service';

import { Room } from './entities/room.entity';
import { roomStub } from './stubs/room.stub';



describe('RoomService', () => {
  let service: RoomService;
  let mockRepository: Repository<Room>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService,
        {
          provide: getRepositoryToken(Room),
          useValue: {
            save: jest.fn().mockResolvedValue(roomStub()),
            find: jest.fn().mockResolvedValue([roomStub()]),
            findOneByOrFail: jest.fn().mockResolvedValue(roomStub()),

          },
        },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
    mockRepository = module.get<Repository<Room>>(
      getRepositoryToken(Room)
    )
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
