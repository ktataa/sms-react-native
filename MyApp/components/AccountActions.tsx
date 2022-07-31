import React, { Suspense } from 'react';


import { ActivityIndicator, Text, View } from 'react-native';
import ConnectButton from './ConnectButton';
import AccountInfo from './AccountInfo';
import RequestAirdropBtn from './RequestAirdropBtn';

import Modal from 'react-native-modal';

import { useGlobalState } from '../state';
import Receive from './Receive';
import SendModal from './SendModal';
import QRScanner from './QRScanner';
import DisconnectButton from './DisconnectButton';
import AccountTokens from './AccountTokens';
import { PublicKey } from '@solana/web3.js';
import { Button } from 'react-native-paper';









type Props = Readonly<{
    publicKey: PublicKey;
}>;

export default function AccountActions({ publicKey }: Props) {


    const [sendModalEnabled, changeSendModalStatus] = useGlobalState('sendModal');
    const [receiveModalEnabled, changeReceiveModalStatus] = useGlobalState('receiveModal');

    const [loaderVisible, setVisibility] = useGlobalState('loaderVisible');
    const [sendAfterScanStatus, setSendAfterScan] = useGlobalState('sendAfterScan');
    const [showAccountActions, setShowAccountActions ] = useGlobalState("showAccountActions")



    const [scanCode, setScanCode] = useGlobalState('scanCode')








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

                        <View style={{flexDirection:"row"}} >
                        <Button onPress={()=>  setShowAccountActions(false) } > Return </Button>
                        <RequestAirdropBtn publicKey={publicKey} />



                        </View>



                        <DisconnectButton>Disconnect</DisconnectButton>
                        <Suspense fallback={<ActivityIndicator />}>
                            <AccountTokens publicKey={publicKey} />
                        </Suspense>


                    </>

                ) : ( <ConnectButton mode="contained">Connect</ConnectButton> )
            }

        </View>




    )
}
