import { useRouter, } from 'next/router';
import { Flex, Heading, Spacer, IconButton, Card, Box, Menu, MenuButton, MenuList, MenuItem, } from '@chakra-ui/react';
import { MdMenu, } from 'react-icons/md';
import { BrowserStorage, } from '../utils';
import { Account, } from '../interfaces';
import { useRecoilState, } from 'recoil';
import accountAtom, {} from '../recoil/account';

type Props = {};

const Header = ({}: Props) => {
  const router = useRouter();
  const [account, setAccount,] = useRecoilState<Account | null>(accountAtom);

  const onClickSignIn = () => {
    void router.push('/login');
  };

  const onClickSignOut = () => {
    BrowserStorage.clear();
    setAccount(null);
    void router.push('/');
  };

  return (
    <Box padding='0.8rem'>
      <Card shadow='none'>
        <Flex padding='.8rem' alignItems='center'>
          <Heading color='gray.700' size='lg'>Iricom</Heading>
          <Spacer/>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MdMenu/>}
              variant='ghost'
            >
            </MenuButton>
            <MenuList>
              {account === null && <MenuItem fontSize='1rem' onClick={onClickSignIn}>
                sign in
              </MenuItem>}
              {account !== null && <MenuItem fontSize='1rem' onClick={onClickSignOut}>
                sign out
              </MenuItem>}
            </MenuList>
          </Menu>
        </Flex>
      </Card>
    </Box>
  );
};

export default Header;
