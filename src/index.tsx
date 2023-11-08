import './index.css';

import React, { Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Button from './components/Button';
import routes from './constants/routes';
import { P2PTrade } from './pages/P2PTrade';
import {
  nearConnect,
  nearDisconnect,
  nearGetBalance,
} from './utils/near/connection';

const App = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(
    !!localStorage.getItem('p2p-trade_wallet_auth_key') ?? false,
  );

  const [wallet, setWallet] = useState('');
  const [balance, setBalance] = useState<any>();
  console.log('balance :', JSON.stringify(balance));

  useEffect(() => {
    isWalletConnected
      ? setWallet(
          JSON.parse(localStorage.getItem('p2p-trade_wallet_auth_key') ?? '{}')
            ?.accountId,
        )
      : setWallet('');

    // if (isWalletConnected) window.location.href = routes.TRADE;
  }, [isWalletConnected]);

  useEffect(() => {
    !!localStorage.getItem('p2p-trade_wallet_auth_key')
      ? setIsWalletConnected(true)
      : setIsWalletConnected(false);
  }, []);

  useEffect(() => {
    if (wallet) {
      (async () => {
        setBalance(await nearGetBalance());
      })();
    }
  }, [wallet]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <></>,
    },
    {
      path: routes.TRADE,
      element: <P2PTrade {...{ wallet }} />,
    },
  ]);

  return (
    <>
      <Suspense fallback=''>
        <section className='pb-0 antialiased overflow-x-hidden'>
          <div className=' min-h-full w-screen items-start'>
            <RouterProvider router={router} />
          </div>

          {!isWalletConnected && (
            <Button
              onClick={() => {
                nearConnect();
              }}
            >
              Connect Wallet
            </Button>
          )}

          {isWalletConnected && (
            <Button
              onClick={() => {
                nearDisconnect();
                // setIsWalletConnected(false);
              }}
            >
              {wallet}
            </Button>
          )}
        </section>
      </Suspense>
      <h1 className='text-3xl font-bold underline'>Hermes Protocol</h1>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
