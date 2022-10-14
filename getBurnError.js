import { ApiPromise, WsProvider } from '@polkadot/api';
import axios from 'axios';
import * as fs from 'fs';
import { stringify } from 'querystring';

const main = async () => {
  // Set up Polkadot.js API
  const wsProvider = new WsProvider(
    'wss://moonbeam.api.onfinality.io/ws?apikey=72dad096-d875-42eb-ba69-264601a15dec'
  );
  const api = await ApiPromise.create({ provider: wsProvider });

  const getData = async (query) => {
    const req = await axios({
      url: 'http://localhost:4350/graphql',
      method: 'post',
      data: {
        query,
      },
    });
    const requestedData = req.data.data;
    return requestedData;
  };

  const limit = 1000000;
  let offset = 0;

  let loop = 1;

  let totalErrorBurn = BigInt(0);
  let hasMore = true;
  let data;
  let collatorErrorBurn = {};
  while (hasMore) {
    console.log(`Loop ${loop}`);
    const query = `query {
                burnData(limit: ${limit}, offset: ${offset}, orderBy: id_ASC) {
                    id
                    amount
                    timestamp
                    account
                    }
                }`;
    data = (await getData(query)).burnData;

    for (let i = 0; i < data.length; i++) {
      if (!collatorErrorBurn[data[i].account]) {
        collatorErrorBurn[data[i].account] = 0n;
      }

      collatorErrorBurn[data[i].account] += BigInt(data[i].amount);
      totalErrorBurn += BigInt(data[i].amount);
    }

    offset += limit;

    if (data.length < limit) {
      hasMore = false;
    }
    loop++;
  }

  collatorErrorBurn['TotalAmount'] = totalErrorBurn;

  console.log(totalErrorBurn);

  let jsonContent = JSON.stringify(
    collatorErrorBurn,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
  );

  fs.writeFileSync(`BurnData.json`, jsonContent);

  await api.disconnect();
};

main();
