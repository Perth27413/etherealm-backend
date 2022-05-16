import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./user.entity";
import { Land } from "./land.entity";
import { RentType } from "./rent-type.entity";
import { PeriodType } from "./period-type.entity";

@Entity({name: "rent_land"})
export class RentLand {

  @PrimaryGeneratedColumn({name: 'rent_id'})
  rentId: number

  @ManyToOne(() => Land, land => land.landTokenId)
  @JoinColumn({name: 'land_token_id'})
  landTokenId: Land

  @ManyToOne(() => RentType, rentType => rentType.rentTypeId)
  @JoinColumn({name: 'rent_type'})
  rentType: RentType

  @ManyToOne(() => PeriodType, periodType => periodType.periodTypeId)
  @JoinColumn({name: 'period_type'})
  periodType: PeriodType

  @Column({name: 'period'})
  period: number

  @Column({name: 'price'})
  price: number

  @Column({name: 'fees'})
  fees: number

  @Column({name: 'created_at'})
  createAt: Date

  @Column({name: 'updated_at'})
  updatedAt: Date

  @Column({name: 'start_date'})
  startDate: Date

  @Column({name: 'end_date'})
  endDate: Date

  @Column({name: 'last_payment'})
  lastPayment: Date

  @Column({name: 'is_delete'})
  isDelete: boolean

  @ManyToOne(() => User, user => user.userTokenId)
  @JoinColumn({name: 'renter_token_id'})
  renterTokenId: User

}