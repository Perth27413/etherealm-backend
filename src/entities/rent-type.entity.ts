import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "rent_type"})
export class RentType {

  @PrimaryGeneratedColumn({name: 'rent_type_id'})
  rentTypeId: number

  @Column({name: 'rent_type_text'})
  rentTypeText: string

}