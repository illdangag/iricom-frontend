// react
import React, { useEffect, } from 'react';
import NextLink from 'next/link';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, CardHeader, Divider, Heading, LinkBox, LinkOverlay, Text, VStack, } from '@chakra-ui/react';

import { PageBody, } from '../../../layouts';
import MainLayout from '../../../layouts/MainLayout';
import { PageTitle, } from '../../../components';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../../../recoil';

// etc
import { Account, AccountAuth, TokenInfo, } from '../../../interfaces';
import { BORDER_RADIUS, } from '../../../constants/style';
import { getTokenInfoByCookies, } from '../../../utils';
import iricomAPI from '../../../utils/iricomAPI';

type Props = {
  account: Account | null,
}

const AdminBoardPage = (props: Props) => {

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    setAccount(props.account);
  }, []);

  return (
    <MainLayout>
      <PageBody>
        <PageTitle
          title='관리자 페이지'
          descriptions={['게시판 생성 및 수정, 게시판의 관리자를 관리합니다',]}
        />
        <Card
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
        >
          <CardHeader paddingBottom='0'>
            <Heading size='md'>게시판</Heading>
          </CardHeader>
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
        </Card>
      </PageBody>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo === null) {
    return {
      notFound: true,
    };
  }

  const account: Account = await iricomAPI.getMyAccount(tokenInfo);
  if (account.auth !== AccountAuth.SYSTEM_ADMIN) {
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

export default AdminBoardPage;
