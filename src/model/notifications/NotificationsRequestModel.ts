export default class NotificationsRequestModel {
  public ownerTokenId: string = String()
  public fromUserTokenId: string = String()
  public activityId: number = Number()
  public price: number = Number()
  public landTokenId: string = String()
  public dateTime: Date = new Date()
}