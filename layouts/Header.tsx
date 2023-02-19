import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import { Box, Card, Flex, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, } from '@chakra-ui/react';
import { MdMenu, } from 'react-icons/md';
import { BrowserStorage, } from '../utils';
import { useRecoilState, } from 'recoil';
import sessionInfoAtom from '../recoil/sessionInfo';
import { AccountAuth, SessionInfo, } from '../interfaces';

type Props = {
  title?: string,
};

const Header = ({
  title = '이리콤',
}: Props) => {
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
        <Flex padding='.6rem' alignItems='center'>
          <Heading color='gray.700' size='md'>{title}</Heading>
          <Spacer/>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MdMenu/>}
              variant='ghost'
            >
            </MenuButton>
            <MenuList>
              {sessionInfo && sessionInfo.myInformation.account.auth === AccountAuth.SYSTEM_ADMIN && <NextLink href='/admin/board'>
                <MenuItem fontSize='1rem'>
                  관리자 페이지
                </MenuItem>
              </NextLink>}
              {sessionInfo && <MenuItem>
                내 정보
              </MenuItem>}
              {!sessionInfo && <MenuItem fontSize='1rem' onClick={onClickSignIn}>
                로그인
              </MenuItem>}
              {sessionInfo && <MenuItem fontSize='1rem' onClick={onClickSignOut}>
                로그아웃
              </MenuItem>}
            </MenuList>
          </Menu>
        </Flex>
      </Card>
    </Box>
  );
};

export default Header;
