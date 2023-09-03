// react
import React, { useEffect, useState, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { Button, Card, CardBody, Heading, HStack, ListItem, Text, UnorderedList, VStack, } from '@chakra-ui/react';

import { MainLayout, PageBody, } from '../../../../layouts';
import { AccountListTable, PageTitle, } from '../../../../components';
import { BoardAdminCreateAlert, BoardAdminDeleteAlert, } from '../../../../components/alerts';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../../../../recoil';

// etc
import { Account, AccountAuth, BoardAdmin, TokenInfo, } from '../../../../interfaces';
import { BORDER_RADIUS, } from '../../../../constants/style';
import { getTokenInfoByCookies, } from '../../../../utils';
import iricomAPI from '../../../../utils/iricomAPI';

type Props = {
  account: Account,
  boardAdmin: BoardAdmin,
}

const AdminBoardAdminEditPage = (props: Props) => {
  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  const [boardAdmin, setBoardAdmin,] = useState<BoardAdmin | null>(props.boardAdmin);
  const [selectedAccount, setSelectedAccount,] = useState<Account | null>(null);
  const [isOpenBoardAdminCreateAlert, setOpenBoardAdminCreateAlert,] = useState<boolean>(false);
  const [isOpenBoardAdminDeleteAlert, setOpenBoardAdminDeleteAlert,] = useState<boolean>(false);

  useEffect(() => {
    setAccount(props.account);
  }, []);

  const onCloseAddAdminAlert = () => {
    setOpenBoardAdminCreateAlert(false);
  };

  const onConfirmAddAdminAlert = (boardAdmin: BoardAdmin) => {
    setOpenBoardAdminCreateAlert(false);
    setBoardAdmin(boardAdmin);
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

  const onConfirmDeleteAlert = (boardAdmin: BoardAdmin) => {
    setOpenBoardAdminDeleteAlert(false);
    setBoardAdmin(boardAdmin);
  };

  return (
    <MainLayout>
      <PageBody>
        <PageTitle
          title='게시판 관리자 설정'
          descriptions={['게시판에 관리자를 설정합니다.', '게시판 관리자는 해당 게시판에 공지사항을 작성 할 수 있으며, 게시물을 차단 할 수 있습니다.',]}
        />
        <VStack align='stretch' spacing='1rem'>
          {boardAdmin && <Card
            shadow={{
              base: 'none',
              md: 'sm',
            }}
            borderRadius={{
              base: '0',
              md: BORDER_RADIUS,
            }}
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
            shadow={{
              base: 'none',
              md: 'sm',
            }}
            borderRadius={{
              base: '0',
              md: BORDER_RADIUS,
            }}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo === null) {
    return {
      notFound: true,
    };
  }

  const account: Account = await iricomAPI.getMyAccount(tokenInfo);
  if (account.auth !== AccountAuth.SYSTEM_ADMIN) {
    return {
      notFound: true,
    };
  }

  const boardId: string = context.query.boardId as string;
  const boardAdmin: BoardAdmin = await iricomAPI.getBoardAdminInfo(tokenInfo, boardId);
  return {
    props: {
      account,
      boardAdmin: JSON.parse(JSON.stringify(boardAdmin)),
    },
  };
};

export default AdminBoardAdminEditPage;