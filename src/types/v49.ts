import type {Result} from './support'

export interface EthBlock {
  header: EthHeader
  transactions: EthTransaction[]
  ommers: EthHeader[]
}

export interface EthHeader {
  parentHash: Uint8Array
  ommersHash: Uint8Array
  beneficiary: Uint8Array
  stateRoot: Uint8Array
  transactionsRoot: Uint8Array
  receiptsRoot: Uint8Array
  logsBloom: Uint8Array
  difficulty: bigint
  number: bigint
  gasLimit: bigint
  gasUsed: bigint
  timestamp: bigint
  extraData: Uint8Array
  mixMash: Uint8Array
  nonce: Uint8Array
}

export interface EthTransaction {
  nonce: bigint
  gasPrice: bigint
  gasLimit: bigint
  action: EthTransactionAction
  value: bigint
  input: Uint8Array
  signature: EthTransactionSignature
}

export type EthTransactionAction = EthTransactionAction_Call | EthTransactionAction_Create

export interface EthTransactionAction_Call {
  __kind: 'Call'
  value: Uint8Array
}

export interface EthTransactionAction_Create {
  __kind: 'Create'
  value: null
}

export interface EthTransactionSignature {
  v: bigint
  r: Uint8Array
  s: Uint8Array
}
