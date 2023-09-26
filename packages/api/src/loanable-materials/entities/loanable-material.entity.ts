import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
@ObjectType()
export class LoanableMaterial {
  @ObjectIdColumn()
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  fullname: string;

  @Column()
  @Field()
  category: string;

  @Column()
  @Field()
  url: string;

  @Column()
  @Field({ defaultValue: 0 })
  observations: number;

  @Column()
  @Field({ nullable: true })
  description?: string;
}
