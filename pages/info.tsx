// react
import { useEffect, } from 'react';
import { Card, FormControl, FormLabel, Heading, Input, VStack, Badge, HStack, Button, Spacer, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../layouts/MainLayout';
import { useIricomAPI, } from '../hooks';
// store
import { useRecoilValue, } from 'recoil';
import { myAccountInfoAtom, } from '../recoil';
// etc
import { AccountAuth, MyAccountInfo, } from '../interfaces';

const InfoPage = () => {
  const iricomAPI = useIricomAPI();

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
        <Card padding='0.8rem' shadow='none'>
          <VStack alignItems='stretch'>
            <HStack justifyContent='flex-start'>
              <Heading size='sm' color='gray.600'>{myAccountInfo ? myAccountInfo.account.email : ''}</Heading>
              {myAccountInfo && myAccountInfo.account.auth === AccountAuth.SYSTEM_ADMIN && <Badge>시스템 관리자</Badge>}
              {myAccountInfo && myAccountInfo.account.auth === AccountAuth.BOARD_ADMIN && <Badge>게시판 관리자</Badge>}
              <Spacer/>
              <Button size='xs'>수정</Button>
            </HStack>
            <FormControl>
              <FormLabel>닉네임</FormLabel>
              <Input value={myAccountInfo ? myAccountInfo.account.nickname : ''} isDisabled/>
            </FormControl>
            <FormControl>
              <FormLabel>설명</FormLabel>
              <Input value={myAccountInfo ? myAccountInfo.account.description : ''} isDisabled/>
            </FormControl>
          </VStack>
        </Card>
      </VStack>
    </MainLayout>
  );
};

export default InfoPage;

