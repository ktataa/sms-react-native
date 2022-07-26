

import { PublicKey } from '@solana/web3.js';
import React from 'react';
import { Button } from 'react-native';


import { useConnection } from '@solana/wallet-adapter-react';

import {

  SystemProgram,
  Transaction,

} from '@solana/web3.js';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';

import { useGlobalState } from '../state';
import useAuthorization from '../utils/useAuthorization';


type Props = Readonly<{
  publicKey?: PublicKey;
  to_amount?: Number;
  to_address?: String;
}>;
export default function SendSol({ publicKey, to_amount, to_address }: Props) {
  const [value, update] = useGlobalState('requestCount');
  const [sendModalEnabled, changeSendModalStatus] = useGlobalState('sendModal');
  const [loaderVisible, setVisibility] = useGlobalState('loaderVisible');

  const { connection } = useConnection();
  const { authorizeSession } = useAuthorization()



  const send = async () => {
    console.log("send clicked :", to_address, " : ", to_amount);


    if (publicKey && to_address) {
      console.log("send clicked :", to_address, " : ", to_amount);



      var transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(to_address),
          lamports: Number(to_amount) * 1e9
        }))

      transaction.feePayer = publicKey;
      let blockhashObj = await connection.getLatestBlockhash();
      transaction.recentBlockhash = await blockhashObj.blockhash;
      const signed_tx = await transact(async wallet => {
        await authorizeSession(wallet)
        return await wallet.signTransactions({
          transactions: [transaction],
        });
      });











      setVisibility(true)




      const tx = await connection.sendRawTransaction(signed_tx[0].serialize())
      await connection.confirmTransaction(tx, 'finalized');

      setVisibility(false)
      changeSendModalStatus(false)


      update(prestatus => prestatus + 1)


    }




  }



  return (
    <>
      <Button onPress={() => send()} title="Send" />




    </>

  );
} 
