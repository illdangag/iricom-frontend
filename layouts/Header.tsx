// react
import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import { Box, Card, Flex, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, } from '@chakra-ui/react';
import { MdMenu, } from 'react-icons/md';
// etc
import { AccountAuth, MyAccountInfo, TokenInfo, } from '../interfaces';
// store
import { BrowserStorage, } from '../utils';
import { useRecoilState, } from 'recoil';
import { myAccountInfoAtom, } from '../recoil';
import { useEffect, useState, } from 'react';

type Props = {
  title?: string,
};

const Header = ({
  title = '이리콤',
}: Props) => {
  const router = useRouter();
  const [myAccountInfo, setMyAccountInfo,] = useRecoilState<MyAccountInfo | null>(myAccountInfoAtom);
  const [tokenInfo, setTokenInfo,] = useState<TokenInfo | null>(null);

  useEffect(() => {
    const storageTokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
    setTokenInfo(storageTokenInfo);
  }, []);

  const onClickSignOut = () => {
    BrowserStorage.clear();
    setTokenInfo(null);
    setMyAccountInfo(null);
    void router.push('/');
  };

  const getLogoutMenu = <>
    <NextLink href='/login'>
      <MenuItem fontSize='1rem'>
        로그인
      </MenuItem>
    </NextLink>
  </>;

  const getLoginMenu = <>
    <MenuItem fontSize='1rem' onClick={onClickSignOut}>
      로그아웃
    </MenuItem>
  </>;

  const getAccountMenu = <>
    <MenuItem>
      내 정보
    </MenuItem>
    <MenuItem fontSize='1rem' onClick={onClickSignOut}>
      로그아웃
    </MenuItem>
  </>;

  const getSystemAdminMenu = <>
    <NextLink href='/admin/board'>
      <MenuItem fontSize='1rem'>
        관리자 페이지
      </MenuItem>
    </NextLink>
    <MenuItem>
      내 정보
    </MenuItem>
    <MenuItem fontSize='1rem' onClick={onClickSignOut}>
      로그아웃
    </MenuItem>
  </>;

  const getMenu = () => {
    if (tokenInfo === null) {
      return getLogoutMenu;
    }

    if (myAccountInfo === null) {
      return getLoginMenu;
    } else if (myAccountInfo.account.auth === AccountAuth.SYSTEM_ADMIN) {
      return getSystemAdminMenu;
    } else {
      return getAccountMenu;
    }
  };

  return (
    <Box>
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
              {getMenu()}
            </MenuList>
          </Menu>
        </Flex>
      </Card>
    </Box>
  );
};

export default Header;
