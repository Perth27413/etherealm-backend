import { RentLand } from "src/entities/rent-land.entity";
import { RentPayment } from "src/entities/rent-payment.entity";

export default class RentLandDetailsResponseModel extends RentLand {
  public nextPayment: Date | null = null
  public paymentHistories: Array<RentPayment> = new Array<RentPayment>()
}