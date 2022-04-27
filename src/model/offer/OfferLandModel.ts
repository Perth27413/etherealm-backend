export default class OfferLandModel {
  public offerId: number = Number()
  public fromUserTokenId: string = String()
  public landTokenId: string = String()
  public offerPrice: number = Number()
  public isEnoughPoint: boolean = Boolean()
  public createAt: Date = new Date()
  public updatedAt: Date = new Date()
  public isDelete: boolean = Boolean()
}