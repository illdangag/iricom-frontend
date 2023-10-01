// react
import { useEffect, } from 'react';
import { GetServerSideProps, } from 'next/types';
import NextLink from 'next/link';
import { Card, CardBody, Divider, Heading, LinkBox, LinkOverlay, Text, VStack, } from '@chakra-ui/react';

import { MainLayout, PageBody, } from '../../layouts';
import { PageTitle, } from '../../components';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../../recoil';

// etc
import { BORDER_RADIUS, } from '../../constants/style';
import iricomAPI from '../../utils/iricomAPI';
import { getTokenInfoByCookies, } from '../../utils';
import { Account, AccountAuth, TokenInfo, } from '../../interfaces';

type Props = {
  account: Account | null,
}

const AdminPage = (props: Props) => {
  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    setAccount(props.account);
  }, []);

  return <MainLayout>
    <PageBody>
      <PageTitle title='관리자 페이지'/>
      <VStack spacing='1rem' alignItems='stretch'>
        {props && props.account && props.account.auth === AccountAuth.SYSTEM_ADMIN && <Card
          shadow={{
            base: 'none',
            md: 'sm',
          }}
          borderRadius={{
            base: '0',
            md: BORDER_RADIUS,
          }}
        >
          <CardBody>
            <VStack spacing='1rem'>
              <LinkBox width='100%'>
                <Heading size='sm'>
                  <LinkOverlay as={NextLink} href='/admin/board/create'>게시판 생성</LinkOverlay>
                  <Text fontSize='sm' fontWeight='normal'>새로운 게시판을 생성합니다.</Text>
                </Heading>
              </LinkBox>
              <Divider/>
              <LinkBox width='100%'>
                <Heading size='sm'>
                  <LinkOverlay as={NextLink} href='/admin/board/edit'>게시판 수정</LinkOverlay>
                  <Text fontSize='sm' fontWeight='normal'>게시판 정보를 수정합니다.</Text>
                </Heading>
              </LinkBox>
              <Divider/>
              <LinkBox width='100%'>
                <Heading size='sm'>
                  <LinkOverlay as={NextLink} href='/admin/board/admin'>게시판 관리자 설정</LinkOverlay>
                  <Text fontSize='sm' fontWeight='normal'>게시판에 관리자를 설정합니다.</Text>
                  <Text fontSize='sm' fontWeight='normal'>게시판 관리자는 해당 게시판에 공지사항을 작성 할 수 있으며, 게시물을 차단 할 수 있습니다.</Text>
                </Heading>
              </LinkBox>
            </VStack>
          </CardBody>
        </Card>}
        {props && props.account && (props.account.auth === AccountAuth.SYSTEM_ADMIN || props.account.auth === AccountAuth.BOARD_ADMIN) && <Card
          shadow={{
            base: 'none',
            md: 'sm',
          }}
          borderRadius={{
            base: '0',
            md: BORDER_RADIUS,
          }}
        >
          <CardBody>
            <LinkBox width='100%'>
              <Heading size='sm'>
                <LinkOverlay as={NextLink} href='/admin/reports/boards'>게시물 신고 내역</LinkOverlay>
                <Text fontSize='sm' fontWeight='normal'>신고된 게시물 목록을 조회합니다</Text>
              </Heading>
            </LinkBox>
          </CardBody>
        </Card>}
      </VStack>
    </PageBody>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo === null) {
    return {
      notFound: true,
    };
  }

  const account: Account = await iricomAPI.getMyAccount(tokenInfo);
  const auth: AccountAuth = account.auth;

  if (auth !== AccountAuth.SYSTEM_ADMIN && auth !== AccountAuth.BOARD_ADMIN) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      account,
    },
  };
};

export default AdminPage;

