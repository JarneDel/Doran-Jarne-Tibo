import { reservationStub } from "../stubs/reservation.stub";

export const ReservationService = jest.fn().mockReturnValue({
    create: jest.fn().mockResolvedValue(reservationStub()),
    findAll: jest.fn().mockResolvedValue([reservationStub()]),
    findOne: jest.fn().mockResolvedValue(reservationStub()),
    update: jest.fn().mockResolvedValue(reservationStub()),
    remove: jest.fn().mockResolvedValue(reservationStub()),
    findByDate: jest.fn().mockResolvedValue([reservationStub()]),
    findByDateAndUser: jest.fn().mockResolvedValue([reservationStub()]),
    cancelReservation: jest.fn().mockResolvedValue(reservationStub()),
})