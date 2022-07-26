

import { PublicKey } from '@solana/web3.js';
import React, { useMemo } from 'react';
import { Button, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';


import { useConnection } from '@solana/wallet-adapter-react';


import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';

import { useGlobalState } from '../state';
import { createTransfer, parseURL, TransferRequestURL } from '@solana/pay';
import useAuthorization from '../utils/useAuthorization';
import useGuardedCallback from '../utils/useGuardedCallback';


type Props = Readonly<{
  publicKey: PublicKey;
  url: string;
}>;
export default function SendAfterScan({ publicKey, url }: Props) {
  const [value, update] = useGlobalState('requestCount');
  const [sendModalEnabled, changeSendModalStatus] = useGlobalState('sendModal');
  const [loaderVisible, setVisibility] = useGlobalState('loaderVisible');
  const [sendAfterScanStatus, setSendAfterScan] = useGlobalState('sendAfterScan');

  const [scanCode, setScanCode] = useGlobalState('scanCode')

  const { connection } = useConnection();
  const { authorizeSession } = useAuthorization()

  const { recipient, amount, splToken, reference, label, message, memo } = useMemo(() => {
    return parseURL(
      url
    ) as TransferRequestURL;

  }, [url])
  console.log(recipient);
  console.log(amount);

  const send = useGuardedCallback(async () => {
    if (publicKey) {

      const transaction = await createTransfer(connection, publicKey, {
        recipient,
        amount,
        splToken,
        reference,
        memo,
      });





      setSendAfterScan(false)

      setVisibility(true)


      const signed_tx = await transact(async wallet => {
        await authorizeSession(wallet)
        return await wallet.signTransactions({
          transactions: [transaction],
        });
      });






      const tx = await connection.sendRawTransaction(signed_tx[0].serialize())
      await connection.confirmTransaction(tx, 'finalized');
      setScanCode(false)

      setVisibility(false)
      changeSendModalStatus(false)


      update(prestatus => prestatus + 1)











    }




  }, []
  )




  return (
    <>
      <Text> To: {recipient.toBase58()}</Text>
      <Text> Amount: {Number(amount)} SOL</Text>

      <TouchableOpacity style={{ margin: 5 }}>


        <Button onPress={() => send()} title="Confirm" />
      </TouchableOpacity>
      <TouchableOpacity style={{ margin: 5 }}>

        <Button onPress={() => setScanCode(false)} title="Cancel" />
      </TouchableOpacity>




    </>

  );
} 
