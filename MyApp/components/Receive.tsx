

import { PublicKey } from '@solana/web3.js';
import React, { useMemo, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import BigNumber from 'bignumber.js';
import QRCode from 'react-native-qrcode-svg';



import { useGlobalState } from '../state';
import { encodeURL } from '@solana/pay';
import { TextInput } from 'react-native-paper';


let logoFromFile = require('../assets/solanaLogoMark.png');


type Props = Readonly<{
  publicKey: PublicKey;
}>;
export default function Receive({ publicKey }: Props) {


  const [receiveModalEnabled, changeReceiveModalStatus] = useGlobalState('receiveModal');
  const [request_amount,onChangeAmount] =  useState('')

  const encodedURL = useMemo(() => {
    return encodeURL({ recipient: new PublicKey(publicKey), amount: new BigNumber(Number(request_amount)?Number(request_amount):0), label: "Hi", message: "hi", memo: "OrderId5678" });


  }, [publicKey,request_amount])






  return (
    <>
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 10 }}>


        <QRCode
          value={encodedURL.toString()}

          size={200}
          logoSize={30}

          logo={logoFromFile}
          logoBackgroundColor={logoFromFile}
        />
         <TextInput
                style={styles.input}
                onChangeText={onChangeAmount}
                value={request_amount}
                placeholder="Amount"
                keyboardType="numeric"
                placeholderTextColor="white"

            />


        <Button onPress={() => changeReceiveModalStatus(false)} title="Cancel" />
      </View>

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