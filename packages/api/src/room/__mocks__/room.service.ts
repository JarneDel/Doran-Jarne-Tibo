import { roomStub } from "../stubs/room.stub";


export const RoomService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(roomStub()),
  findAll: jest.fn().mockResolvedValue([roomStub()]),
  findOne: jest.fn().mockResolvedValue(roomStub()),
  update: jest.fn().mockResolvedValue(roomStub()),
  remove: jest.fn().mockResolvedValue({
    raw: { acknowledged: true, deletedCount: 1 },
    affected: 1,
  }),
  findAllChangingRooms: jest.fn().mockResolvedValue([roomStub()]),
  findAllGyms: jest.fn().mockResolvedValue([roomStub()]),
  findAllSwimmingPools: jest.fn().mockResolvedValue([roomStub()]),
  findAllWorkRooms: jest.fn().mockResolvedValue([roomStub()]),
  findAllDivePools: jest.fn().mockResolvedValue([roomStub()]),
  findOneById: jest.fn().mockResolvedValue(roomStub()),
})