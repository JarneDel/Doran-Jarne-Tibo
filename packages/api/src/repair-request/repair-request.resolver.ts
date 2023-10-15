// Common
import { UseGuards } from '@nestjs/common'
// Graphql
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// Services
import { RepairRequestService } from './repair-request.service';
// Entities
import { RepairRequest } from './entities/repair-request.entity';
// Inputs
import { CreateRepairRequestInput } from './dto/create-repair-request.input';
import { UpdateRepairRequestInput } from './dto/update-repair-request.input';
// Auth
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { AllowedRoles } from '../users/decorators/role.decorator'

@Resolver(() => RepairRequest)
export class RepairRequestResolver {
  constructor(private readonly repairRequestService: RepairRequestService) {}

  @UseGuards(FirebaseGuard)
  @Mutation(() => RepairRequest)
  createRepairRequest(@Args('createRepairRequestInput') createRepairRequestInput: CreateRepairRequestInput) {
    return this.repairRequestService.create(createRepairRequestInput);
  }

  @UseGuards(FirebaseGuard)
  @Query(() => [RepairRequest], { name: 'GetAllRepairRequests' })
  findAll() {
    return this.repairRequestService.findAll();
  }

  @UseGuards(FirebaseGuard)
  @Query(() => RepairRequest, { name: 'GetRepairRequestById' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.repairRequestService.findOneById(id);
  }

  @UseGuards(FirebaseGuard)
  @Mutation(() => RepairRequest)
  updateRepairRequest(@Args('updateRepairRequestInput') updateRepairRequestInput: UpdateRepairRequestInput) {
    return this.repairRequestService.update(updateRepairRequestInput.id, updateRepairRequestInput);
  }

  @UseGuards(FirebaseGuard)
  @Mutation(() => RepairRequest)
  removeRepairRequest(@Args('id', { type: () => String }) id: string) {
    return this.repairRequestService.remove(id).then((res) => {
      const obj = JSON.parse(JSON.stringify(res))
      if(obj.raw.deletedCount > 0){
        return 'Deleted repair request with id: ' + id + 'successfully'
      } else{
        return 'No room with id: ' + id + ' found'
      }
    }).catch((err) => {
      console.log(err)
      return 'Error'
    })
  }
}
