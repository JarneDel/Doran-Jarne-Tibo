import { Room } from "./roomInterface"
import { RequestUser } from "./requestUserInterface"
import { Sport } from "./sportInterface"

export interface material {
    id: string
    name: string
    totalAmount: number
    wantedAmount: number
    price: number
    sports: Sport[]
    isComplete: boolean
    description: string
    amountReserved:number
    createdAt: Date,
    updatedAt: Date,
  }

export interface RepairRequest {
    id: string;
    title: string;
    requestUser: RequestUser;
    description: string;
    urgency: number;
    room: Room[];
    loanableMaterial: material[];
    isRepaired: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUpdateRepairRequest {
  id: string;
  title: string;
  description: string;
  urgency: number;
  requestUser: RequestUser;
  room: Room[];
  loanableMaterial: material[];
  isRepaired: boolean;
}