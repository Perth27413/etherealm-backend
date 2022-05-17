import { HirePurchasePayment } from "src/entities/hire-purchase-payment.entity";
import { HirePurchase } from "src/entities/hire-purchase.entity";

export default class HirePurchaseResponseModel extends HirePurchase {
  public nextPayment: Date = null
  public paymentHistories: Array<HirePurchasePayment> = new Array<HirePurchasePayment>()
}