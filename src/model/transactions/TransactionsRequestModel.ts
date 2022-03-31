export default class TransactionsRequestModel {
  public logTransactionsId: number = Number()
  public fromUserTokenId: string = String()
  public toUserTokenId: string = String()
  public transactionBlock: string = String()
  public gasPrice: number = Number()
  public logDescription: number = Number()
}