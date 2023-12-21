import { Test, TestingModule } from '@nestjs/testing';
import { LoanableMaterialsResolver } from './loanable-materials.resolver';
import { LoanableMaterialsService } from './loanable-materials.service';
import { SportService } from 'src/sport/sport.service';
import { GroupsService } from 'src/groups/groups.service'
import { UsersService } from 'src/users/users.service'
import { StaffService } from 'src/staff/staff.service'
import { loanableMaterialStub } from './stubs/loanable-materials.stub';

jest.mock('./loanable-materials.service');
jest.mock('../sport/sport.service');
jest.mock('../groups/groups.service')
jest.mock('../staff/staff.service')


describe('LoanableMaterialsResolver', () => {
  let resolver: LoanableMaterialsResolver;
  let service: LoanableMaterialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanableMaterialsResolver,
        LoanableMaterialsService,
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

    resolver = module.get<LoanableMaterialsResolver>(LoanableMaterialsResolver);
    service = module.get<LoanableMaterialsService>(LoanableMaterialsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // Test create
  describe('create LoanableMaterial', () => {
    let myLoanableMaterialDTO;
    let resultLoanableMaterial;

    beforeEach(async () => {
      myLoanableMaterialDTO = {
        name: 'test',
        sportId: '1',
        quantity: 1,
        price: 0,
      };
      resultLoanableMaterial = await resolver.createLoanableMaterial(myLoanableMaterialDTO);
    });

    it('should call the service', () => {
      expect(service.create).toHaveBeenCalledWith(myLoanableMaterialDTO);
    });

    it('should return a LoanableMaterial', () => {
      expect(resultLoanableMaterial).toEqual(loanableMaterialStub());
    });
  });

  // Test findAll
  describe('findAll LoanableMaterials', () => {
    let resultLoanableMaterials;

    beforeEach(async () => {
      resultLoanableMaterials = await resolver.findAll();
    });

    it('should call the service', () => {
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return an array of LoanableMaterials', () => {
      expect(resultLoanableMaterials).toEqual([loanableMaterialStub()]);
    });
  });

  // Test findOneById
  describe('findOneById LoanableMaterial', () => {
    let resultLoanableMaterial;

    beforeEach(async () => {
      resultLoanableMaterial = await resolver.findOneById('1');
    });

    it('should call the service', () => {
      expect(service.findOneById).toHaveBeenCalledWith('1');
    });

    it('should return a LoanableMaterial', () => {
      expect(resultLoanableMaterial).toEqual(loanableMaterialStub());
    });
  });

  // Test update
  describe('update LoanableMaterial', () => {
    let myLoanableMaterialDTO;
    let resultLoanableMaterial;

    beforeEach(async () => {
      myLoanableMaterialDTO = {
        name: 'test',
        sportId: '1',
        quantity: 1,
        price: 0,
      };
      resultLoanableMaterial = await resolver.updateLoanableMaterial(myLoanableMaterialDTO);
    });

    it('should call the service', () => {
      expect(service.update).toHaveBeenCalledWith(myLoanableMaterialDTO._id, myLoanableMaterialDTO);
    });

    it('should return a LoanableMaterial', () => {
      expect(resultLoanableMaterial).toEqual(loanableMaterialStub());
    });
  });

  // Test remove
  describe('remove LoanableMaterial', () => {
    let resultLoanableMaterial;

    beforeEach(async () => {
      resultLoanableMaterial = await resolver.removeLoanableMaterialById('1');
    });

    it('should call the service', () => {
      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('should return a string', () => {
      expect(resultLoanableMaterial).toEqual('Deleted room with id: 1 succesfully');
    });
  });
});
