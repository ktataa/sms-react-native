import React, { ComponentProps, Suspense, useState } from 'react';

import { Card, Headline, Surface, Button, IconButton } from 'react-native-paper';

import { ActivityIndicator, Text, View,TouchableOpacity } from 'react-native';
import ConnectButton from '../components/ConnectButton';
import AccountInfo from '../components/AccountInfo';
import RequestAirdropBtn from '../components/RequestAirdropBtn';

import Modal from 'react-native-modal';
import useAuthorization, { Account } from '../utils/useAuthorization';

import { useGlobalState } from '../state';
import Receive from '../components/Receive';
import SendModal from '../components/SendModal';
import QRScanner from '../components/QRScanner';
import DisconnectButton from '../components/DisconnectButton';
import AccountTokens from '../components/AccountTokens';
import AccountActions from './AccountActions';









type Props = Readonly<{
    accounts: Account[];
    onChange(nextSelectedAccount: Account): void;
    selectedAccount: Account;
  }>;

export default function AccountsList({ accounts,onChange,selectedAccount}: Props) {


  const [sendModalEnabled, changeSendModalStatus] = useGlobalState('sendModal');
  const [receiveModalEnabled, changeReceiveModalStatus] = useGlobalState('receiveModal');

  const [loaderVisible, setVisibility] = useGlobalState('loaderVisible');
  const [sendAfterScanStatus, setSendAfterScan] = useGlobalState('sendAfterScan');
  const [showAccountActions, setShowAccountActions ] = useState(false)



  const [scanCode, setScanCode] = useGlobalState('scanCode')


//   const { publicKey } = useAuthorization();


const changeSelectedAccount =(account : Account) =>{
  onChange(account)
  setShowAccountActions(true)

  
}






  return (

    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

        {
            showAccountActions?(
<>
                <AccountActions publicKey={selectedAccount.publicKey}   />

                </>

            ):(
                <Surface elevation={4}>
                {
                   accounts?(
                    accounts.map((account,e)=>{
                     return (<>
        
                     <TouchableOpacity onPress={()=> changeSelectedAccount(account)} >
                     
                        <Card.Title  title={"Address index : "+e} />
              <Card.Content>
              <Text>{account.publicKey.toBase58()}</Text>
        
        
              </Card.Content>
              </TouchableOpacity>
                     
                     
                     </>)
                    })
                   ):(<></>)
                }
        
        
           
            </Surface>
            )
        }

    
    </View>
 
  )
}
