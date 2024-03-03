import { useCallback, useContext } from 'react';
import { MetaMaskContext } from './MetamaskContext';
import { defaultSnapOrigin } from '@/config';

export type CallSCParams = {
  nickname: string;
  fee: string;
  functionName: string;
  at: string;
  args: Array<number>;
  coins: string;
  nonPersistentExecution?: {
    isNPE: boolean;
    maxGas: string;
  }
}

export type CallSCResponse = {
  operationId: string;
}

export const useCallSC = () => {
  const { provider } = useContext(MetaMaskContext);

  return useCallback((params: CallSCParams) => provider?.request<CallSCResponse>({
    method: "wallet_invokeSnap",
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method:"account.callSC",
        params
      }
    }
  }), [provider]);
}