import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { Service } from '../../service/entities/service.entity'
import { ObjectId } from 'mongodb'

@Entity()
@ObjectType()
export class Stock {
  @ObjectIdColumn()
  @Field(() => ID) // Graphql
  id: string

  @Column()
  @Field() // Graphql
  name: string

  @Column()
  @Field({ nullable: true }) // Graphql
  description: string

  @Column()
  @Field() // Graphql
  needToOrderMore: boolean

  @Column()
  @Field() // Graphql
  amountInStock: number

  @Field(() => Service)
  service: Service

  @Column()
  serviceId: ObjectId

  @Column()
  @Field()
  idealStock: number
}
