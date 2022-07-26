

import { createGlobalState } from 'react-hooks-global-state';

export const { useGlobalState } = createGlobalState({
  requestCount: 0,
  sendModal: false,
  loaderVisible:false,
  receiveModal:false,
  scanCode:false,
  sendAfterScan:false,
  ScanURL:""
});