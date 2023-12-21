import { Sport } from "../entities/sport.entity"
import { CreateSportInput } from "../dto/create-sport.input"
import { UpdateSportInput } from "../dto/update-sport.input"

export const sportStub = ():Sport =>{
  const sport = new Sport()
  sport.id = '656a1085a90f2e4962ae915a'
  sport.name = 'sport'
  sport.description = 'sport'
  sport.createdAt = new Date('2023-12-07T15:04:51.996Z')
  sport.updatedAt = new Date('2023-12-07T15:04:51.996Z')
  return sport
}

export const createSportStub = ():CreateSportInput =>{
  const sport = new CreateSportInput()
  sport.name = 'sport'
  sport.description = 'sport'
  return sport
};

export const updateSportStub = ():UpdateSportInput =>{
  const sport = new UpdateSportInput()
  sport.id = '656a1085a90f2e4962ae915a'
  sport.name = 'sport'
  sport.description = 'sport'
  return sport
};
