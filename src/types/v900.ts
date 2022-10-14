import type {Result} from './support'

export interface Block {
  header: Header
  transactions: LegacyTransaction[]
  ommers: Header[]
}

export interface Header {
  parentHash: Uint8Array
  ommersHash: Uint8Array
  beneficiary: Uint8Array
  stateRoot: Uint8Array
  transactionsRoot: Uint8Array
  receiptsRoot: Uint8Array
  logsBloom: Uint8Array
  difficulty: bigint[]
  number: bigint[]
  gasLimit: bigint[]
  gasUsed: bigint[]
  timestamp: bigint
  extraData: Uint8Array
  mixHash: Uint8Array
  nonce: Uint8Array
}

export interface LegacyTransaction {
  nonce: bigint[]
  gasPrice: bigint[]
  gasLimit: bigint[]
  action: TransactionAction
  value: bigint[]
  input: Uint8Array
  signature: TransactionSignature
}

export type TransactionAction = TransactionAction_Call | TransactionAction_Create

export interface TransactionAction_Call {
  __kind: 'Call'
  value: Uint8Array
}

export interface TransactionAction_Create {
  __kind: 'Create'
}

export interface TransactionSignature {
  v: bigint
  r: Uint8Array
  s: Uint8Array
}
