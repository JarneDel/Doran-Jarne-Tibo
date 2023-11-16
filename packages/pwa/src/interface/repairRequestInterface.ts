import { Room } from "./roomInterface"
import { RequestUser } from "./requestUserInterface"
import { material } from "./materialInterface"

export interface RepairRequest {
    id: string;
    requestUser: RequestUser;
    description: string;
    room: Room;
    loanableMaterial: material;
    isRepaired: boolean;
}