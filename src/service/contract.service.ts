import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import abi from './abi.json'

@Injectable()
export class ContractService {

  constructor() {
    
  }

  public signer: any = null
  public contract: any = null
  private contractAddress = '0x59c874F99a95Aeb5cB37abBD26dDaCCa77A94B24'
  private provider = new ethers.providers.AlchemyProvider("rinkeby")

  public async getContract(): Promise<void> {
    const tempProvider = new ethers.providers.AlchemyProvider("rinkeby")
    await tempProvider.getBlockNumber()
    // console.log(tempProvider.getSigner())
    // let tempSigner = tempProvider.getSigner()
    // this.signer = tempSigner
    let tempContract = new ethers.Contract(this.contractAddress, abi)
    console.log('-------------------------------------------------------------------')
    console.log(tempContract)
    this.contract = tempContract
  }

  public async getTransaction(tx: string): Promise<ethers.providers.TransactionReceipt> {
    await this.provider.getBlockNumber()
    let receipt = null
    while (true) {
      const result = await this.provider.getTransaction(tx)
      if (result) {
        receipt = await result.wait()
        break
      }
    }
    return receipt
  }

  public async getPointsFromUserTokenId(userTokenId: string): Promise<number> {
    await this.provider.getBlockNumber()
    await this.getContract()
    const points = await this.contract.pointOf(userTokenId)
    console.log(points)
    return points
  }
}