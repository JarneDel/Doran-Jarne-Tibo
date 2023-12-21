import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Test, TestingModule } from '@nestjs/testing';

import { RoomService } from './room.service';

import { Room } from './entities/room.entity';
import { roomStub, updateRoomInputStub } from './stubs/room.stub';



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
            update: jest.fn().mockResolvedValue(roomStub()),
            delete: jest.fn().mockResolvedValue(roomStub()),
            findOne: jest.fn().mockResolvedValue([roomStub()]),


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

  // Test create
  describe('create Room', () => {
    it('should create a room', async () => {
      const room = await service.create(roomStub());
      expect(room).toEqual(roomStub());
    });
  });

  // Test findAll
  describe('findAll Room', () => {
    it('should return an array of rooms', async () => {
      const rooms = await service.findAll();
      expect(rooms).toEqual([roomStub()]);
    });
  });

  // Test findByIds
  describe('findByIds Room', () => {
    it('should return an array of rooms', async () => {
      const rooms = await service.findByIds(['656a1085a90f2e4962ae915a'])
      expect(rooms).toEqual([roomStub()]);
    });
  });

  // Test findOneById
  describe('findOneById Room', () => {
    it('should return a room', async () => {
      const room = await service.findOneById('656a1085a90f2e4962ae915a')
      expect(room).toEqual([roomStub()]);
    });
  });

  // Test update
  describe('update Room', () => {
    it('should update a room', async () => {
      const room = await service.update(
        '656a1085a90f2e4962ae915a',
        updateRoomInputStub(),
      )
      expect(room).toEqual(roomStub());
    });
  });

  // Test remove
  describe('remove Room', () => {
    it('should remove a room', async () => {
      const room = await service.remove('1');
      expect(room).toEqual(roomStub());
    });
  });


});
