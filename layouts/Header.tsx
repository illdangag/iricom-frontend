// react
import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import { Box, Card, CardBody, Heading, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, Flex, } from '@chakra-ui/react';
import { MdMenu, } from 'react-icons/md';
// etc
import { AccountAuth, Account, TokenInfo, } from '../interfaces';
// store
import { BrowserStorage, } from '../utils';
import { useRecoilState, } from 'recoil';
import { myAccountAtom, } from '../recoil';
import { useEffect, useState, } from 'react';

type Props = {
  title?: string,
};

const Header = ({
  title = '이리콤',
}: Props) => {
  const router = useRouter();
  const [myAccount, setMyAccount,] = useRecoilState<Account | null>(myAccountAtom);
  const [tokenInfo, setTokenInfo,] = useState<TokenInfo | null>(null);

  useEffect(() => {
    const storageTokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
    setTokenInfo(storageTokenInfo);
  }, []);

  const onClickSignOut = () => {
    BrowserStorage.clear();
    setTokenInfo(null);
    setMyAccount(null);
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
    <NextLink href='/info'>
      <MenuItem>
        내 정보
      </MenuItem>
    </NextLink>
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
    <NextLink href='/info'>
      <MenuItem>
        내 정보
      </MenuItem>
    </NextLink>
    <MenuItem fontSize='1rem' onClick={onClickSignOut}>
      로그아웃
    </MenuItem>
  </>;

  const getMenu = () => {
    if (tokenInfo === null) {
      return getLogoutMenu;
    }

    if (myAccount === null) {
      return getLoginMenu;
    } else if (myAccount.auth === AccountAuth.SYSTEM_ADMIN) {
      return getSystemAdminMenu;
    } else {
      return getAccountMenu;
    }
  };

  return (
    <Box>
      <Card shadow='none'>
        <CardBody paddingTop='0.4rem' paddingBottom='0.4rem'>
          <Flex justifyContent='space-between' alignItems='center'>
            <NextLink href='/'>
              <Heading color='gray.700' size='md'>{title}</Heading>
            </NextLink>
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
        </CardBody>
      </Card>
    </Box>
  );
};

export default Header;
