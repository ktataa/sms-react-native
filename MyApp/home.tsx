import React, { ComponentProps } from 'react';
import { Button, View } from 'react-native';
import ConnectButton from './components/ConnectButton';
import useAuthorization from './utils/useAuthorization';
import MainScreen from './screens/MainScreen';








export default function Home() {



  const { selectedAccount,onChangeAccount,accounts } = useAuthorization();






  return (

    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

      {
        (selectedAccount && accounts)?(
          <MainScreen selectedAccount={selectedAccount} onChange={onChangeAccount} accounts={accounts} ></MainScreen>

        ):
        <ConnectButton mode="contained">Connect</ConnectButton>
      }

    </View>


  )
}
