

import { PublicKey, Keypair } from '@solana/web3.js';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import BigNumber from 'bignumber.js';
import QRCode from 'react-native-qrcode-svg';

import Spinner from 'react-native-loading-spinner-overlay';

import {

  SystemProgram,
  Transaction,

} from '@solana/web3.js';
import ModalDropdown from 'react-native-modal-dropdown';
import { createAssociatedTokenAccountInstruction, createTransferCheckedInstruction, getAccount, getAssociatedTokenAddress, getMint } from '@solana/spl-token';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { useGlobalState } from '../state';
import { encodeURL, findReference } from '@solana/pay';
import { Text, TextInput } from 'react-native-paper';
import { useConnection } from '@solana/wallet-adapter-react';
import { suspend } from 'suspend-react';
import useGetTokenAccounts from '../utils/useGetTokenAccounts';
import useAuthorization from '../utils/useAuthorization';


let logoFromFile = require('../assets/solanaLogoMark.png');


type Props = Readonly<{
  publicKey: PublicKey;
}>;
export default function Receive({ publicKey }: Props) {

  const {authorizeSession}= useAuthorization()


  const [receiveModalEnabled, changeReceiveModalStatus] = useGlobalState('receiveModal');
  const [value, update] = useGlobalState('requestCount');

  const [request_amount, onChangeAmount] = useState('')

  const [txFound, setTxFound] = useState(false)
  const [spinnerVisible, changeSpinnerStatus] = useState(false)

  const { connection } = useConnection()
  const { tokenAccounts } = useGetTokenAccounts(publicKey,connection);
  const [selectedTokenState,setSelectedToken] = useState("Solana")


  // const originalReference = useMemo(() => {

  // }, [])
  var originalReference;



  const encodedURL = useMemo(() => {
    originalReference= Keypair.generate().publicKey

    try {
      return encodeURL({ recipient: new PublicKey(publicKey), amount: new BigNumber(Number(request_amount) ? Number(request_amount) : 0),splToken: selectedTokenState == "Solana"? undefined: new PublicKey(selectedTokenState), reference: originalReference, label: "Hi", message: "hi", memo: "OrderId5678" });

    } catch (error) {
      return encodeURL({ recipient: new PublicKey(publicKey), amount: new BigNumber(Number(request_amount) ? Number(request_amount) : 0),splToken: undefined, reference: originalReference, label: "Hi", message: "hi", memo: "OrderId5678" });

      
    }


  }, [publicKey, request_amount,selectedTokenState])


  const ATAinitialized = suspend( async()=>{

    if(selectedTokenState == "Solana") return true;
    console.log(new PublicKey(selectedTokenState));
    
    try {
      const recipientATA = await getAssociatedTokenAddress(new PublicKey(selectedTokenState), publicKey);
      const recipientAccount = await getAccount(connection, recipientATA);
      if (!recipientAccount.isInitialized) return false
      return true
  
      
    } catch (error) {
      console.log(error);
      
      return false
      
    }

    
 

    

  },[selectedTokenState])

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
  var tokens_list = suspend(async()=>{
    return await tokenAccounts()

  },[connection,publicKey])

  const selectedToken = (_token)=>{

    let tokenMint = tokens_list[_token].mint
    

    tokenMint == undefined ? setSelectedToken("Solana"): setSelectedToken(tokenMint.toString())    

  }

  const initAssociatedTokenAccount = async()=>{
    let ata = await getAssociatedTokenAddress(
      new PublicKey(selectedTokenState), // mint
      publicKey, // owner
      false // allow owner off curve
    );
    console.log(`ata: ${ata.toBase58()}`);

    var transaction = new Transaction();
    transaction.add(
      createAssociatedTokenAccountInstruction(
        publicKey, // payer
        ata, // ata
        publicKey, // owner
        new PublicKey(selectedTokenState) // mint
      )
    )
    transaction.feePayer = publicKey;
    let blockhashObj = await connection.getLatestBlockhash();
    transaction.recentBlockhash = await blockhashObj.blockhash;
    const signed_tx = await transact(async wallet => {
      await authorizeSession(wallet)
      return await wallet.signTransactions({
        transactions: [transaction],
      });
    });



    const tx = await connection.sendRawTransaction(signed_tx[0].serialize())
    await connection.confirmTransaction(tx, 'finalized');
  }







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

        {/* <Text></Text> */}
        <Text> Select Token </Text>
        <ModalDropdown onSelect={selectedToken} options={tokens_list.map((e)=> e.mint != undefined ? e.mint : "Solana")}/>
        <Text> Or input token address </Text>

        <TextInput
          style={styles.input}
          onChangeText={setSelectedToken}
          value={selectedTokenState}
          keyboardType="default"
          placeholderTextColor="white"

        />

       
        {
          !ATAinitialized ?(
            <Button onPress={() => initAssociatedTokenAccount()} title="Init Token Account" />

            
          ):(<></>)
        }

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