// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import { Box, Button, Card, CardBody, Flex, Heading, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, } from '@chakra-ui/react';
import { MdMenu, } from 'react-icons/md';
// etc
import { Account, AccountAuth, TokenInfo, } from '../interfaces';
import { MAX_WIDTH, } from '../constants/style';
// store
import { BrowserStorage, } from '../utils';
import { useRecoilState, } from 'recoil';
import { myAccountAtom, } from '../recoil';

type Props = {
  title?: string,
};

enum HeaderState {
  NONE,
  NOT_LOGIN,
  ACCOUNT,
  BOARD_ADMIN,
  SYSTEM_ADMIN,
}

const Header = ({
  title = '이리콤',
}: Props) => {
  const router = useRouter();
  const [myAccount, setMyAccount,] = useRecoilState<Account | null>(myAccountAtom);
  const [state, setState,] = useState<HeaderState>(HeaderState.NONE);

  useEffect(() => {
    const storageTokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
    if (storageTokenInfo === null) {
      setState(HeaderState.NOT_LOGIN);
    } else if (myAccount === null || myAccount.auth === AccountAuth.ACCOUNT) {
      setState(HeaderState.ACCOUNT);
    } else if (myAccount.auth === AccountAuth.BOARD_ADMIN) {
      setState(HeaderState.BOARD_ADMIN);
    } else if (myAccount.auth === AccountAuth.SYSTEM_ADMIN) {
      setState(HeaderState.SYSTEM_ADMIN);
    }
  }, [myAccount,]);

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

  const getRightElement = (): JSX.Element => {
    if (state === HeaderState.NOT_LOGIN) {
      return <Link as={NextLink} href='/login'>
        <Button size='sm' variant='outline'>로그인</Button>
      </Link>;
    } else if (state === HeaderState.ACCOUNT || state === HeaderState.BOARD_ADMIN) {
      return accountMenu;
    } else if (state === HeaderState.SYSTEM_ADMIN) {
      return systemAdminMenu;
    } else {
      return <></>;
    }
  };

  return (
    <Box backgroundColor='white'>
      <Card shadow='none' borderRadius='0' maxWidth={MAX_WIDTH} marginLeft='auto' marginRight='auto'>
        <CardBody paddingLeft='1rem' paddingRight='1rem' paddingTop='0.8rem' paddingBottom='0.8rem'>
          <Flex flexDirection='row' alignItems='center' height='2rem'>
            <Link as={NextLink} marginRight='auto' href='/' _hover={{ textDecoration: 'none', }}>
              <Heading color='gray.700' size='md'>{title}</Heading>
            </Link>
            {getRightElement()}
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Header;
