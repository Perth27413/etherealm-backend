import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as abi from './abi.json'

@Injectable()
export class ContractService {

  constructor() {
    this.getContract()
  }

  public signer: any = null
  public contract: any = null
  private contractAddress = '0xE74174C5adE273332E0150a19fc7AC38600D87B7'
  private provider = new ethers.providers.AlchemyProvider("rinkeby")

  public async getContract(): Promise<void> {
    await this.provider.getBlockNumber()
    const tempProvider = new ethers.providers.AlchemyProvider("rinkeby")
    await tempProvider.getBlockNumber()
    let tempContract = new ethers.Contract(this.contractAddress, abi, this.provider)
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
    const points = await this.contract.pointOf(userTokenId)
    return Number(ethers.utils.formatEther(points))
  }

}