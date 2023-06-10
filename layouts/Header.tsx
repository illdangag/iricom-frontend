// react
import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import { Box, Card, CardBody, Flex, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, Button, Link, } from '@chakra-ui/react';
import { MdMenu, } from 'react-icons/md';
// etc
import { Account, AccountAuth, } from '../interfaces';
import { MAX_WIDTH, } from '../constants/style';
// store
import { BrowserStorage, } from '../utils';
import { useRecoilState, } from 'recoil';
import { myAccountAtom, } from '../recoil';

type Props = {
  title?: string,
};

const Header = ({
  title = '이리콤',
}: Props) => {
  const router = useRouter();
  const [myAccount, setMyAccount,] = useRecoilState<Account | null>(myAccountAtom);

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
      return <Link as={NextLink} href='/login'>
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
        <CardBody paddingLeft='1rem' paddingRight='1rem' paddingTop='0.8rem' paddingBottom='0.8rem'>
          <Flex flexDirection='row' alignItems='center' height='2rem'>
            <Link as={NextLink} marginRight='auto' href='/' _hover={{ textDecoration: 'none', }}>
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
