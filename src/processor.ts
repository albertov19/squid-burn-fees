import { Store, TypeormDatabase } from '@subsquid/typeorm-store';
import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
  toHex,
} from '@subsquid/substrate-processor';
import { lookupArchive } from '@subsquid/archive-registry';
import { BurnData } from './model';
import { BalancesDepositEvent } from './types/events';
import { EthereumCurrentBlockStorage } from './types/storage';

const processor = new SubstrateBatchProcessor()
  .setBatchSize(500)
  .setDataSource({
    archive: lookupArchive('moonbeam', { release: 'FireSquid' }),
    chain: 'wss://wss.api.moonbeam.network',
  })
  .addEvent('Balances.Deposit');

//processor.setBlockRange({ from: 1400000, to: 2080000 });
processor.setBlockRange({ from: 415000, to: 1326700 });

processor.run(new TypeormDatabase(), async (ctx) => {
  const burnData = await getBurnData(ctx);
  await ctx.store.insert(burnData);
});

type Item = BatchProcessorItem<typeof processor>;
type Ctx = BatchContext<Store, Item>;

let newCall: boolean;

async function getBurnData(ctx: Ctx): Promise<BurnData[]> {
  const burnData: BurnData[] = [];
  for (const block of ctx.blocks) {
    const storage = new EthereumCurrentBlockStorage(ctx, block.header);
    let collator: Uint8Array | undefined;
    if (storage.isV49) {
      collator = (await storage.getAsV49())?.header.beneficiary;
    } else if (storage.isV900) {
      collator = (await storage.getAsV900())?.header.beneficiary;
    } else if (storage.isV1201) {
      collator = (await storage.getAsV1201())?.header.beneficiary;
    } else {
      console.error('FATAL ERROR');
    }

    if (collator) {
      let callID;
      let tempCallID;
      let tempData;
      for (const item of block.items) {
        if (
          item.kind === 'event' &&
          item.name === 'Balances.Deposit' &&
          item.event.call?.name === 'Ethereum.transact'
        ) {
          tempCallID = item.event.call?.id;

          let data = new BurnData();
          const event = new BalancesDepositEvent(ctx, item.event);

          if (event.isV49) {
            data.account = toHex(event.asV49[0]);
            data.amount = event.asV49[1];
          } else if (event.isV1201) {
            data.account = toHex(event.asV1201.who);
            data.amount = event.asV1201.amount;
          } else {
            console.error('Event not supported');
          }

          if (data.account === toHex(collator)) {
            let blockNo;
            let eventIdx;

            [blockNo, eventIdx] = item.event.id.split('-');
            let index = parseInt(eventIdx, 10).toString();

            data.id = `${parseInt(blockNo, 10)}-${index}`;
            data.timestamp = BigInt(block.header.timestamp);

            // If for this call there was already a balance.deposit event, remove the previous restored one
            // We only want the second
            if (callID === tempCallID && tempData) {
              console.log(`Weird tx detected ${index}`);
              burnData.pop();
              let [_, tempEventIdx] = tempData.id.split('-');
              if (tempEventIdx > eventIdx) {
                data = tempData;
              }
            }
            callID = tempCallID;

            burnData.push(data);
            tempData = data;
          }
        }
      }
    }
  }
  return burnData;
}
