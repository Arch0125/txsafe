import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { OnTransactionHandler } from '@metamask/snaps-types';
import { panel, heading, text, divider } from '@metamask/snaps-ui';
import {ethers} from 'ethers';
import {Simulator} from './helpers/Simulator';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
  transactionOrigin,
}) => {
  const {walletin,walletout} = await Simulator(transaction,chainId);

  const insights = [
    `Transaction to: ${transaction.to}`,
    `Amount: ${ethers.utils.formatEther(String(ethers.BigNumber.from(transaction.value)))}`,
    `Transaction origin: ${transactionOrigin}`,
    `Chain ID: ${chainId.split(':')[1]}`,
  ]


  return {
    content: panel([
      heading('My Transaction Insights'),
      text('Here are the insights:'),
      ...(insights.map((insight) => text(insight))),
      divider(),
      heading('Asset Changes'),
      text('**↙ Wallet In:**'),
      ...(walletin.map((insight) => text(insight))),
      text('**↗ Wallet Out:**'),
      ...(walletout.map((insight) => text(insight))),
    ])
  };
};