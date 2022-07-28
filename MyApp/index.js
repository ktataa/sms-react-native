/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';


import {name as appName} from './app.json';
import 'localstorage-polyfill';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import 'intl';
import 'intl/locale-data/jsonp/en';
import "./shim.js";
import crypto from 'crypto'



global.BigInt = require('big-integer')
global.Buffer = require('buffer').Buffer;


global.atob = require("atob");

window.addEventListener = () => {};
window.removeEventListener = () => {};


AppRegistry.registerComponent(appName, () => App);
