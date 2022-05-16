export default class AddRentPaymentRequestModel {
  public rentId: number = Number()
  public logTransactionId: number = Number()
  public price: number = Number()
  public renterTokenId: string = String()
}