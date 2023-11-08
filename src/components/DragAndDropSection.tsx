import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button, {
  ButtonJustify,
  ButtonSize,
  ButtonType,
} from '../components/Button';
import PopUp, { PopupSize } from '../components/Popup';
import { Balance, NFT, Token } from '../types';
import { ScopeDragAndDrop } from '../types/enums/P2P';

export type Props = {
  title: string;
  blockchain: string;
  tokens: Balance;
  tradeTokens: any;
  setTradeTokens: Dispatch<
    SetStateAction<{
      owner?: any;
      participant?: any;
    } | null>
  >;
  icon?: boolean;
  type: 'owner' | 'participant';
};

const DragAndDropSection = ({
  title,
  tokens,
  tradeTokens,
  setTradeTokens,
  icon,
  type,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  // aka Filters
  const [scopeTrade, setScopeTrade] = useState<ScopeDragAndDrop>(
    ScopeDragAndDrop.all,
  );

  // Up Grid
  const [tokensToSelect, setTokensToSelect] = useState<Balance>(tokens);

  // Down Grid
  const [tokensToTrade, setTokensToTrade] = useState<(NFT | Token)[]>([]);

  const [error, setError] = useState<boolean>(false);
  const [inputBalance, setInputBalance] = useState<string>('');

  const [showModal, setShowModal] = useState<{
    visible: boolean;
    token: Token | null;
  }>({ visible: false, token: null });

  const numberFormatter = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 3,
  });

  const resetFields = () => {
    setInputBalance('');
    setError(false);
    setShowModal({ visible: false, token: null });
  };

  const getNumberFormatted = (amount: number, decimals: number): string => {
    return numberFormatter.format(amount! / 10 ** decimals);
  };

  const getNumberDecimalFormatted = (
    amount: number,
    decimals: number,
  ): string => {
    return (amount! / 10 ** decimals).toFixed(3);
  };

  // Handle after click on NFT
  const handleNftClicked = (nft: NFT) => {
    if (!tokensToTrade.find((t) => t === nft)) {
      setTokensToTrade([...tokensToTrade, nft]);
      setTokensToSelect({
        ...tokensToSelect,
        nfts: tokensToSelect?.nfts?.filter((t) => t !== nft),
      });
    } else {
      setTokensToTrade(
        tokensToTrade.filter((t) => {
          return t !== nft;
        }),
      );
      setTokensToSelect({
        ...tokensToSelect,
        nfts: [...tokensToSelect?.nfts!, nft],
      });
    }
  };

  // Handle after click on Token
  const handleTokenClicked = (token: Token) => {
    const tokenTrade = tokensToTrade.find(
      (t) => 'symbol' in t && t.symbol === token.symbol,
    ) as Token;

    const tokenSelect = tokensToSelect?.tokens?.find(
      (t) => t.symbol === token.symbol,
    ) as Token;

    if (!tokenTrade) {
      setShowModal({ visible: true, token: token });
    } else {
      setTokensToTrade(
        tokensToTrade.filter((t) => 'symbol' in t && t.symbol !== token.symbol),
      );

      if (!tokenSelect) {
        setTokensToSelect({
          ...tokensToSelect,
          tokens: [...tokensToSelect?.tokens!, token],
        });
      } else {
        setTokensToSelect({
          ...tokensToSelect,
          tokens: tokensToSelect?.tokens?.map((t) => {
            if (t.symbol === token.symbol) {
              return {
                ...t,
                balance: tokenSelect.balance + tokenTrade.balance,
              };
            } else return t;
          }),
        });
      }
    }
  };

  // Handle after choose token amount in Modal
  const handleAddTokenBalance = (token: Token) => {
    const tokenTrade = tokensToTrade.find((t) =>
      'symbol' in t ? t.symbol === token.symbol : false,
    ) as Token;

    if (tokenTrade) {
      const total = tokenTrade.balance + +inputBalance * 10 ** token.decimals;

      setTokensToTrade(
        tokensToTrade.map((t) =>
          'symbol' in t
            ? t.symbol === token.symbol
              ? { ...t, balance: total }
              : t
            : t,
        ),
      );

      setTokensToSelect({
        ...tokensToSelect,
        tokens: tokensToSelect?.tokens
          ?.map((t) => {
            if (t.symbol === token.symbol) {
              return {
                ...t,
                balance: token.balance - +total,
              };
            } else return t;
          })
          .filter((t) => t.balance / 10 ** token.decimals > 0.5),
      });
    } else {
      setTokensToTrade([
        ...tokensToTrade,
        { ...token, balance: +inputBalance * 10 ** token.decimals },
      ]);

      setTokensToSelect({
        ...tokensToSelect,
        tokens: tokensToSelect?.tokens
          ?.map((t) => {
            if (t.symbol === token.symbol) {
              return {
                ...t,
                balance: token.balance - +inputBalance * 10 ** token.decimals,
              };
            } else return t;
          })
          .filter((t) => t.balance / 10 ** t.decimals > 0.5),
      });
    }

    resetFields();
  };

  // Handle after change input amount
  const handleBalanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const token = showModal.token!;
    setInputBalance(event.target.value);

    const value: number = +event.target.value * 10 ** token.decimals;
    if (value > token.balance) setError(true);
  };

  // Copy balance from token to input
  const copyBalanceFromInput = (token: Token) => {
    setInputBalance(getNumberDecimalFormatted(token.balance, token.decimals));
  };

  // Update tokens to trade on parent component/page (P2PTrade)
  /*
    Filters out any existing tokens that are already in tokensToTrade. Then, it maps over the existing tokens and updates the balance of any tokens that are also in tokensToTrade.
    Sets tradeTokens that includes the updated tokens, the new tokens, and any remaining tokens in tokensToTrade.
    (tokens meaning tokens/coins and/or NFTs)
  */
  useEffect(() => {
    setTradeTokens((tks) => {
      const tempTokensToTrade = tokensToTrade;
      const existingTokens = tks?.[type] ?? [];

      const newTokens = existingTokens.filter((t: Token | NFT) => {
        return !tokensToTrade.some((tt) => {
          if ('symbol' in tt && 'symbol' in t) return tt.symbol === t.symbol;

          if ('collectionContract' in tt && 'collectionContract' in t)
            return tt.collectionContract === t.collectionContract;

          return false;
        });
      });

      const updatedTokens = existingTokens.map((t: Token | NFT) => {
        if ('collectionContract' in t) {
          const nftTrade = tokensToTrade.find((tt) =>
            'collectionContract' in tt
              ? tt.collectionContract === t.collectionContract
              : false,
          ) as NFT;

          tempTokensToTrade.filter((tt) => tt !== t);
          return nftTrade ?? null;
        }

        const tokenTrade = tokensToTrade.find((tt) =>
          'symbol' in tt ? tt.symbol === t.symbol : false,
        ) as Token;

        if (tokenTrade) {
          tempTokensToTrade.filter((tt) => tt !== tokenTrade);

          return {
            ...t,
            balance: tokenTrade.balance,
          };
        } else return null;
      });

      return {
        ...tks,
        [type]: [...newTokens, ...updatedTokens, ...tempTokensToTrade].filter(
          (t) => t,
        ),
      };
    });
  }, [tokensToTrade]);

  return (
    <>
      {/* Filters Dropdown */}
      <div className='sm:flex-col my-2 items-center w-1/2'>
        <section>
          <h3 className='text-xsm mx-1'>{title}</h3>
          <select
            multiple={false}
            value={scopeTrade}
            className='focus:ring-0 focus:outline-none bg-white mt-2'
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setScopeTrade(e?.target.value as ScopeDragAndDrop)
            }
          >
            {Object.values(ScopeDragAndDrop).map((o, i) => {
              return (
                <option key={i} value={o}>
                  {o}
                </option>
              );
            })}
          </select>
        </section>

        {/* Filter Display */}
        <section className='bg-white rounded-xl px-1 py-2 my-8 shadow-icons overflow-auto  h-96'>
          <div className='flex px-4 py-1 justify-between '>
            <div className='flex items-center align-middle '>
              <span className='mr-1 text-lg'>{scopeTrade}</span>
              <span className='text-xxsm p-1 px-2 border border-gray-light50 rounded-full'>
                {(scopeTrade === ScopeDragAndDrop.all
                  ? tokens.tokens?.length + tokens.nfts?.length
                  : scopeTrade === ScopeDragAndDrop.nft
                  ? tokens.nfts?.length
                  : tokens.tokens?.length) ?? 0}
              </span>
            </div>
          </div>

          {/* Up Grid */}
          <div className='flex flex-wrap justify-start 2xl:px-5 px-2 py-2 '>
            <div className={`flex flex-wrap `}>
              {(scopeTrade === ScopeDragAndDrop.all ||
                scopeTrade === ScopeDragAndDrop.nft) &&
                tokensToSelect?.nfts?.map((nft: NFT, i: number) => {
                  return (
                    <div
                      key={Math.random() * 1.5 + i}
                      onClick={() => handleNftClicked(nft)}
                      className={
                        'bg-gray-extralight20 border xl:w-32 w-28 h-24 hover:border-gold transform-gpu hover:scale-105 transition-all rounded-xl mx-2.5 mb-4 py-2 px-1.5 cursor-pointer shadow'
                      }
                    >
                      <div className='flex-col'>
                        <div className='flex items-center justify-center'>
                          <small className='text-xxxxsm text-center font-bold'>
                            {nft.name}
                          </small>
                        </div>
                        <div className='mt-2 items-end justify-end'>
                          <img
                            alt={nft.name}
                            className='m-auto rounded'
                            width='55'
                            height={'55'}
                            src={nft.icon ?? nft.collectionIcon}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

              {(scopeTrade === ScopeDragAndDrop.all ||
                scopeTrade === ScopeDragAndDrop.token) &&
                tokensToSelect?.tokens?.map((token: Token, i: number) => {
                  return (
                    !tokensToTrade.find((t) => t === token) && (
                      <div
                        key={Math.random() * 1.5 + i}
                        onClick={() => handleTokenClicked(token)}
                        className={`  ${
                          loading && ' opacity-0 '
                        }   bg-gray-extralight20 xl:w-32 w-30 w-28 h-24 border hover:border-gold transform-gpu hover:scale-105 transition-all mx-2.5 rounded-xl mb-4 py-2 px-1.5 cursor-pointer shadow`}
                      >
                        <div className='flex justify-between '>
                          <small className='font-bold text-xxxsm'>
                            {getNumberFormatted(token.balance, token.decimals)}
                          </small>
                          <small className='text-xxxsm font-bold'>
                            {token.symbol}
                          </small>
                        </div>

                        <div className='mt-1 flex '>
                          <img
                            alt={token.symbol ?? token.contract}
                            className='m-auto'
                            width='55'
                            height={'55'}
                            src={token.icon || '🚫'}
                          />
                        </div>
                      </div>
                    )
                  );
                })}
            </div>
          </div>
        </section>

        {/* Down Grid */}
        <div className={` relative `}>
          <section className='bg-white rounded-xl px-1 py-2 my-8 shadow-icons overflow-hidden h-96'>
            <div className='flex flex-wrap justify-start 2xl:px-5 px-2 py-2'>
              <div className={`flex flex-wrap`}>
                {tokensToTrade &&
                  tokensToTrade.map((t: Token | NFT, index) => {
                    return (
                      <div
                        key={Math.random() * 1.5 + index}
                        className={` ${
                          loading && ' opacity-0 '
                        }  bg-gray-extralight20 border relative xl:w-32 w-28 h-24 border-gold transition-all rounded-xl mx-2.5 mb-4 py-2 px-1.5 cursor-pointer shadow-lg`}
                      >
                        <div className='absolute right-3 top-16'>
                          <FontAwesomeIcon
                            className='text-gray-500 opacity-25 hover:opacity-100 transition-all'
                            onClick={() => {
                              return 'collectionIcon' in t
                                ? handleNftClicked(t)
                                : handleTokenClicked(t);
                            }}
                            icon={faTrash}
                          />
                        </div>

                        <div className='flex-col'>
                          <div className='flex items-center justify-between'>
                            {'balance' in t && (
                              <small className='font-bold text-xxxsm'>
                                {getNumberFormatted(t.balance, t.decimals)}
                              </small>
                            )}

                            <small className='text-xxxxsm text-center font-bold'>
                              {'name' in t ? t.name : t.symbol}
                            </small>
                          </div>
                          <div className='items-end justify-start flex-col'>
                            <img
                              alt={'name' in t ? t.name : t.symbol}
                              className='m-auto rounded'
                              width='55'
                              height={'55'}
                              src={
                                'icon' in t
                                  ? t.icon
                                  : 'collectionIcon' in t
                                  ? (t as NFT).collectionIcon
                                  : '🚫'
                              }
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>

          {/* Icon */}
          {icon && (
            <div className='absolute -right-14 inset-y-28'>
              <img
                src='/images/exchange-icon.svg'
                width={50}
                alt='exchange-icon'
              />
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal.visible && (
          <PopUp size={PopupSize.small}>
            {/* Header */}
            <div className='w-full px-4'>
              <div className='w-full items-center flex justify-evenly'>
                <h2 className='flex-grow'>Token</h2>
                {showModal.token?.icon && (
                  <img
                    alt={showModal.token.symbol ?? showModal.token.contract}
                    className='m-auto'
                    width='40'
                    height={'40'}
                    src={showModal.token.icon || '🚫'}
                  />
                )}
              </div>

              {/* Token + Quantity */}
              <div className='my-7'>
                <label htmlFor='amount'>
                  <div className='flex justify-between'>
                    Amount
                    <div className='mx-1 text-sm'>
                      <span
                        onClick={() => {
                          copyBalanceFromInput(showModal.token!);
                        }}
                        className='mx-1 cursor-pointer hover:opacity-75'
                      >
                        {getNumberDecimalFormatted(
                          showModal.token!.balance,
                          showModal.token!.decimals,
                        )}
                      </span>
                      {showModal.token?.symbol}
                    </div>
                  </div>

                  {/* Input */}
                  <div className='flex items-center text-gray-medium border-gray-extralight90medium tokenTradeInput'>
                    <input
                      type='number'
                      name={'amount'}
                      onChange={handleBalanceChange}
                      value={inputBalance}
                      className='w-full height42 focus:ring-0 rounded-r-none
 focus:opacity-100 focus:border-gray-extralight90medium focus:outline-none py-2.5 px-3 border-gray-extralight90medium '
                    />
                    <span className='px-2 height42 py-2.5 rounded-l-none border-l-0 rounded text-xsm border border-gray-extralight90medium text-gray-dark'>
                      {showModal.token?.symbol}
                    </span>
                  </div>

                  {/* Error */}
                  {error && (
                    <small className='text-xxsm px-1 fixed text-red'>
                      Insufficient balance
                    </small>
                  )}
                </label>
              </div>

              {/* Add Button */}
              <div className='flex justify-end'>
                <Button
                  onClick={resetFields}
                  type={ButtonType.cancel}
                  size={ButtonSize.smallWide}
                  justify={ButtonJustify.center}
                >
                  Cancel
                </Button>
                <Button
                  className='ml-2'
                  disabled={error ?? !inputBalance}
                  type={ButtonType.primary}
                  size={ButtonSize.smallWide}
                  justify={ButtonJustify.center}
                  onClick={() => handleAddTokenBalance(showModal.token!)}
                >
                  Add
                </Button>
              </div>
            </div>
          </PopUp>
        )}
      </div>
    </>
  );
};
export default DragAndDropSection;
