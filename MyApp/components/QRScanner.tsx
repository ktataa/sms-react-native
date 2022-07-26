

import { PublicKey } from '@solana/web3.js';
import React, { useState } from 'react';
import { Button, View, StyleSheet } from 'react-native';


import { useGlobalState } from '../state';

import { TextInput } from 'react-native-paper';
import SendSol from './SendSOL';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import SendAfterScan from './SendAfterScan';
type Props = Readonly<{
    publicKey: PublicKey;

}>;


export default function QRScanner({publicKey}:Props) {
    const [value, update] = useGlobalState('requestCount');

    const [QRscanned,setQRscanned] = useState(false)
    const [url, setURL] = useState('');




  
  
  
  
    const onRead = async (_e: any) => {
      console.log(_e.data);
      setURL(_e?.data)
    //   setScanCode(false)
    setQRscanned(true)
    //   setSendAfterScan(true)
  
    };







    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

            {
                !QRscanned?(
                    <QRCodeScanner 
                    onRead={onRead}
                    flashMode={RNCamera.Constants.FlashMode.torch}
    
                />

                ):(
                    <View style={{ backgroundColor: "#FFFFFF" }} >

                    <SendAfterScan publicKey={publicKey} url={url} />
                 </View>
                     

                )
            }

        
  

        </View>





    );
}
// const styles = StyleSheet.create({


//     input: {
//         height: 40,
//         margin: 12,
//         borderWidth: 2,
//         color: "#007AFF",

//         width: '100%',
//         borderColor: "white"
//     },
// })
