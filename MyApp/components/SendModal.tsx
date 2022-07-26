

import { PublicKey } from '@solana/web3.js';
import React, { useState } from 'react';
import { Button, View, StyleSheet, TouchableOpacity } from 'react-native';


import { useGlobalState } from '../state';

import { TextInput } from 'react-native-paper';
import SendSol from './SendSOL';


type Props = Readonly<{
    publicKey?: PublicKey;

}>;
export default function SendModal({ publicKey }: Props) {
    const [value, update] = useGlobalState('requestCount');
    const [sendModalEnabled, changeSendModalStatus] = useGlobalState('sendModal');


    const [to_address, onChangeAddress] = useState('');
    const [to_amount, onChangeAmount] = useState('');
    const [scanCode, setScanCode] = useGlobalState('scanCode')








    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>




            <TextInput
                style={styles.input}
                onChangeText={onChangeAddress}
                value={to_address}
                placeholder="To address"
                keyboardType="default"
                placeholderTextColor="white"

            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeAmount}
                value={to_amount}
                placeholder="Amount"
                keyboardType="numeric"
                placeholderTextColor="white"

            />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >

                {
                    publicKey ? (
                        <>
                            <TouchableOpacity style={{ margin: 5 }}>

                                <SendSol to_amount={Number(to_amount)} to_address={to_address} publicKey={publicKey} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ margin: 5 }}>

                                <Button onPress={() => setScanCode(true)} title="Scan" />
                            </TouchableOpacity>

                            <TouchableOpacity style={{ margin: 5 }}>


                                <Button onPress={() => changeSendModalStatus(false)} title="Cancel" />

                            </TouchableOpacity>
                        </>


                    ) : (<></>)
                }


            </View>

        </View>





    );
}
const styles = StyleSheet.create({


    input: {
        height: 40,
        margin: 12,
        borderWidth: 2,
        color: "#007AFF",

        width: '100%',
        borderColor: "white"
    },
})
