// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import { Box, Button, Card, CardBody, Flex, Heading, Link, Menu, MenuButton, MenuItem, MenuList, Avatar, Text, } from '@chakra-ui/react';
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
  NONE = 'NONE',
  NOT_LOGIN = 'NOT_LOGIN',
  ACCOUNT = 'ACCOUNT',
  BOARD_ADMIN = 'BOARD_ADMIN',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
}

const Header = ({
  title = '이리콤',
}: Props) => {
  const router = useRouter();
  const [account, setAccount,] = useRecoilState<Account | null>(myAccountAtom);
  const [state, setState,] = useState<HeaderState>(HeaderState.NONE);

  useEffect(() => {
    const storageTokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
    if (storageTokenInfo === null) {
      setState(HeaderState.NOT_LOGIN);
    } else if (account === null || account.auth === AccountAuth.ACCOUNT) {
      setState(HeaderState.ACCOUNT);
    } else if (account.auth === AccountAuth.BOARD_ADMIN) {
      setState(HeaderState.BOARD_ADMIN);
    } else if (account.auth === AccountAuth.SYSTEM_ADMIN) {
      setState(HeaderState.SYSTEM_ADMIN);
    }
  }, [account,]);

  const onClickSignOut = () => {
    BrowserStorage.clear();
    setAccount(null);
    void router.push('/');
  };

  const loginButton = <MenuButton as={Button} variant='outline' size='sm' borderColor='gray.300'>
    <Flex alignItems='center'>
      <Avatar bg='gray.400' size='2xs'/>
      <Box marginLeft='0.4rem'>
        <Text fontSize='xs' color='gray.600'>{account && (account.nickname || account.email)}</Text>
      </Box>
    </Flex>
  </MenuButton>;

  const systemAdminMenu = <Menu isLazy>
    {loginButton}
    <MenuList>
      <NextLink href='/admin'>
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

  const boardAdminMenu = <Menu isLazy>
    {loginButton}
    <MenuList>
      <NextLink href='/admin'>
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
    {loginButton}
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
    } else if (state === HeaderState.SYSTEM_ADMIN) {
      return systemAdminMenu;
    } else if (state === HeaderState.BOARD_ADMIN) {
      return boardAdminMenu;
    } else {
      return accountMenu;
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
            <Box marginLeft='0.4rem'>
              {getRightElement()}
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Header;
