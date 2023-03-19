// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import { Alert, Badge, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Card, CardBody, CardHeader, FormControl, FormLabel, Heading, HStack, Input, Spacer, Text, VStack, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../layouts/MainLayout';
import { PostListTable, } from '../../components';
import { useIricomAPI, } from '../../hooks';
// store
import { useRecoilValue, } from 'recoil';
import { myAccountAtom, } from '../../recoil';
// etc
import { Account, AccountAuth, PostList, } from '../../interfaces';

const InfoPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();

  const PAGE_LIMIT: number = 10;

  const pageQuery: string = router.query.page as string;

  const myAccount = useRecoilValue<Account | null>(myAccountAtom);
  const [postList, setPostList,] = useState<PostList | null>(null);
  const [page, setPage,] = useState<number>(1);

  useEffect(() => {
    if (router.isReady) {
      const page: number = pageQuery ? Number.parseInt(pageQuery, 10) : 1;
      setPage(page);
      void initPostList(page);
    }
  }, [router.isReady, pageQuery,]);

  const initPostList = async (page: number) => {
    const postList: PostList = await iricomAPI.getMyPostList(PAGE_LIMIT * (page - 1), PAGE_LIMIT);
    setPostList(postList);
  };

  const onClickPagination = (page: number) => {
    setPage(page);
    void router.push(`/info?page=${page}`);
  };

  const onChangePost = () => {
    void initPostList(page);
  };

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.UNREGISTERED_ACCOUNT}>
      <Card shadow='none' borderRadius='0' marginBottom='1rem'>
        <CardBody>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>이리콤</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/info' isCurrentPage>내 정보</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </CardBody>
      </Card>
      <VStack alignItems='stretch' marginLeft='auto' marginRight='auto' paddingLeft='1rem' paddingRight='1rem' spacing='1rem' maxWidth='60rem'>
        <Card shadow='none'>
          <CardHeader>
            <HStack justifyContent='flex-start'>
              <Heading size='sm' color='gray.600'>{myAccount ? myAccount.email : ''}</Heading>
              {myAccount && myAccount.auth === AccountAuth.SYSTEM_ADMIN && <Badge>시스템 관리자</Badge>}
              {myAccount && myAccount.auth === AccountAuth.BOARD_ADMIN && <Badge>게시판 관리자</Badge>}
              <Spacer/>
              <NextLink href='/info/edit'>
                <Button size='xs'>수정</Button>
              </NextLink>
            </HStack>
          </CardHeader>
          <CardBody alignItems='stretch' paddingTop='0'>
            <VStack alignItems='stretch'>
              <FormControl>
                <FormLabel>닉네임</FormLabel>
                <Input value={myAccount ? myAccount.nickname : ''} isDisabled/>
              </FormControl>
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Input value={myAccount ? myAccount.description : ''} isDisabled/>
              </FormControl>
            </VStack>
          </CardBody>
        </Card>
        <Card shadow='none'>
          <CardHeader>
            <Heading size='sm'>작성한 글 목록</Heading>
          </CardHeader>
          <CardBody paddingTop='0'>
            {postList && postList.total > 0 && <PostListTable
              postList={postList}
              onClickPagination={onClickPagination}
              isShowEditButton
              page={page}
              onChangePost={onChangePost}
            />}
            {postList && postList.total === 0 && <Alert status='info' borderRadius='.375rem'>
              <Text>등록한 게시물이 없습니다.</Text>
            </Alert>}
          </CardBody>
        </Card>
      </VStack>
    </MainLayout>
  );
};

export default InfoPage;

