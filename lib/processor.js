"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_store_1 = require("@subsquid/typeorm-store");
const substrate_processor_1 = require("@subsquid/substrate-processor");
const archive_registry_1 = require("@subsquid/archive-registry");
const model_1 = require("./model");
const events_1 = require("./types/events");
const storage_1 = require("./types/storage");
const processor = new substrate_processor_1.SubstrateBatchProcessor()
    .setBatchSize(500)
    .setDataSource({
    archive: (0, archive_registry_1.lookupArchive)('moonbeam', { release: 'FireSquid' }),
    chain: 'wss://wss.api.moonbeam.network',
})
    .addEvent('Balances.Deposit');
//processor.setBlockRange({ from: 1400000, to: 2080000 });
processor.setBlockRange({ from: 415000, to: 1326700 });
processor.run(new typeorm_store_1.TypeormDatabase(), async (ctx) => {
    const burnData = await getBurnData(ctx);
    await ctx.store.insert(burnData);
});
let newCall;
async function getBurnData(ctx) {
    const burnData = [];
    for (const block of ctx.blocks) {
        const storage = new storage_1.EthereumCurrentBlockStorage(ctx, block.header);
        let collator;
        if (storage.isV49) {
            collator = (await storage.getAsV49())?.header.beneficiary;
        }
        else if (storage.isV900) {
            collator = (await storage.getAsV900())?.header.beneficiary;
        }
        else if (storage.isV1201) {
            collator = (await storage.getAsV1201())?.header.beneficiary;
        }
        else {
            console.error('FATAL ERROR');
        }
        if (collator) {
            let callID;
            let tempCallID;
            let tempData;
            for (const item of block.items) {
                if (item.kind === 'event' &&
                    item.name === 'Balances.Deposit' &&
                    item.event.call?.name === 'Ethereum.transact') {
                    tempCallID = item.event.call?.id;
                    let data = new model_1.BurnData();
                    const event = new events_1.BalancesDepositEvent(ctx, item.event);
                    if (event.isV49) {
                        data.account = (0, substrate_processor_1.toHex)(event.asV49[0]);
                        data.amount = event.asV49[1];
                    }
                    else if (event.isV1201) {
                        data.account = (0, substrate_processor_1.toHex)(event.asV1201.who);
                        data.amount = event.asV1201.amount;
                    }
                    else {
                        console.error('Event not supported');
                    }
                    if (data.account === (0, substrate_processor_1.toHex)(collator)) {
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
//# sourceMappingURL=processor.js.map