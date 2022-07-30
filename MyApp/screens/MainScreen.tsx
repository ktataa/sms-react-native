import React, { ComponentProps, Suspense } from 'react';

import { Card, Headline, Surface, Button, IconButton } from 'react-native-paper';

import { ActivityIndicator, Text, View, TouchableOpacity } from 'react-native';
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
import AccountsList from '../components/AccountsList';









type Props = Readonly<{
  accounts: Account[];
  onChange(nextSelectedAccount: Account): void;
  selectedAccount: Account;
}>;

export default function MainScreen({ accounts, onChange, selectedAccount }: Props) {

  return (

    <AccountsList selectedAccount={selectedAccount} onChange={onChange} accounts={accounts} ></AccountsList>
  )
}
