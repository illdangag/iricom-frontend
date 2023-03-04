// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import { Badge, Button, Card, CardBody, CardHeader, FormControl, FormLabel, Heading, HStack, Input, Spacer, VStack,
} from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../layouts/MainLayout';
import { PostListTable, } from '../../components';
import { useIricomAPI, } from '../../hooks';
// store
import { useRecoilValue, } from 'recoil';
import { myAccountAtom, } from '../../recoil';
// etc
import { AccountAuth, Account, PostList, } from '../../interfaces';

const InfoPage = () => {
  const iricomAPI = useIricomAPI();
  const router = useRouter();

  const myAccount = useRecoilValue<Account | null>(myAccountAtom);
  const [postList, setPostList,] = useState<PostList | null>(null);
  useEffect(() => {
    void iricomAPI.getMyPostList(0, 20)
      .then(postList => {
        console.log(postList);
        setPostList(postList)
      });
  }, []);

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.UNREGISTERED_ACCOUNT}>
      <VStack alignItems='stretch'>
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
            {postList && <PostListTable postList={postList}/>}
          </CardBody>
        </Card>
      </VStack>
    </MainLayout>
  );
};

export default InfoPage;

