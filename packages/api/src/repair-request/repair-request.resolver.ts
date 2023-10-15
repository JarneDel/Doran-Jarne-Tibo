import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RepairRequestService } from './repair-request.service';
import { RepairRequest } from './entities/repair-request.entity';
import { CreateRepairRequestInput } from './dto/create-repair-request.input';
import { UpdateRepairRequestInput } from './dto/update-repair-request.input';

@Resolver(() => RepairRequest)
export class RepairRequestResolver {
  constructor(private readonly repairRequestService: RepairRequestService) {}

  @Mutation(() => RepairRequest)
  createRepairRequest(@Args('createRepairRequestInput') createRepairRequestInput: CreateRepairRequestInput) {
    return this.repairRequestService.create(createRepairRequestInput);
  }

  @Query(() => [RepairRequest], { name: 'repairRequest' })
  findAll() {
    return this.repairRequestService.findAll();
  }

  @Query(() => RepairRequest, { name: 'repairRequest' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.repairRequestService.findOne(id);
  }

  @Mutation(() => RepairRequest)
  updateRepairRequest(@Args('updateRepairRequestInput') updateRepairRequestInput: UpdateRepairRequestInput) {
    return this.repairRequestService.update(updateRepairRequestInput.id, updateRepairRequestInput);
  }

  @Mutation(() => RepairRequest)
  removeRepairRequest(@Args('id', { type: () => Int }) id: number) {
    return this.repairRequestService.remove(id);
  }
}
