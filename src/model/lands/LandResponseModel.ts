import { LandSize } from "src/entities/land-size.entity"
import { LandStatus } from "src/entities/land-status.entity"
import { OfferLand } from "src/entities/offer-land.entity"
import CoordinatesModel from "./CoordinatesModel"

export default class LandResponseModel {
  public landTokenId: string = String()
  public landName: string = String()
  public landDescription: string = String()
  public landOwnerTokenId: string = String()
  public landLocation: CoordinatesModel = new CoordinatesModel()
  public landPosition: CoordinatesModel = new CoordinatesModel()
  public landAssets: string = String()
  public onRecommend: boolean = Boolean()
  public landStatus: LandStatus = new LandStatus
  public landSize: LandSize = new LandSize
  public price: number | null = null
  public minimumOfferPrice: number = Number()
  public bestOffer: OfferLand = new OfferLand
}