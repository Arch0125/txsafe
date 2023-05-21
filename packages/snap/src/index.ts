import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { OnTransactionHandler } from '@metamask/snaps-types';
import { panel, heading, text, divider } from '@metamask/snaps-ui';
import {ethers} from 'ethers';
import {Simulator} from './helpers/Simulator';
const checkForPhishing = require('eth-phishing-detect')

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
  transactionOrigin,
}) => {

  const {walletin,walletout} = await Simulator(transaction,chainId);

  const insights = [
    `**Transaction origin:** ${transactionOrigin?transactionOrigin:'Origin not found'}`,
  ]

  const isPhishing = checkForPhishing(transactionOrigin)
  let warning=''
  if (isPhishing) {
    warning = '**⚠️ This site has been reported as a phishing site. Proceed with caution.**'
  }else{
    warning = '**✅ This site has not been reported as a phishing site.**'
  }

  return {
    content: panel([
      heading('🚨 Review Transaction'),
      divider(),
      ...(insights.map((insight) => text(insight))),
      text(`${transactionOrigin?warning:''}`),
      divider(),
      heading('Asset Changes'),
      text('**↙ Wallet In:**'),
      ...(walletin.map((insight) => text(insight))),
      text('**↗ Wallet Out:**'),
      ...(walletout.map((insight) => text(insight))),
    ])
  };
};