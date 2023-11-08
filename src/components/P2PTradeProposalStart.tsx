import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import Button, { ButtonSize } from '../components/Button';
import { P2PSteps } from '../types/enums/P2P';
import { getBalances } from '../utils';

type Props = {
  userWallet: string;
  proposedWallet: string;
  blockchain: any | null;
  tokens: { owner: {}; participant: {} } | null;
  setProposedWallet: Dispatch<SetStateAction<any>>;
  setShowStep: Dispatch<SetStateAction<any>>;
  setBlockchain: Dispatch<SetStateAction<any>>;
  setTokens: Dispatch<SetStateAction<any>>;
};

const P2PTradeProposalStart = ({
  userWallet,
  proposedWallet,
  setProposedWallet,
  setShowStep,
  setTokens,
}: Props) => {
  /* Functional Variables */
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // wallet validation
  const checkAndSetTheirWalletAux = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const wallet = event.target.value.trim();
    setProposedWallet(wallet);
    // setError(false);
    // wallet !== '' &&
    //   // && !isValidTerraWallet(wallet)
    //   setError(true);
  };

  const handleCreateProposal = async () => {
    setLoading(true);

    localStorage.setItem(
      'p2p-trade-proposal',
      JSON.stringify({
        userWallet,
        proposedWallet,
      }),
    );

    const userBalance = await getBalances(userWallet);
    const proposedBalance = await getBalances(proposedWallet);

    setTokens({
      owner: { nfts: userBalance?.nfts, tokens: userBalance?.tokens },
      participant: {
        nfts: proposedBalance?.nfts,
        tokens: proposedBalance?.tokens,
      },
    });

    setShowStep(P2PSteps.trade);
  };

  // restore data from local storage
  useEffect(() => {
    const proposalDataStorage = localStorage.getItem('P2P_trade');

    if (proposalDataStorage !== null) {
      const proposalData: {
        userWallet: string;
        proposedWallet: string;
      } = { ...JSON.parse(proposalDataStorage)! };

      setProposedWallet(proposalData.proposedWallet);
    }
  }, []);

  return (
    <div className='m-auto max-w-7xl'>
      <div className='xl:flex xl:space-x-24 items-center justify-center '>
        {/* <div className='my-8 xl:w-2/6'>
          <h2 className='font-semibold text-xsm mx-1 '>Blockchain</h2>
          <div className='my-2 '>
            <label>
              <select
                className='focus:ring-0 focus:outline-none bg-white '
                multiple={false}
                disabled={true}
                defaultValue={'near'}
              >
                <option value='near'>NEAR</option>
              </select>
            </label>
          </div>
        </div> */}
        <div className='my-8 xl:w-2/6'>
          <h2 className='font-semibold text-xsm mx-1 '>My Wallet</h2>
          <div className='my-2 '>
            <label htmlFor='walletAddress'>
              <input
                type='text'
                disabled={true}
                value={userWallet}
                name='walletAddress'
                id='walletAddress'
                className={`focus:ring-0 height-50 focus:border-gray-extralight90medium focus:outline-none rounded w-full text-base h-12 p-3 border-gray-extralight90medium text-black-transparent50`}
              />
            </label>
          </div>
        </div>
        <div className='my-8 xl:w-2/6'>
          <h2 className='font-semibold text-xsm mx-1 '>Their Wallet</h2>
          <div className='my-2 items-center'>
            <label htmlFor='proposedWallet '>
              <input
                type='text'
                value={proposedWallet}
                // disabled={false}
                onChange={checkAndSetTheirWalletAux}
                name='proposedWallet'
                id='proposedWallet'
                placeholder='Write the proposed wallet address'
                className={`focus:ring-0 height-50 focus:border-gray-extralight90medium focus:outline-none rounded w-full text-base h-12 p-3 border-gray-extralight90medium text-black-transparent50`}
              />
              {error && (
                <small className='px-1 fixed text-red'>Invalid Wallet</small>
              )}
            </label>
          </div>
        </div>
      </div>
      <div className='flex justify-end'>
        <Button
          loading={loading}
          noTransition={true}
          loadingTxt={loading ? '　' : ''}
          size={ButtonSize.small}
          disabled={!proposedWallet}
          onClick={async () => await handleCreateProposal()}
        >
          {loading ? 'Creating ...' : 'Create Proposal'}
        </Button>
      </div>
    </div>
  );
};

export default P2PTradeProposalStart;
