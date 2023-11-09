export type Env = {
  PAGODA_API_URL: string;
  PAGODA_API_KEY: string;
  MINTBASE_GRAPH_URL: string;
}

export type Balance = {
  tokens: Token[];
  nfts: NFT[] | MintbaseNFT[];
};

export type Token = {
  symbol: string;
  balance: number;
  decimals: number;
  icon: string;
  contract: string;
};

export type NFT = {
  name: string;
  icon: string;
  tokenId: string;
  collectionContract: string;
  collectionIcon: string;
};

export type MintbaseNFT = {
  nft_contract_id: string;
  title: string;
  description: string;
  media: string;
}