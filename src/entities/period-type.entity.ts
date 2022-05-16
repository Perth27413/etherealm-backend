import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "period_type"})
export class PeriodType {

  @PrimaryGeneratedColumn({name: 'period_type_id'})
  periodTypeId: number

  @Column({name: 'period_type_text'})
  periodTypeText: string

}