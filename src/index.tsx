import './index.css';

import React, { Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import logo from './assets/images/BartorHarborV2.png'

import Button from './components/Button';
import routes from './constants/routes';
import { P2PTrade } from './pages/P2PTrade';
import { Menu } from './pages/Menu';
import {
  nearConnect,
  nearDisconnect,
  nearGetBalance,
  nearInit,
} from './utils/near/connection';

const App = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(
    !!localStorage.getItem('p2p-trade_wallet_auth_key') ?? false,
  );
    
  nearInit().then(() => setIsWalletConnected(!!localStorage.getItem('p2p-trade_wallet_auth_key') ?? isWalletConnected));

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
      element: <></>
    },
    {
      path: routes.MENU,
      element: <Menu />,
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
          <div className='flex flex-row justify-between mx-auto max-w-7xl px-8 py-1'>
          <img src={logo} className="h-20 w-auto" alt={"logo"}/> 
          {!isWalletConnected && (
            <div className='flex items-center'>
                <Button
                  onClick={() => {
                    nearConnect();
                  }}
                >
                
                  Connect Wallet
                  <span className="ml-4 flex h-3 w-3">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500"></span>
                  </span>
                </Button>
                      

            </div>
          )}

          {isWalletConnected && (
             <div className='flex items-center'>
              <Button
                onClick={async () => {
                  await nearDisconnect();
                  // setIsWalletConnected(false);  {wallet}
                }}
              >
              Connected 
              <span className="ml-4  relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                
              </Button>
            </div>
          )}
          </div>
 
        </section>
      </Suspense>

     
      <div className=' min-h-full items-start'>
            <RouterProvider router={router} />
      </div>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
