import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { Land } from "./land.entity";
import { User } from "./user.entity";

@Entity({name: "hire_purchase"})
export class HirePurchase {

  @PrimaryGeneratedColumn({name: 'hire_purchase_id'})
  hirePurchaseId: number

  @ManyToOne(() => Land, land => land.landTokenId)
  @JoinColumn({name: 'land_token_id'})
  landTokenId: Land

  @ManyToOne(() => User, user => user.userTokenId)
  @JoinColumn({name: 'renter_token_id'})
  renterTokenId: User

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

}