import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { RentLand } from "./rent-land.entity";
import { LogTransactions } from "./log-transactions.entity";
import { HirePurchase } from "./hire-purchase.entity";
import { User } from "./user.entity";

@Entity({name: "hire_purchase_payment"})
export class HirePurchasePayment {

  @PrimaryGeneratedColumn({name: 'hire_purchase_payment_id'})
  hirePurchasePaymentId: number

  @ManyToOne(() => HirePurchase, hirePurchase => hirePurchase.hirePurchaseId)
  @JoinColumn({name: 'hire_purchase_id'})
  hirePurchaseId: HirePurchase

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