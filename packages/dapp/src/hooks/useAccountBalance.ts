import { useCallback, useContext, useEffect } from 'react';
import useSWR, { mutate } from 'swr';

import { MetaMaskContext } from './MetamaskContext';
import { useNetwork } from './useNetwork';

import { defaultSnapOrigin } from '@/config';

export type AccountBalanceResponse = {
  finalBalance: string;
  candidateBalance: string;
};

export const invalidateAccountBalance = () => {
  mutate('account.balance');
};

/**
 * @description Hook that calls the metamask provider to get the account balance
 * @param params - The account address (optional, default is the active account)
 * @returns The account final and candidate balance
 */
export const useAccountBalance = () => {
  const { provider } = useContext(MetaMaskContext);
  const { data: network } = useNetwork();
  const fetcher = useCallback(
    async () =>
      provider?.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: defaultSnapOrigin,
          request: {
            method: 'account.balance',
          },
        },
      }) as Promise<AccountBalanceResponse>,
    [provider],
  );

  useEffect(() => {
    if (provider) {
      invalidateAccountBalance();
    }
  }, [provider, network]);

  return useSWR('account.balance', fetcher);
};
