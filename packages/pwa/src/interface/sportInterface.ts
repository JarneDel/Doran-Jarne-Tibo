// Interfaces
export interface Sport {
    id: string;
    name: string;
    description: string;
    CreatedAt?: Date;
    UpdatedAt?: Date;
}

export interface ISport {
    GetSportById: Sport;
}

export interface ISports {
    GetAllSports: Sport[];
}