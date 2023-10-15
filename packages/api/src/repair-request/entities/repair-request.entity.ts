// Graphql
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity';
// Entities
import { Room } from 'src/room/entities/room.entity';
// Typeorm
import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from "typeorm";

@Entity()
@ObjectType()
export class RepairRequest {
  @ObjectIdColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  UID: string;

  @Column()
  @Field({ nullable: true })
  description?: string;

  @Column()
  @Field(() => [String], { nullable: true })
  room: Room;

  @Column()
  @Field(() => [String], { nullable: true })
  loanableMaterial: LoanableMaterial;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date
}
