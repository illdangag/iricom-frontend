import { useRouter, } from 'next/router';
import { Flex, Heading, Spacer, IconButton, Card, Box, Menu, MenuButton, MenuList, MenuItem, } from '@chakra-ui/react';
import { MdMenu, } from 'react-icons/md';
import { BrowserStorage, } from '../utils';
import { useRecoilState, } from 'recoil';
import sessionInfoAtom from '../recoil/sessionInfo';
import { SessionInfo, } from '../interfaces';

type Props = {};

const Header = ({}: Props) => {
  const router = useRouter();
  const [sessionInfo, setSessionInfo,] = useRecoilState<SessionInfo | null>(sessionInfoAtom);

  const onClickSignIn = () => {
    void router.push('/login');
  };

  const onClickSignOut = () => {
    BrowserStorage.clear();
    setSessionInfo(null);
    void router.push('/');
  };

  return (
    <Box padding='0.8rem'>
      <Card shadow='none'>
        <Flex padding='.8rem' alignItems='center'>
          <Heading color='gray.700' size='lg'>이리콤</Heading>
          <Spacer/>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MdMenu/>}
              variant='ghost'
            >
            </MenuButton>
            <MenuList>
              {sessionInfo === null && <MenuItem fontSize='1rem' onClick={onClickSignIn}>
                sign in
              </MenuItem>}
              {sessionInfo !== null && <MenuItem fontSize='1rem' onClick={onClickSignOut}>
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
