import { Land } from "src/entities/land.entity";
import { PeriodType } from "src/entities/period-type.entity";
import { RentLand } from "src/entities/rent-land.entity";
import { RentPayment } from "src/entities/rent-payment.entity";
import { RentType } from "src/entities/rent-type.entity";
import { User } from "src/entities/user.entity";
import LandResponseModel from "../lands/LandResponseModel";

export default class RentLandDetailsResponseModel {
  public rentId: number = Number()
  public landTokenId: LandResponseModel = new LandResponseModel()
  public rentType: RentType = new RentType()
  public periodType: PeriodType = new PeriodType()
  public period: number = Number()
  public price: number = Number()
  public fees: number = Number()
  public createAt: Date = new Date()
  public updatedAt: Date = new Date()
  public startDate: Date = new Date()
  public endDate: Date = new Date()
  public lastPayment: Date = new Date()
  public isDelete: boolean = Boolean()
  public renterTokenId: User = new User()
  public nextPayment: Date | null = null
  public paymentHistories: Array<RentPayment> = new Array<RentPayment>()
}