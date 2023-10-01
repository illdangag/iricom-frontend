// react
import React, { ChangeEvent, useEffect, useState, KeyboardEvent, } from 'react';
import { useRouter, } from 'next/router';
import { GetServerSideProps, } from 'next/types';
import { Button, Card, CardBody, Heading, HStack, ListItem, Text, UnorderedList, VStack, InputGroup, InputLeftElement, Input, InputRightElement, } from '@chakra-ui/react';
import { MdSearch, } from 'react-icons/md';

import { MainLayout, PageBody, } from '../../../../layouts';
import { AccountListTable, PageTitle, } from '../../../../components';
import { BoardAdminCreateAlert, BoardAdminDeleteAlert, } from '../../../../components/alerts';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../../../../recoil';

// etc
import { Account, AccountList, AccountAuth, BoardAdmin, TokenInfo, } from '../../../../interfaces';
import { BORDER_RADIUS, } from '../../../../constants/style';
import { getTokenInfoByCookies, } from '../../../../utils';
import iricomAPI from '../../../../utils/iricomAPI';
const PAGE_LIMIT: number = 5;

type Props = {
  account: Account,
  boardId: string,
  boardAdmin: BoardAdmin,
  accountList: AccountList,
  accountPage: number,
  accountKeyword: string,
}

const AdminBoardAdminEditPage = (props: Props) => {
  const router = useRouter();

  const boardId: string = props.boardId;
  const accountPage: number = props.accountPage;
  const accountList: AccountList = Object.assign(new AccountList(), props.accountList);

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  const [boardAdmin, setBoardAdmin,] = useState<BoardAdmin | null>(props.boardAdmin);
  const [selectedAccount, setSelectedAccount,] = useState<Account | null>(null);
  const [isOpenBoardAdminCreateAlert, setOpenBoardAdminCreateAlert,] = useState<boolean>(false);
  const [isOpenBoardAdminDeleteAlert, setOpenBoardAdminDeleteAlert,] = useState<boolean>(false);
  const [accountKeyword, setAccountKeyword,] = useState<string>('');

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

  const onChangeAccountKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setAccountKeyword(value);
  };

  const onKeyUpAccountKeyword = (event: KeyboardEvent<HTMLInputElement>) => {
    const key: string = event.key;
    if (key === 'Enter') {
      setUrlGetParameterAccountKeyword(accountKeyword);
    }
  };

  const onClickAccountKeyword = () => {
    setUrlGetParameterAccountKeyword(accountKeyword);
  };

  const setUrlGetParameterAccountKeyword = (accountKeyword: string) => {
    const url: string = `/admin/board/admin/${boardId}?account_page=${accountPage}&account_keyword=${accountKeyword}`;
    void router.push(url);
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
              <HStack justifyContent='flex-end'>
                <InputGroup size='sm' width='12rem' maxWidth='100%'>
                  <InputLeftElement pointerEvents='none'>
                    <MdSearch/>
                  </InputLeftElement>
                  <Input
                    paddingRight='3rem'
                    value={accountKeyword}
                    onChange={onChangeAccountKeyword}
                    onKeyUp={onKeyUpAccountKeyword}
                  />
                  <InputRightElement width='3rem'>
                    <Button size='xs' onClick={onClickAccountKeyword}>검색</Button>
                  </InputRightElement>
                </InputGroup>
              </HStack>
              <AccountListTable
                accountList={accountList}
                page={accountPage}
                pageLinkHref={`/admin/board/admin/${boardId}?account_page={{page}}`}
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

  const accountPageQuery: string | undefined = context.query.account_page as string;
  const accountKeywordQuery: string | undefined = context.query.account_keyword as string;

  const accountPage: number = accountPageQuery ? Number.parseInt(accountPageQuery, 10) : 1;
  const accountKeyword: string = accountKeywordQuery ? accountKeywordQuery : '';
  const accountSkip: number = PAGE_LIMIT * (accountPage - 1);
  const accountLimit: number = PAGE_LIMIT;

  const account: Account = await iricomAPI.getMyAccount(tokenInfo);
  if (account.auth !== AccountAuth.SYSTEM_ADMIN) {
    return {
      notFound: true,
    };
  }

  const boardId: string = context.query.boardId as string;
  const boardAdmin: BoardAdmin = await iricomAPI.getBoardAdminInfo(tokenInfo, boardId);
  const accountList: AccountList = await iricomAPI.getAccountList(tokenInfo, accountSkip, accountLimit, accountKeyword);

  return {
    props: {
      account,
      boardId,
      boardAdmin: JSON.parse(JSON.stringify(boardAdmin)),
      accountList: JSON.parse(JSON.stringify(accountList)),
      accountPage,
      accountKeyword,
    },
  };
};

export default AdminBoardAdminEditPage;
