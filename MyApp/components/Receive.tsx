

import { PublicKey, Keypair } from '@solana/web3.js';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import BigNumber from 'bignumber.js';
import QRCode from 'react-native-qrcode-svg';

import Spinner from 'react-native-loading-spinner-overlay';



import { useGlobalState } from '../state';
import { encodeURL, findReference } from '@solana/pay';
import { Text, TextInput } from 'react-native-paper';
import { useConnection } from '@solana/wallet-adapter-react';


let logoFromFile = require('../assets/solanaLogoMark.png');


type Props = Readonly<{
  publicKey: PublicKey;
}>;
export default function Receive({ publicKey }: Props) {


  const [receiveModalEnabled, changeReceiveModalStatus] = useGlobalState('receiveModal');
  const [value, update] = useGlobalState('requestCount');

  const [request_amount, onChangeAmount] = useState('')
  const [txFound, setTxFound] = useState(false)
  const [spinnerVisible, changeSpinnerStatus] = useState(false)

  const { connection } = useConnection()
  const originalReference = useMemo(() => {
    return Keypair.generate().publicKey

  }, [publicKey, request_amount])



  const encodedURL = useMemo(() => {
    return encodeURL({ recipient: new PublicKey(publicKey), amount: new BigNumber(Number(request_amount) ? Number(request_amount) : 0), reference: originalReference, label: "Hi", message: "hi", memo: "OrderId5678" });


  }, [publicKey, request_amount, originalReference])
  useEffect(() => {
    const interval = setInterval(async () => {
      console.log(txFound);

      const signatureInfo = await findReference(connection, originalReference);
      console.log(signatureInfo.signature);

      setTxFound(true)
      changeSpinnerStatus(true)
      clearInterval(interval);
      await connection.confirmTransaction(signatureInfo.signature, 'finalized')
      changeSpinnerStatus(false)

      changeReceiveModalStatus(false)
      update(prestatus => prestatus + 1)



    }, 5000);
    return () => clearInterval(interval);






  }, [encodedURL])







  return (
    <>
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
        <Spinner
          visible={spinnerVisible}
          textContent={'Receiving...'}
          textStyle={styles.spinnerTextStyle}
        />

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

        <Text style={{ fontWeight: 'bold', color: "black" }} >{txFound ? "found" : "not found"} </Text>




        <Button onPress={() => changeReceiveModalStatus(false)} title="Cancel" />

      </View>

    </>



  );
}
const styles = StyleSheet.create({

  spinnerTextStyle: {
    color: '#FFF'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 2,
    color: "#007AFF",

    width: '100%',
    borderColor: "white"
  },
})