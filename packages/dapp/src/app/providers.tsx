// app/providers.tsx
'use client';

import { ChakraProvider } from '@chakra-ui/react';

import { MetaMaskProvider } from '@/hooks/MetamaskContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <MetaMaskProvider>{children}</MetaMaskProvider>
    </ChakraProvider>
  );
}
