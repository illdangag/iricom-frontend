// react
import { useEffect, } from 'react';
import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import { Badge, Button, Card, CardBody, CardHeader, FormControl, FormLabel, Heading, HStack, Input, Spacer, VStack,
} from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../layouts/MainLayout';
import { useIricomAPI, useAccountState, } from '../../hooks';
// store
import { useRecoilValue, } from 'recoil';
import { myAccountInfoAtom, } from '../../recoil';
// etc
import { AccountAuth, MyAccountInfo, } from '../../interfaces';

const InfoPage = () => {
  const iricomAPI = useIricomAPI();
  const router = useRouter();
  const myAccountInfo = useRecoilValue<MyAccountInfo | null>(myAccountInfoAtom);

  useEffect(() => {
    void iricomAPI.getMyPostList(0, 20)
      .then(postList => {
        console.log(postList);
      });
  }, []);

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.UNREGISTERED_ACCOUNT}>
      <VStack alignItems='stretch'>
        <Card shadow='none'>
          <CardHeader padding='0.8rem'>
            <HStack justifyContent='flex-start'>
              <Heading size='sm' color='gray.600'>{myAccountInfo ? myAccountInfo.account.email : ''}</Heading>
              {myAccountInfo && myAccountInfo.account.auth === AccountAuth.SYSTEM_ADMIN && <Badge>시스템 관리자</Badge>}
              {myAccountInfo && myAccountInfo.account.auth === AccountAuth.BOARD_ADMIN && <Badge>게시판 관리자</Badge>}
              <Spacer/>
              <NextLink href='/info/edit'>
                <Button size='xs'>수정</Button>
              </NextLink>
            </HStack>
          </CardHeader>
          <CardBody alignItems='stretch' padding='0 0.8rem 0.8rem 0.8rem'>
            <VStack alignItems='stretch'>
              <FormControl>
                <FormLabel>닉네임</FormLabel>
                <Input value={myAccountInfo ? myAccountInfo.account.nickname : ''} isDisabled/>
              </FormControl>
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Input value={myAccountInfo ? myAccountInfo.account.description : ''} isDisabled/>
              </FormControl>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </MainLayout>
  );
};

export default InfoPage;

