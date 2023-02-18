import { useRouter, } from 'next/router';
import { Flex, Heading, Spacer, IconButton, Card, Box, Menu, MenuButton, MenuList, MenuItem, } from '@chakra-ui/react';
import { MdMenu, } from 'react-icons/md';
import { BrowserStorage, } from '../utils';

type Props = {};

const Header = ({}: Props) => {
  const router = useRouter();

  const onClickSignOut = () => {
    BrowserStorage.clear();
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
              <MenuItem fontSize='1rem'>
                sign in
              </MenuItem>
              <MenuItem fontSize='1rem' onClick={onClickSignOut}>
                sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Card>
    </Box>

  );
};

export default Header;
