import React, { Suspense } from 'react';
import { ConnectionProvider } from '@solana/wallet-adapter-react';

import { Provider as PaperProvider } from 'react-native-paper';

import Home from './home';


import { clusterApiUrl } from "@solana/web3.js";
import { Text } from 'react-native';


import SnackbarProvider from './components/SnackBarProvider';



export default function App() {


  const DEVNET_ENDPOINT = /*#__PURE__*/ clusterApiUrl('devnet');




  return (
    <ConnectionProvider endpoint={DEVNET_ENDPOINT}>

      <PaperProvider>

        <SnackbarProvider>
          <Suspense fallback={
            <Text>Loading..</Text>
          }>
            <Home mode="contained"></Home>

          </Suspense>
        </SnackbarProvider>
      </PaperProvider>
    </ConnectionProvider>
  )
}

