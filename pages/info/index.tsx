// react
import { useEffect, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import { Alert, Badge, Button, Card, CardBody, CardHeader, FormControl, FormLabel, Heading, HStack, Input, Spacer, Text, VStack, } from '@chakra-ui/react';

import { PageBody, MainLayout, } from '@root/layouts';
import { PageTitle, PostListTable, } from '@root/components';

// store
import { useRecoilState, } from 'recoil';
import { myAccountAtom, } from '@root/recoil';

// etc
import { Account, AccountAuth, PostList, TokenInfo, } from '@root/interfaces';
import { BORDER_RADIUS, } from '@root/constants/style';
import iricomAPI from '@root/utils/iricomAPI';
import { getTokenInfoByCookies, } from '@root/utils';

const PAGE_LIMIT: number = 1;

type Props = {
  account: Account,
  postList: any,
  page: number,
};

const InfoPage = (props: Props) => {
  const postList = Object.assign(new PostList(), props.postList);
  const page: number = props.page;

  const router = useRouter();

  const [account, setAccount,] = useRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setAccount(props.account);
  }, []);

  return (
    <MainLayout>
      <PageBody>
        <PageTitle
          title='내 정보'
          descriptions={['계정의 정보와 작성한 게시물을 조회 합니다.',]}
        />
        <VStack spacing='1rem' align='stretch'>
          <Card
            shadow={{ base: 'none', md: 'sm', }}
            borderRadius={{ base: '0', md: BORDER_RADIUS, }}
          >
            <CardHeader>
              <HStack justifyContent='flex-start' height='2rem'>
                <Heading size='sm' color='gray.600'>{account ? account.email : ''}</Heading>
                {account && account.auth === AccountAuth.SYSTEM_ADMIN && <Badge>시스템 관리자</Badge>}
                {account && account.auth === AccountAuth.BOARD_ADMIN && <Badge>게시판 관리자</Badge>}
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
                  <Input value={account ? account.nickname : ''} isDisabled/>
                </FormControl>
                <FormControl>
                  <FormLabel>설명</FormLabel>
                  <Input value={account ? account.description : ''} isDisabled/>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
          <Card
            shadow={{ base: 'none', md: 'sm', }}
            borderRadius={{ base: '0', md: BORDER_RADIUS, }}
          >
            <CardHeader>
              <Heading size='sm'>작성한 글 목록</Heading>
            </CardHeader>
            <CardBody paddingTop='0'>
              {postList && postList.total > 0 && <PostListTable
                postList={postList}
                pageLinkHref='/info?page={{page}}'
                isShowEditButton
                page={page}
              />}
              {postList && postList.total === 0 && <Alert status='info' borderRadius='.375rem'>
                <Text>등록한 게시물이 없습니다.</Text>
              </Alert>}
            </CardBody>
          </Card>
        </VStack>
      </PageBody>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo !== null) {
    const account: Account = await iricomAPI.getMyAccount(tokenInfo);
    const page: number = context.query.page ? Number.parseInt(context.query.page as string, 10) : 1;
    const postList: PostList = await iricomAPI.getMyPostList(tokenInfo, PAGE_LIMIT * (page - 1), PAGE_LIMIT);

    return {
      props: {
        account,
        postList: JSON.parse(JSON.stringify(postList)),
        page,
      },
    };
  } else {
    return {
      redirect: {
        destination: '/login?success=/info',
        permanent: false,
      },
    };
  }
};

export default InfoPage;

