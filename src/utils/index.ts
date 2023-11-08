import { Balance } from '../types';

export async function getBalances(
  account: string,
): Promise<Balance | undefined> {
  try {
    return await fetch(`api/all-balances/${account}`).then((r) => handleJsonRequest(r, 1));
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