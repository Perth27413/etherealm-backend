import LogDescriptionModel from "./LogDescriptionModel"

export default class TransactionsResponseModel {
  public logTransactionsId: number = Number()
  public fromUserTokenId: string = String()
  public toUserTokenId: string = String()
  public transactionBlock: string = String()
  public gasPrice: number = Number()
  public logDescription: LogDescriptionModel = new LogDescriptionModel()
}