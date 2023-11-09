import { handleJsonRequest } from '..';
import { NFT } from '../../types';
const MINTBASE_GRAPH_URL = "https://graph.mintbase.xyz/testnet";

export async function getNFTsBalances(account: string): Promise<NFT[]> {
    try {
        const graphQL = JSON.stringify({
            query: `
                query QueryBasicNFTOwnership($ownerId: String!) {
                    mb_views_nft_tokens(
                        where: {
                            owner: {_eq: $ownerId}, 
                            _and: {burned_timestamp: {_is_null: true}}
                        }
                        limit: 30
                        order_by: {last_transfer_timestamp: desc}
                    ) {
                        nft_contract_id
                        title
                        description
                        media
                    }
                }`,
            variables: {
                "ownerId": account
            }
        });

		const res = await fetch(`${MINTBASE_GRAPH_URL}`, {
			method: 'POST',
			headers: {
				'mb-api-key': 'anon',
			},
            body: graphQL
		}).then((r) => handleJsonRequest(r, 1));

        return res.data.mb_views_nft_tokens;
	} catch (error) {
		console.error(error);
		return [];
	}
}