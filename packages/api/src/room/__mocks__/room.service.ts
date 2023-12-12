import { roomStub } from "../stubs/room.stub";


export const RoomService = jest.fn().mockReturnValue({
    create: jest.fn().mockResolvedValue(roomStub()),
    findAll: jest.fn().mockResolvedValue([roomStub()]),
    findOne: jest.fn().mockResolvedValue(roomStub()),
    update: jest.fn().mockResolvedValue(roomStub()),
    remove: jest.fn().mockResolvedValue(roomStub()),
})