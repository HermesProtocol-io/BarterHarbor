export type BalancesResponse<T> = T & {
	block_timestamp_nanos: string;
	block_height: string;
};

type ContractMetadata = {
	base_uri: string;
	icon: string;
	name: string;
	reference: string;
	reference_hash: string;
	spec: string;
	symbol: string;
};

export type NEAR = {
	balance: Omit<Balance, 'contract_account_id'>;
};

export type FT = {
	balances: Balance[];
};

type Balance = {
	amount: string;
	contract_account_id: string;
	metadata: {
		name: string;
		symbol: string;
		icon: string;
		decimals: number;
	};
};

export type AllNFT = {
	nft_counts: NFTCount[];
};

type NFTCount = {
	contract_account_id: string;
	nft_count: number;
	last_updated_at_timestamp_nanos: string;
	contract_metadata: ContractMetadata;
};

export type ContractNFT = {
	nfts: NFT[];
	contract_metadata: ContractMetadata;
};

type NFT = {
	metadata: NFTMetadata;
	owner_account_id: string;
	token_id: string;
};

type NFTMetadata = {
	copies: number;
	description: string;
	extra: string;
	media: string;
	media_hash: string;
	reference: string;
	reference_hash: string;
	title: string;
};
