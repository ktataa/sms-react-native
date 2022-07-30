import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import React from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import useGetTokenAccounts from "../utils/useGetTokenAccounts";
import { suspend } from 'suspend-react'



type Props = {
  publicKey: PublicKey;


};

export default function AccountTokens({ publicKey }: Props) {
  const { connection } = useConnection();
  const { tokenAccounts } = useGetTokenAccounts(publicKey, connection);


  var tokens_list = suspend(async () => {
    return await tokenAccounts()

  }, [connection, publicKey])



  return (
    <View >


      <List.Section style={{ alignItems: "center" }} >
        <List.Subheader>Spl Tokens</List.Subheader>

        {
          tokens_list.map(item => {
            if (item.mint) {
              return (<List.Item style={{ width: 200 }} title={item.mint.slice(0, 10) + "..."} description={"Balance: " + item.balance} left={() => <List.Icon icon="wallet" />} />)
            }
          })
        }

      </List.Section>
    </View>



  );
}

