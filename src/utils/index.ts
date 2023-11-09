import { Balance } from '../types';
import { getNFTsBalances } from './near/mintbase';

export async function getBalances(
  account: string,
): Promise<Balance | undefined> {
  try {
    const tokens = await fetch(`api/token-balances/${account}`).then((r) => handleJsonRequest(r, 1));
    const nfts = await getNFTsBalances(account);

    return {
      tokens,
      nfts
    }
  } catch (error) {
    return undefined;
  }
}

export function handleJsonRequest(r: Response, num?: number) {
  if (r.ok) return r.json();
  throw new Error(
    `Error (${r.status}) with fetch! #${num??0} - '${r.statusText}' from URL: ${r.url}`
  );
}