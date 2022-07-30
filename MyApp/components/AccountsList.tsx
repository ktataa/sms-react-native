import React, { ComponentProps, Suspense, useState } from 'react';

import { Card, Headline, Surface, Button, IconButton } from 'react-native-paper';

import { Text, View,TouchableOpacity } from 'react-native';

import { Account } from '../utils/useAuthorization';

import AccountActions from './AccountActions';
import { useGlobalState } from '../state';









type Props = Readonly<{
    accounts: Account[];
    onChange(nextSelectedAccount: Account): void;
    selectedAccount: Account;
  }>;

export default function AccountsList({ accounts,onChange,selectedAccount}: Props) {
  const [showAccountActions, setShowAccountActions ] = useGlobalState("showAccountActions")



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
