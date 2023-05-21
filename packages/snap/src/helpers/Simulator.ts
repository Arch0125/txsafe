export const Simulator = async (transaction: any, chainId: string) => {
  chainId = chainId.split(':')[1];

  const chainidendpoints = {
    '1': 'https://eth-mainnet.g.alchemy.com/v2/0fxbpb4OCXkkyHhFNPBRelJsFg7XdhML',
    '5': 'https://eth-goerli.g.alchemy.com/v2/gh4d1-dAT4B_1Khy86s7JUbFhQIclYqO',
  };

  const options = {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'alchemy_simulateAssetChanges',
      params: [
        {
          from: transaction.from,
          to: transaction.to,
          value: transaction.value,
          data: transaction.data ? transaction.data : '0x',
        },
      ],
    }),
  };

  const res = await fetch(chainidendpoints[chainId], options);

  let json = await res.json();
  json = json.result.changes;
  let walletin: string[] = [];
  let walletout: string[] = [];

  json.forEach((element: any) => {
    if (element.from === transaction.from) {
      walletout.push(
        `‣  ${element.amount}  ${element.symbol}`,
      );
    } else if (element.to === transaction.from) {
      walletin.push(
        `‣  ${element.amount}  ${element.symbol}`,
      );
    }
  });

  return {
    walletin: walletin,
    walletout: walletout,
  };
};
