import { useEffect, useState } from 'react';

import Button, {
  ButtonJustify,
  ButtonSize,
  ButtonType,
} from '../components/Button';
import DragAndDropSection, {
  Props as DaDProps,
} from '../components/DragAndDropSection';
import P2PTradeProposalStart from '../components/P2PTradeProposalStart';
import { Balance } from '../types';
import { P2PSteps } from '../types/enums/P2P';
import { purchaseInEscrow } from '../utils/near/connection';

type Props = {
  wallet: string;
};

export const P2PTrade = ({ wallet }: Props) => {
  const [userWallet, setUserWallet] = useState<string>(wallet);
  const [proposedWallet, setProposedWallet] = useState<string>('');

  useEffect(() => {
    setUserWallet(wallet);
  }, [wallet]);

  const [showStep, setShowStep] = useState<any>(P2PSteps.proposalStart);
  const [blockchain, setBlockchain] = useState<string | null>('NEAR');

  const [tokens, setTokens] = useState<{
    owner: Balance;
    participant: Balance;
  } | null>(null);

  const [tradeTokens, setTradeTokens] = useState<{
    owner?: any;
    participant?: any;
  } | null>(null);
  console.log('tradeTokens :', tradeTokens);

  // Props
  const createProposal = {
    userWallet,
    proposedWallet,
    blockchain,
    tokens,
    setUserWallet,
    setProposedWallet,
    setShowStep,
    setBlockchain,
    setTokens,
  };

  const userProposal = {
    title: 'My Wallet',
    blockchain: blockchain!,
    tokens: tokens?.owner!,
    tradeTokens: tradeTokens?.participant!,
    setTradeTokens,
    icon: true,
    type: 'owner',
  } as DaDProps;

  const participantProposal = {
    title: 'Proposed Wallet',
    blockchain: blockchain!,
    tokens: tokens?.participant!,
    tradeTokens: tradeTokens?.owner!,
    setTradeTokens,
    icon: false,
    type: 'participant',
  } as DaDProps;

  const handleCancelTrade = () => {
    localStorage.removeItem('P2P_trade');
    setBlockchain(null);
    setTokens(null);
    setShowStep(P2PSteps.proposalStart);
  };

  return (
    <>
      <div className='relative flex items-center md:px-6 pb-8 lg:max-w-5xl 2xl:max-w-6xl'>
        <div className='px-2 md:px-0 center flex-col w-full'>
          <section className='flex flex-col w-full'>

            <div className='2xl:px-6 px-2'>
              {showStep === P2PSteps.proposalStart && (
                <div>
                  <P2PTradeProposalStart {...createProposal} />
                </div>
              )}
              {showStep === P2PSteps.trade && (
                <div>
                  <div className='my-8 flex 2xl:space-x-16 space-x-8 flex-grow w-full'>
                    <DragAndDropSection {...userProposal} />
                    <DragAndDropSection {...participantProposal} />
                  </div>
                  <div className='flex justify-end'>
                    <Button
                      onClick={handleCancelTrade}
                      type={ButtonType.cancel}
                      size={ButtonSize.smallWide}
                      justify={ButtonJustify.center}
                    >
                      Cancel Trade
                    </Button>
                    <Button
                      className='ml-2'
                      disabled={false}
                      type={ButtonType.primary}
                      size={ButtonSize.smallWide}
                      justify={ButtonJustify.center}
                      onClick={() => {
                        purchaseInEscrow(
                          userWallet,
                          proposedWallet,
                          tradeTokens?.owner!,
                        );
                      }}
                    >
                      Send Proposal
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
