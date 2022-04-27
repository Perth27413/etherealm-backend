import { OfferLand } from "src/entities/offer-land.entity"

export default class OfferLandPageResponseModel {
  public currentPage: number = Number()
  public pageItem: number = Number()
  public totalPage: number = Number()
  public data: Array<OfferLand> = new Array<OfferLand>()
}