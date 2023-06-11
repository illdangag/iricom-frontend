// react
import React from 'react';
import NextLink from 'next/link';
import { Text, Card, CardBody, Heading, LinkBox, LinkOverlay, VStack, CardHeader, useMediaQuery, Divider, } from '@chakra-ui/react';
import { PageBody, } from '../../../layouts';
import MainLayout, { LoginState, } from '../../../layouts/MainLayout';
import { PageTitle, } from '../../../components';
// etc
import { AccountAuth, } from '../../../interfaces';
import { BORDER_RADIUS, MOBILE_MEDIA_QUERY, } from '../../../constants/style';

const AdminBoardPage = () => {
  const [isMobile,] = useMediaQuery(MOBILE_MEDIA_QUERY, { ssr: true, fallback: false, });
  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.SYSTEM_ADMIN}>
      <PageBody>
        <PageTitle
          title='관리자 페이지'
          descriptions={['게시판 생성 및 수정, 게시판의 관리자를 관리합니다',]}
        />
        <Card
          shadow={isMobile ? 'none' : 'sm'}
          borderRadius={isMobile ? '0' : BORDER_RADIUS}
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

export default AdminBoardPage;
