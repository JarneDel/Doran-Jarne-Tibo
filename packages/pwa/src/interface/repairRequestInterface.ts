import { Room } from "./roomInterface"
import { RequestUser } from "./requestUserInterface"

export interface material {
    id: string
    name: string
    totalAmount: number
    wantedAmount: number
    price: number
    sports: [{ id: string; name: string; createdAt: Date; updatedAt: Date }]
    isComplete: boolean
    description: string
    amountReserved:number
  }

export interface RepairRequest {
    id: string;
    title: string;
    requestUser: RequestUser;
    description: string;
    urgency: number;
    room: Room;
    loanableMaterial: material;
    isRepaired: boolean;
    createdAt: Date;
    updatedAt: Date;
}