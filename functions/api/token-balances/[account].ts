import { getTokensBalances } from '../../../src/utils/near';

/*
 * @route: /api/token-balances/:account
 * @method: GET
 * @description: Get all account's balances (including NFTs)
 * @access: Public
 * @params: account (string) (example: mywallet.testnet, mywallet.near, ...)
 */

export async function onRequestGet({params, env}) {
	const account = params.account;
	const balance = await getTokensBalances(account, env);

	return new Response(
		JSON.stringify( balance ),
		{
			status: 200
		}
	);
};