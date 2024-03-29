import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { CHAIN_ID } from '@massalabs/massa-web3';
import { useMemo } from 'react';

import { invalidateNetwork, useNetwork } from '@/hooks/useNetwork';
import { invalidateOperations } from '@/hooks/useOperations';
import { useSetNetwork } from '@/hooks/useSetNetwork';
import { invalidateTokens } from '@/hooks/useTokens';

const networkList = [
  { id: CHAIN_ID.MainNet, name: 'Mainnet' },
  { id: CHAIN_ID.BuildNet, name: 'Buildnet' },
];

export const NetworkMenu = () => {
  const { data: activeNetwork } = useNetwork();
  const setNetwork = useSetNetwork();

  const activeNetworkDisplay = useMemo(() => {
    if (activeNetwork === undefined) {
      return;
    }
    return networkList.find(
      (network) => network.id === BigInt(activeNetwork.network),
    )?.name;
  }, [activeNetwork]);

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {activeNetworkDisplay ?? <Spinner />}
      </MenuButton>
      <MenuList>
        {networkList.map((network) => (
          <MenuItem
            key={network.id}
            onClick={async () => {
              await setNetwork({ network: network.id.toString() });
              invalidateNetwork();
              invalidateTokens();
              invalidateOperations();
            }}
          >
            {network.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
