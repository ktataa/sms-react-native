

import { PublicKey } from '@solana/web3.js';
import React, { useMemo } from 'react';
import { Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

import { TextInput } from 'react-native-paper';

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
      <TextInput
                style={styles.input}
                disabled
          
                placeholder="To address"
                keyboardType="default"
                placeholderTextColor="white"

            >To: {recipient.toBase58().substring(0, 27)}...</TextInput>
            {/* <TextInput
                style={styles.input}
                onChangeText={onChangeAmount}
                value={to_amount}
                placeholder="Amount"
                keyboardType="numeric"
                placeholderTextColor="white"

            /> */}
  <TextInput
                style={styles.input}
          
                placeholder="To address"
                keyboardType="default"
                placeholderTextColor="white"

            >Amount: {amount.toString()} SOL</TextInput>

      <TouchableOpacity style={{ margin: 5 }}>


        <Button onPress={() => send()} title="Confirm" />
      </TouchableOpacity>
      <TouchableOpacity style={{ margin: 5 }}>

        <Button onPress={() => setScanCode(false)} title="Cancel" />
      </TouchableOpacity>




    </>

  );
} 
const styles = StyleSheet.create({


  input: {
      height: 40,
      margin: 12,
      borderWidth: 2,
      color: "#007AFF",

      width: '100%',
      borderColor: "white"
  },
})
