import assert from 'assert'
import {Block, Chain, ChainContext, BlockContext, Result} from './support'
import * as v49 from './v49'
import * as v900 from './v900'
import * as v1201 from './v1201'

export class EthereumCurrentBlockStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The current Ethereum block.
   */
  get isV49() {
    return this._chain.getStorageItemTypeHash('Ethereum', 'CurrentBlock') === '7b797457e46dc3169a6dccd22ee2edc1e6db93aa21ac3fb94e7ce182c7ab6573'
  }

  /**
   *  The current Ethereum block.
   */
  async getAsV49(): Promise<v49.EthBlock | undefined> {
    assert(this.isV49)
    return this._chain.getStorage(this.blockHash, 'Ethereum', 'CurrentBlock')
  }

  /**
   *  The current Ethereum block.
   */
  get isV900() {
    return this._chain.getStorageItemTypeHash('Ethereum', 'CurrentBlock') === 'e00016e7c205d86f63b4d834cdabba952e20551788d0a57067012bbd8d3b5385'
  }

  /**
   *  The current Ethereum block.
   */
  async getAsV900(): Promise<v900.Block | undefined> {
    assert(this.isV900)
    return this._chain.getStorage(this.blockHash, 'Ethereum', 'CurrentBlock')
  }

  /**
   *  The current Ethereum block.
   */
  get isV1201() {
    return this._chain.getStorageItemTypeHash('Ethereum', 'CurrentBlock') === '557f002e64a7a02acc455da7da6fbb5ef3003df67793ab8f9702bcda6d0a72be'
  }

  /**
   *  The current Ethereum block.
   */
  async getAsV1201(): Promise<v1201.Block | undefined> {
    assert(this.isV1201)
    return this._chain.getStorage(this.blockHash, 'Ethereum', 'CurrentBlock')
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Ethereum', 'CurrentBlock') != null
  }
}
