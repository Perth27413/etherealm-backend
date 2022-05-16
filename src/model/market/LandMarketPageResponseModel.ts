import { LandMarket } from "src/entities/land-market.entity"

export default class LandMarketPageResponseModel {
  public currentPage: number = Number()
  public pageItem: number = Number()
  public totalPage: number = Number()
  public data: Array<LandMarket> = new Array<LandMarket>()
}