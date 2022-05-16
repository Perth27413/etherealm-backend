import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { RentLand } from "./rent-land.entity";
import { LogTransactions } from "./log-transactions.entity";
import { User } from "./user.entity";

@Entity({name: "rent_payment"})
export class RentPayment {

  @PrimaryGeneratedColumn({name: 'rent_payment_id'})
  rentPaymentId: number

  @ManyToOne(() => RentLand, rentLand => rentLand.rentId)
  @JoinColumn({name: 'rent_id'})
  rentId: RentLand

  @ManyToOne(() => LogTransactions, logTransactions => logTransactions.logTransactionsId)
  @JoinColumn({name: 'log_transactions_id'})
  logTransactionsId: LogTransactions

  @ManyToOne(() => User, user => user.userTokenId)
  @JoinColumn({name: 'renter_token_id'})
  renterTokenId: User

  @Column({name: 'price'})
  price: number

  @Column({name: 'fees'})
  fees: number

  @Column({name: 'created_at'})
  createAt: Date

  @Column({name: 'updated_at'})
  updatedAt: Date

}