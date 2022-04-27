import { LogType } from "src/entities/log-type.entity"
import LogDescriptionModel from "./LogDescriptionModel"

export default class TransactionsResponseModel {
  public logTransactionsId: number = Number()
  public fromUserTokenId: string = String()
  public toUserTokenId: string = String()
  public transactionBlock: string = String()
  public gasPrice: number = Number()
  public logType: LogType = new LogType
  public createdAt: string = String()
}