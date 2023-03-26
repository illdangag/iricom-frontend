// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { VStack, Card, CardBody, Heading, Text, UnorderedList, ListItem, Button, HStack, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { AccountListTable, } from '../../../../components';
import { BoardAdminCreateAlert, BoardAdminDeleteAlert, } from '../../../../components/alerts';
import { useIricomAPI, } from '../../../../hooks';
// etc
import { BoardAdmin, AccountAuth, Account, } from '../../../../interfaces';

const AdminBoardAdminEditPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();

  const id: string = router.query.id as string;

  const [boardAdmin, setBoardAdmin,] = useState<BoardAdmin | null>(null);
  const [selectedAccount, setSelectedAccount,] = useState<Account | null>(null);
  const [isOpenBoardAdminCreateAlert, setOpenBoardAdminCreateAlert,] = useState<boolean>(false);
  const [isOpenBoardAdminDeleteAlert, setOpenBoardAdminDeleteAlert,] = useState<boolean>(false);

  useEffect(() => {
    if (router.isReady) {
      init();
    }
  }, [router.isReady,]);

  const init = () => {
    void iricomAPI.getBoardAdminInfo(id)
      .then((boardAdmin) => {
        setBoardAdmin(boardAdmin);
      });
  };

  const onCloseAddAdminAlert = () => {
    setOpenBoardAdminCreateAlert(false);
  };

  const onConfirmAddAdminAlert = () => {
    setOpenBoardAdminCreateAlert(false);
    init();
  };

  const onClickAccount = (account: Account) => {
    setSelectedAccount(account);
    setOpenBoardAdminCreateAlert(true);
  };

  const onClickDelete = (account: Account) => {
    setSelectedAccount(account);
    setOpenBoardAdminDeleteAlert(true);
  };

  const onCloseDeleteAlert = () => {
    setOpenBoardAdminDeleteAlert(false);
  };

  const onConfirmDeleteAlert = () => {
    setOpenBoardAdminDeleteAlert(false);
    init();
  };

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.SYSTEM_ADMIN}>
      <VStack alignItems='stretch' marginLeft='auto' marginRight='auto' paddingLeft='1rem' paddingRight='1rem' spacing='1rem' maxWidth='60rem'>
        {boardAdmin && <Card shadow='none'>
          <CardBody>
            <Heading size='md'>{boardAdmin.title}</Heading>
            <Text marginTop='.5rem' fontSize='sm'>{boardAdmin.description}</Text>
            <Text marginTop='1rem'>게시판 관리자 목록</Text>
            <UnorderedList spacing='.5rem' paddingTop='.5rem' paddingLeft='.5rem'>
              {boardAdmin && boardAdmin.accounts.map((account) => <ListItem key={account.id}>
                <HStack>
                  <Text>{account.nickname}</Text>
                  <Button
                    size='xs'
                    variant='outline'
                    colorScheme='red'
                    onClick={() => onClickDelete(account)}
                  >
                    관리자 삭제
                  </Button>
                </HStack>
              </ListItem>)}
            </UnorderedList>
          </CardBody>
        </Card>}
        <Card shadow='none'>
          <CardBody>
            <AccountListTable
              onClickAccount={onClickAccount}
            />
          </CardBody>
        </Card>
      </VStack>
      <BoardAdminCreateAlert
        isOpen={isOpenBoardAdminCreateAlert}
        board={boardAdmin}
        account={selectedAccount}
        onClose={onCloseAddAdminAlert}
        onConfirm={onConfirmAddAdminAlert}
      />
      <BoardAdminDeleteAlert
        isOpen={isOpenBoardAdminDeleteAlert}
        board={boardAdmin}
        account={selectedAccount}
        onClose={onCloseDeleteAlert}
        onConfirm={onConfirmDeleteAlert}
      />
    </MainLayout>
  );
};

export default AdminBoardAdminEditPage;
