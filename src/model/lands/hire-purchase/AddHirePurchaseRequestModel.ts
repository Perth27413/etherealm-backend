export default class AddHirePurchaseRequestModel {
  public landTokenId: string = String()
  public period: number = Number()
  public price: number = Number()
  public hash: string = String()
  public startDate: Date = null
  public endDate: Date = null
  public fees: number = Number()
}