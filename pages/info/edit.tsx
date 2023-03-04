// react
import { ChangeEvent, useEffect, useState, } from 'react';
import MainLayout, { LoginState, } from '../../layouts/MainLayout';
import { Badge, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, FormControl, FormLabel, Heading, HStack, Input, VStack,
  useToast, } from '@chakra-ui/react';
import { useIricomAPI, } from '../../hooks';
// store
import { useRecoilState, } from 'recoil';
import { myAccountInfoAtom, } from '../../recoil';
// etc
import { MyAccountInfo, AccountAuth, } from '../../interfaces';

enum PageState {
  INVALID,
  VALID,
  REQUEST,
  SUCCESS,
  FAIL,
}

const InfoEditPage = () => {
  const iricomAPI = useIricomAPI();
  const toast = useToast();

  const [pageState, setPageState,] = useState<PageState>(PageState.INVALID);
  const [myAccountInfo, setMyAccountInfo,] = useRecoilState<MyAccountInfo | null>(myAccountInfoAtom);
  const [nickname, setNickname,] = useState<string>('');
  const [description, setDescription,] = useState<string>('');

  useEffect(() => {
    if (myAccountInfo !== null) {
      setNickname(myAccountInfo.account.nickname);
      setDescription(myAccountInfo.account.description);
    }
  }, [myAccountInfo,]);

  useEffect(() => {
    if (nickname.length > 0) {
      setPageState(PageState.VALID);
    } else {
      setPageState(PageState.INVALID);
    }
  }, [nickname,]);

  const onChangeNickname = (event: ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const onChangeDescription = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const onClickSave = () => {
    setPageState(PageState.REQUEST);
    void iricomAPI.updateMyAccountInfo(nickname, description)
      .then(account => {
        setPageState(PageState.VALID);
        toast({
          title: '저장 하였습니다.',
          status: 'success',
          duration: 3000,
        });
      });
  };

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.UNREGISTERED_ACCOUNT}>
      <VStack alignItems='stretch' padding='0'>
        <Card shadow='none'>
          <CardHeader padding='0.8rem'>
            <HStack>
              <Heading size='sm' color='gray.600'>{myAccountInfo ? myAccountInfo.account.email : ''}</Heading>
              {myAccountInfo && myAccountInfo.account.auth === AccountAuth.SYSTEM_ADMIN && <Badge>시스템 관리자</Badge>}
              {myAccountInfo && myAccountInfo.account.auth === AccountAuth.BOARD_ADMIN && <Badge>게시판 관리자</Badge>}
            </HStack>
          </CardHeader>
          <CardBody alignItems='stretch' padding='0 0.8rem 0.8rem 0.8rem'>
            <VStack>
              <FormControl>
                <FormLabel>닉네임</FormLabel>
                <Input autoFocus value={nickname} isDisabled={pageState === PageState.REQUEST} onChange={onChangeNickname}/>
              </FormControl>
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Input value={description} isDisabled={pageState === PageState.REQUEST} onChange={onChangeDescription}/>
              </FormControl>
            </VStack>
          </CardBody>
          <CardFooter justifyContent='flex-end' padding='0 0.8rem 0.8rem 0.8rem'>
            <ButtonGroup>
              <Button isDisabled={pageState === PageState.INVALID || pageState === PageState.REQUEST} onClick={onClickSave}>저장</Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
      </VStack>
    </MainLayout>
  );
};

export default InfoEditPage;
