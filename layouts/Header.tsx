// react
import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import { Box, Card, CardBody, Flex, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, Button, Link, } from '@chakra-ui/react';
import { MdMenu, } from 'react-icons/md';
// etc
import { Account, AccountAuth, TokenInfo, } from '../interfaces';
import { MAX_WIDTH, } from '../constants/style';
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

  useEffect(() => {
    const storageTokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
  }, []);

  const onClickSignOut = () => {
    BrowserStorage.clear();
    setMyAccount(null);
    void router.push('/');
  };

  const systemAdminMenu = <Menu>
    <MenuButton
      as={IconButton}
      icon={<MdMenu/>}
      variant='ghost'
      size='sm'
    />
    <MenuList>
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
    </MenuList>
  </Menu>;

  const accountMenu = <Menu>
    <MenuButton
      as={IconButton}
      icon={<MdMenu/>}
      variant='ghost'
      size='sm'
    />
    <MenuList>
      <NextLink href='/info'>
        <MenuItem>
          내 정보
        </MenuItem>
      </NextLink>
      <MenuItem fontSize='1rem' onClick={onClickSignOut}>
        로그아웃
      </MenuItem>
    </MenuList>
  </Menu>;

  const getTest = (): JSX.Element => {
    if (myAccount === null) { // 로그아웃 상태
      return <Link href='/login'>
        <Button size='sm' variant='outline'>로그인</Button>
      </Link>;
    } else if (myAccount.auth === AccountAuth.SYSTEM_ADMIN) { // 시스템 관리자
      return systemAdminMenu;
    } else { // 일반 사용자 또는 게시판 관리자
      return accountMenu;
    }
  };

  return (
    <Box backgroundColor='white'>
      <Card shadow='none' borderRadius='0' maxWidth={MAX_WIDTH} marginLeft='auto' marginRight='auto'>
        <CardBody paddingTop='0.8rem' paddingBottom='0.8rem'>
          <Flex flexDirection='row' alignItems='center' height='2rem'>
            <Link marginRight='auto' href='/'>
              <Heading color='gray.700' size='md'>{title}</Heading>
            </Link>
            {getTest()}
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Header;
