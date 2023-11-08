import * as nearAPI from 'near-api-js';

import { THIRTY_TGAS } from '../../constants/near';
import { NFT, Token } from '../../types';

const { connect, keyStores, WalletConnection } = nearAPI;
const { VITE_ASSETS_CONTRACT, VITE_ESCROW_CONTRACT, VITE_NEAR_CALLBACK_URL } =
  import.meta.env;

const keyStore = new keyStores.BrowserLocalStorageKeyStore();

const config = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  // contractName: CONTRACT_NAME,
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
};

// connect to NEAR
const near = await connect({ keyStore, ...config });
const walletConnection = new WalletConnection(near, 'p2p-trade');

export const nearConnect = async () => {
  walletConnection.requestSignIn({
    successUrl: `${VITE_NEAR_CALLBACK_URL}/trade`,
    failureUrl: VITE_NEAR_CALLBACK_URL,
  });
};

export const nearDisconnect = () => {
  walletConnection.signOut();
  window.location.replace('/');
};

export const nearGetBalance = async () => {
  const account = walletConnection.account();
  const balance = await account.getAccountBalance();
  return balance;
};

export const purchaseInEscrow = async (
  account: string,
  participant: string,
  balance: (NFT | Token)[],
) => {
  const near = balance.find((t) =>
    'contract' in t ? t.contract === 'near' : false,
  ) as Token;

  const purchase = {
    receiverId: VITE_ESCROW_CONTRACT,
    actions: [
      nearAPI.transactions.functionCall(
        'purchase_in_escrow',
        {
          seller_account_id: participant,
          asset_contract_id: VITE_ASSETS_CONTRACT,
        },
        THIRTY_TGAS,
        near.balance / 10 ** near.decimals,
      ),
    ],
  };

  await walletConnection.account().signAndSendTransaction(purchase);
};
