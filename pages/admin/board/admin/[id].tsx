// react
import React, { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { VStack, Card, CardBody, Heading, Text, UnorderedList, ListItem, Button, HStack, Box, useMediaQuery, } from '@chakra-ui/react';
import { PageBody, } from '../../../../layouts';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { AccountListTable, } from '../../../../components';
import { BoardAdminCreateAlert, BoardAdminDeleteAlert, } from '../../../../components/alerts';
import { useIricomAPI, } from '../../../../hooks';
// etc
import { BoardAdmin, AccountAuth, Account, } from '../../../../interfaces';
import { BORDER_RADIUS, MOBILE_MEDIA_QUERY, } from '../../../../constants/style';

const AdminBoardAdminEditPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();

  const id: string = router.query.id as string;
  const [isMobile,] = useMediaQuery(MOBILE_MEDIA_QUERY, { ssr: true, fallback: false, });
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
      <PageBody>
        <HStack justifyContent='space-between' alignItems='end' marginBottom='1rem'>
          <Box marginLeft={isMobile ? '1rem' : '0'}>
            <Heading size='md' fontWeight='semibold'>게시판 관리자 설정</Heading>
            <Text fontSize='xs'>게시판에 관리자를 설정합니다.</Text>
            <Text fontSize='xs'>게시판 관리자는 해당 게시판에 공지사항을 작성 할 수 있으며, 게시물을 차단 할 수 있습니다.</Text>
          </Box>
        </HStack>
        <VStack align='stretch' spacing='1rem'>
          {boardAdmin && <Card
            shadow={isMobile ? 'none' : 'sm'}
            borderRadius={isMobile ? '0' : BORDER_RADIUS}
          >
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
          <Card
            shadow={isMobile ? 'none' : 'sm'}
            borderRadius={isMobile ? '0' : BORDER_RADIUS}
          >
            <CardBody>
              <AccountListTable
                onClickAccount={onClickAccount}
              />
            </CardBody>
          </Card>
        </VStack>
      </PageBody>
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
