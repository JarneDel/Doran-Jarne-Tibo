import { Test, TestingModule } from '@nestjs/testing';
import { SportResolver } from './sport.resolver';
import { SportService } from './sport.service';
import { GroupsService } from 'src/groups/groups.service'
import { UsersService } from 'src/users/users.service'
import { StaffService } from 'src/staff/staff.service'
import { sportStub } from './stubs/sport.stub';
import { CreateSportInput } from './dto/create-sport.input';
import { UpdateSportInput } from './dto/update-sport.input';

jest.mock('./sport.service');
jest.mock('../groups/groups.service')
jest.mock('../staff/staff.service')

describe('SportResolver', () => {
  let resolver: SportResolver;
  let service: SportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SportResolver,
        SportService,
        StaffService,
        GroupsService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile()

    resolver = module.get<SportResolver>(SportResolver);
    service = module.get<SportService>(SportService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // Test create
  describe('create Sport', () => {
    let mySportDTO: CreateSportInput
    let resultSports

    beforeEach(async () => {
      mySportDTO = {
        name: 'sport',
        description: 'sport description',
      }
      resultSports = await resolver.createSport(mySportDTO)
    })

    it('should call the create method of the SportService', () => {
      expect(service.create).toHaveBeenCalledWith(mySportDTO)
    })

    it('should return a sport', () => {
      expect(resultSports).toEqual(sportStub())
    })
  })

  // Test findAll
  describe('findAll Sports', () => {
    let resultSports

    beforeEach(async () => {
      resultSports = await resolver.findAll()
    })

    it('should call the findAll method of the SportService', () => {
      expect(service.findAll).toHaveBeenCalled()
    })

    it('should return an array of sports', () => {
      expect(resultSports).toEqual([sportStub()])
    })
  })

  // Test findOneById
  describe('findOne', () => {
    let resultSports

    beforeEach(async () => {
      resultSports = await resolver.findOne('656a1085a90f2e4962ae915a')
    })

    it('should call the findOneById method of the SportService', () => {
      expect(service.findOneById).toHaveBeenCalledWith('656a1085a90f2e4962ae915a')
    })

    it('should return a sport', () => {
      expect(resultSports).toEqual(sportStub())
    })
  })

  // Test update
  describe('update Sport', () => {
    let mySportDTO: UpdateSportInput
    let resultSports

    beforeEach(async () => {
      mySportDTO = {
        id: '656a1085a90f2e4962ae915a',
        name: 'sport',
        description: 'sport description',
      }
      resultSports = await resolver.updateSport(mySportDTO)
    })

    it('should call the update method of the SportService', () => {
      expect(service.update).toHaveBeenCalledWith('656a1085a90f2e4962ae915a', mySportDTO)
    })

    it('should return a sport', () => {
      expect(resultSports).toEqual(sportStub())
    })
  })

  // Test remove
  describe('remove Sport', () => {
    let resultSports

    beforeEach(async () => {
      resultSports = await resolver.removeSportById('656a1085a90f2e4962ae915a')
    })

    it('should call the remove method of the SportService', () => {
      expect(service.remove).toHaveBeenCalledWith('656a1085a90f2e4962ae915a')
    })

    it('should return a sport', () => {
      expect(resultSports).toEqual(
        'Deleted sport with id: 656a1085a90f2e4962ae915a succesfully',
      )
    })
  })
});
