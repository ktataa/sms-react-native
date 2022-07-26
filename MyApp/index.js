/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
// import Home from './home';
// import ConnectButton from './components/ConnectButton';

import {name as appName} from './app.json';
import 'localstorage-polyfill';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import 'intl';
import 'intl/locale-data/jsonp/en';
global.BigInt = require('big-integer')
global.Buffer = require('buffer').Buffer;

global.atob = require("atob");
// global.Blob = require('node-blob');
// Mock event listener functions to prevent them from fataling.
window.addEventListener = () => {};
window.removeEventListener = () => {};
// window.atob =  () => {};
// window.open = () => {};

AppRegistry.registerComponent(appName, () => App);
