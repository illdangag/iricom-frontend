// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import { Avatar, Box, Button, Card, CardBody, Flex, Heading, HStack, Icon, Link, Menu, MenuButton, MenuItem, MenuList, Text, } from '@chakra-ui/react';
import { MdOutlineNotifications, } from 'react-icons/md';
// etc
import { Account, AccountAuth, PersonalMessageList, TokenInfo, } from '@root/interfaces';
import { MAX_WIDTH, } from '@root/constants/style';
// store
import { BrowserStorage, } from '@root/utils';
import { useRecoilState, } from 'recoil';
import { myAccountAtom, unreadPersonalMessageListAtom, } from '@root/recoil';

type Props = {
  title?: string,
};

enum HeaderState {
  NONE = 'NONE',
  NOT_LOGIN = 'NOT_LOGIN',
  UNREGISTERED_ACCOUNT = 'UNREGISTERED_ACCOUNT',
  ACCOUNT = 'ACCOUNT',
  BOARD_ADMIN = 'BOARD_ADMIN',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
}

const Header = ({
  title = '이리콤',
}: Props) => {
  const router = useRouter();

  const [account, setAccount,] = useRecoilState<Account | null>(myAccountAtom);
  const [unreadPersonalMessageList, setUnreadPersonalMessageList,] = useRecoilState<PersonalMessageList>(unreadPersonalMessageListAtom);

  const [state, setState,] = useState<HeaderState>(HeaderState.NONE);

  useEffect(() => {
    const storageTokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
    if (storageTokenInfo === null) {
      setState(HeaderState.NOT_LOGIN);
    } else if (account === null || account.auth === AccountAuth.UNREGISTERED_ACCOUNT) {
      setState(HeaderState.UNREGISTERED_ACCOUNT);
    } else if (account.auth === AccountAuth.ACCOUNT) {
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
    setUnreadPersonalMessageList(new PersonalMessageList());
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
      <NextLink href='/message'>
        <MenuItem>
          쪽지함
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
      <NextLink href='/message'>
        <MenuItem>
          쪽지함
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
      <NextLink href='/message'>
        <MenuItem>
          쪽지함
        </MenuItem>
      </NextLink>
      <MenuItem fontSize='1rem' onClick={onClickSignOut}>
        로그아웃
      </MenuItem>
    </MenuList>
  </Menu>;

  const unregisteredAccountMenu = <Menu>
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
    } else if (state === HeaderState.UNREGISTERED_ACCOUNT) {
      return unregisteredAccountMenu;
    } else {
      return accountMenu;
    }
  };

  const newPersonalMessageButton = <Link as={NextLink} href='/message'>
    <Button variant='ghost' size='sm' marginRight='0.2rem' padding='0'>
      <Box position='relative'>
        <Icon as={MdOutlineNotifications} boxSize='6'/>
        <Box width='0.4rem' height='0.4rem' borderRadius='0.4rem' backgroundColor='red' position='absolute' right='0' top='0'/>
      </Box>
    </Button>
  </Link>;

  return (
    <Box backgroundColor='white'>
      <Card shadow='none' borderRadius='0' maxWidth={MAX_WIDTH} marginLeft='auto' marginRight='auto'>
        <CardBody paddingLeft='1rem' paddingRight='1rem' paddingTop='0.8rem' paddingBottom='0.8rem'>
          <Flex flexDirection='row' alignItems='center' height='2rem'>
            <Link as={NextLink} marginRight='auto' href='/' _hover={{ textDecoration: 'none', }}>
              <Heading color='gray.700' size='md'>{title}</Heading>
            </Link>
            <HStack marginLeft='0.4rem'>
              {unreadPersonalMessageList && unreadPersonalMessageList.total > 0 && newPersonalMessageButton}
              {getRightElement()}
            </HStack>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Header;
