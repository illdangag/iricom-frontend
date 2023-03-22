// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { VStack, Card, CardBody, Heading, Text, Box, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { AccountListTable, } from '../../../../components';
import { useIricomAPI, } from '../../../../hooks';
// etc
import { Board, AccountList, AccountAuth, Account, } from '../../../../interfaces';
import { a } from '@chakra-ui/toast/dist/toast.provider-02a226a3';

const AdminBoardAdminEditPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();

  const id: string = router.query.id as string;

  const [board, setBoard,] = useState<Board | null>(null);
  const [accountList, setAccountList,] = useState<AccountList | null>(null);

  useEffect(() => {
    if (router.isReady) {
      void iricomAPI.getBoard(id)
        .then(board => {
          setBoard(board);
        });
      void iricomAPI.getAccountList(0, 20, null)
        .then(accountList => {
          setAccountList(accountList);
        });
    }
  }, [router.isReady,]);


  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.SYSTEM_ADMIN}>
      <VStack alignItems='stretch' marginLeft='auto' marginRight='auto' paddingLeft='1rem' paddingRight='1rem' spacing='1rem' maxWidth='60rem'>
        {board && <Card shadow='none'>
          <CardBody>
            <Heading size='md'>{board.title}</Heading>
            <Text marginTop='.5rem' fontSize='sm'>{board.description}</Text>
            <Text marginTop='1rem'>게시판 관리자 목록</Text>
          </CardBody>
        </Card>}

        {accountList && <Card shadow='none'>
          <CardBody>
            <AccountListTable accountList={accountList}/>
          </CardBody>
        </Card>}
      </VStack>
    </MainLayout>
  );
};

export default AdminBoardAdminEditPage;
