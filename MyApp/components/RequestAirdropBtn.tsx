

import { PublicKey } from '@solana/web3.js';
import React, { useState } from 'react';
import { Button } from 'react-native';

import { useConnection } from '@solana/wallet-adapter-react';

import { useGlobalState } from '../state';
import useGuardedCallback from '../utils/useGuardedCallback';


type Props = Readonly<{
  publicKey?: PublicKey;
}>;

export default function RequestAirdropBtn({ publicKey }: Props) {
  const [value, update] = useGlobalState('requestCount');

  const { connection } = useConnection();

  const [btnEnabled, setBtnEnabled] = useState(true)

  const requestAirdrop = useGuardedCallback(async () => {
    if (publicKey) {

      setBtnEnabled(false);
      const signature = await connection.requestAirdrop(publicKey, 1 * 1e9);

      await connection.confirmTransaction(signature, 'finalized');
      setBtnEnabled(true)
      update(prestatus => prestatus + 1)
    }


  }, [])


  return (
    <Button disabled={!btnEnabled} title={
      btnEnabled == true ? (
        "Request airdrop"

      ) : (
        "Requesting..."

      )


    }
      onPress={async () => await requestAirdrop()} />





  );
} 
