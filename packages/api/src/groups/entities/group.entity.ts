import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn, UpdateDateColumn } from 'typeorm';
import { number } from 'yargs';
import { User } from '../../users/entities/user.entity';

@Entity()
@ObjectType()
export class Group extends User {

  @Column()
  @Field()
  name: string

  @Field()
  @Column()
  email: string

  @Column()
  @Field({ nullable: true })
  btwNumber: string

  @Column()
  @Field({ defaultValue: 50 , nullable: false})
  score: number

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date
}
