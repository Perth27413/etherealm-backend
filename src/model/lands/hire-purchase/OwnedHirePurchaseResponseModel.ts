import { User } from "src/entities/user.entity";
import LandResponseModel from "../LandResponseModel";

export default class OwnedHirePurchaseResponseModel {
  public landTokenId: LandResponseModel = new LandResponseModel
  public hirePurchaseId: number = Number()
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
}