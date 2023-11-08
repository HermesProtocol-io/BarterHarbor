import { Env } from '../../types/';
import { Balance, NFT, Token } from '../../types';
import { AllNFT, BalancesResponse, ContractNFT, FT, NEAR } from '../../types/responses';
import { handleJsonRequest } from '..';

export async function getAllBalances(account: string, env: Env): Promise<Balance> {
	const tokens = await getTokensBalances(account, env);

	const nfts = await getNFTsBalances(account, env);

	return {
		tokens,
		nfts,
	};
}

export async function getTokensBalances(account: string, env: Env): Promise<Token[]> {
	let tokens: Token[] = [];

	try {
		const data = await fetch(`${env.PAGODA_API_URL}/accounts/${account}/balances/NEAR`, {
			method: 'GET',
			headers: {
				'X-API-KEY': env.PAGODA_API_KEY,
			},
		}).then<BalancesResponse<NEAR>>((r) => handleJsonRequest(r, 1));

		tokens.push({
			symbol: data.balance.metadata.symbol,
			balance: Number(data.balance.amount),
			decimals: data.balance.metadata.decimals,
			icon: data.balance.metadata.icon,
			contract: 'near',
		});
	} catch (error) {
		console.error(error);
	}

	try {
		const data = await fetch(`${env.PAGODA_API_URL}/accounts/${account}/balances/FT`, {
			method: 'GET',
			headers: {
				'X-API-KEY': env.PAGODA_API_KEY,
			},
		}).then<BalancesResponse<FT>>((r) => handleJsonRequest(r, 2));

		tokens = [
			...tokens,
			...data.balances.map((b: any) => ({
				symbol: b.metadata.symbol,
				balance: Number(b.amount),
				decimals: b.metadata.decimals,
				icon: b.metadata.icon,
				contract: b.contract_account_id,
			})),
		];
	} catch (error) {
		console.error(error);
	}

	return tokens;
}

export async function getNFTsBalances(account: string, env: Env): Promise<NFT[]> {
	let nftContracts: string[] = [];
	try {
		const conn = await fetch(`${env.PAGODA_API_URL}/accounts/${account}/NFT`, {
			method: 'GET',
			headers: {
				'X-API-KEY': env.PAGODA_API_KEY,
			},
		});

		if (conn.status !== 200) return [];

		const data = await conn.json<BalancesResponse<AllNFT>>();

		nftContracts = data.nft_counts.map((n: any) => n.contract_account_id);
	} catch (error) {
		console.error(error);
		return [];
	}

	let nfts: NFT[] = [];
	for (const contract of nftContracts) {
		try {
			const conn = await fetch(`${env.PAGODA_API_URL}/accounts/${account}/NFT/${contract}`, {
				method: 'GET',
				headers: {
					'X-API-KEY': env.PAGODA_API_KEY,
				},
			});

			if (conn.status !== 200) return [];

			const data = await conn.json<BalancesResponse<ContractNFT>>();

			nfts = [
				...nfts,
				...data.nfts.map((n: any) => ({
					name: n.metadata.title ?? `${data.contract_metadata.name} #${n.token_id}`,
					icon: `${data.contract_metadata.base_uri}/${n.metadata.media}`,
					tokenId: n.token_id,
					collectionContract: contract,
					collectionIcon: data.contract_metadata.icon,
				})),
			];
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	return nfts;
}
