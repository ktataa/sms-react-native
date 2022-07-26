import React, { ComponentProps } from 'react';


import { Button, Text, View } from 'react-native';
import ConnectButton from './components/ConnectButton';
import AccountInfo from './components/AccountInfo';
import RequestAirdropBtn from './components/RequestAirdropBtn';

import Modal from 'react-native-modal';
import useAuthorization from './utils/useAuthorization';

import { useGlobalState } from './state';
import Receive from './components/Receive';
import SendModal from './components/SendModal';
import QRScanner from './components/QRScanner';









type Props = Readonly<ComponentProps<typeof Button>>;

export default function Home(props: Props) {


  const [sendModalEnabled, changeSendModalStatus] = useGlobalState('sendModal');
  const [receiveModalEnabled, changeReceiveModalStatus] = useGlobalState('receiveModal');

  const [loaderVisible, setVisibility] = useGlobalState('loaderVisible');
  const [sendAfterScanStatus, setSendAfterScan] = useGlobalState('sendAfterScan');



  const [scanCode, setScanCode] = useGlobalState('scanCode')


  const { publicKey } = useAuthorization();






  return (

    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

      <Modal backdropColor='white' isVisible={sendModalEnabled || receiveModalEnabled} animationIn="slideInUp">
        {


          !loaderVisible ? (

            (sendModalEnabled && !scanCode && !sendAfterScanStatus && publicKey) ? (

              <SendModal publicKey={publicKey} />




            ) : (receiveModalEnabled && publicKey) ? (




              <Receive publicKey={publicKey} />



            ) : (sendModalEnabled && scanCode) ? (

              <>
                {
                  publicKey ? (
                    <QRScanner publicKey={publicKey} />


                  ) : (
                    <></>
                  )
                }




              </>
            ) :
              (<></>)


          ) : (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

              <Text style={{ color: "#000000" }} >Sending..</Text>
            </View>




          )

        }

      </Modal>


      {
        publicKey ? (
          <>
            <AccountInfo publicKey={publicKey} />

            <RequestAirdropBtn publicKey={publicKey} />


          </>

        ) : (<ConnectButton mode="contained">Connect</ConnectButton>
        )
      }


    </View>


  )
}
