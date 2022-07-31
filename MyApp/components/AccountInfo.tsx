

import { PublicKey } from '@solana/web3.js';
import React, { Suspense, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity,Clipboard } from 'react-native';
import { Card, Surface } from 'react-native-paper';
import { useGlobalState } from '../state';
import AccountBalance from './AccountBalance';
import Icon from 'react-native-vector-icons/FontAwesome';


type Props = Readonly<{
  publicKey: PublicKey;
}>;


export default function AccountInfo({ publicKey }: Props) {
  const publicKeyBase58String = useMemo(
    () => publicKey?.toBase58(),
    [publicKey],
  );
  const [sendModalEnabled, changeSendModalStatus] = useGlobalState('sendModal');
  const [receiveModalEnabled, changeReceiveModalStatus] = useGlobalState('receiveModal');



  return (
    <Surface elevation={4} style={styles.container}>
<TouchableOpacity  onPress={()=> Clipboard.setString(publicKeyBase58String) } >

      
      <Card.Title title={publicKeyBase58String} />
      </TouchableOpacity>

      <Card.Content>


        <Suspense fallback={<ActivityIndicator />}>
          <AccountBalance publicKey={publicKey} />
        </Suspense>
        <View style={{ flexDirection: 'row' }}>
          <Card.Actions>



            <TouchableOpacity style={{ marginRight: 10 }} >
              <Icon.Button onPress={() => changeSendModalStatus(true)} name='arrow-circle-o-up'
              >
                Send
              </Icon.Button   >
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 10 }} >

              <Icon.Button
                name='arrow-circle-o-down'
                onPress={() => changeReceiveModalStatus(true)}

              >
                Receive
              </Icon.Button>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 10 }} >

              <Icon.Button name='hand-pointer-o'
              >
                Tap to pay
              </Icon.Button>
            </TouchableOpacity>

          </Card.Actions>
        </View>
      </Card.Content>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#42c5f5",
    padding: 10,
    marginLeft: 40,

  },
});