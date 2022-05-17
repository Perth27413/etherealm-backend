import { HirePurchase } from "src/entities/hire-purchase.entity";
import { LogTransactions } from "src/entities/log-transactions.entity";
import { User } from "src/entities/user.entity";

export default class AddHirePurchasePaymentRequestModel {
  public hirePurchase: HirePurchase = new HirePurchase
  public logTransactions: LogTransactions = new LogTransactions
  public renter: User = new User
  public price: number = Number()
}