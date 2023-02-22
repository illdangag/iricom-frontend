import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import { Box, Card, Flex, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, Spacer, } from '@chakra-ui/react';
import { MdMenu, } from 'react-icons/md';
import { BrowserStorage, } from '../utils';
import { useRecoilState, } from 'recoil';
import tokenInfoAtom from '../recoil/tokenInfo';
import { TokenInfo, } from '../interfaces';
import { useEffect, } from 'react';
import { useIricomAPI, } from '../hooks';

type Props = {
  title?: string,
};

const Header = ({
  title = '이리콤',
}: Props) => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();
  const [tokenInfo, setTokenInfo,] = useRecoilState<TokenInfo | null>(tokenInfoAtom);

  const onClickSignOut = () => {
    BrowserStorage.clear();
    setTokenInfo(null);
    void router.push('/');
  };

  // TODO TokenInfo와 계정의 권한에 따라 메뉴 처리
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
              {tokenInfo && <NextLink href='/admin/board'>
                <MenuItem fontSize='1rem'>
                  관리자 페이지
                </MenuItem>
              </NextLink>}
              {tokenInfo && <MenuItem>
                내 정보
              </MenuItem>}
              {!tokenInfo && <NextLink href='/login'>
                <MenuItem fontSize='1rem'>
                  로그인
                </MenuItem>
              </NextLink>}
              {tokenInfo && <MenuItem fontSize='1rem' onClick={onClickSignOut}>
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
