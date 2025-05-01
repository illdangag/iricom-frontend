// react
import { useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { GetServerSideProps, } from 'next/types';
import { VStack, Card, CardBody, Text, CardHeader, } from '@chakra-ui/react';
import { MainLayout, PageBody, } from '@root/layouts';
import { PageTitle, BoardListTable, } from '@root/components';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, unreadPersonalMessageListAtom, } from '@root/recoil';

// etc
import { Account, AccountAuth, BoardList, PersonalMessageList, PersonalMessageStatus, TokenInfo, } from '@root/interfaces';
import { getTokenInfoByCookies, } from '@root/utils';
import iricomAPI from '@root/utils/iricomAPI';
import { BORDER_RADIUS, } from '@root/constants/style';

type Props = {
  account: Account,
  unreadPersonalMessageList: PersonalMessageList,
  boardList: BoardList,
  page: number,
}

const AdminReportsBoardsPage = (props: Props) => {
  const boardList = Object.assign(new BoardList(), props.boardList);
  const unreadPersonalMessageList: PersonalMessageList = Object.assign(new PersonalMessageList(), props.unreadPersonalMessageList);
  const page: number = props.page;

  const router = useRouter();

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const setUnreadPersonalMessageList = useSetRecoilState<PersonalMessageList | null>(unreadPersonalMessageListAtom);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setAccount(props.account);
    setUnreadPersonalMessageList(unreadPersonalMessageList);
  }, [router.isReady,]);

  return <MainLayout>
    <PageBody>
      <PageTitle title='게시물 신고 내역'/>
      <VStack alignItems='stretch'>
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
          <CardHeader>
            <Text fontWeight='500'>관리자로 등록된 게시판 목록</Text>
          </CardHeader>
          <CardBody>
            <BoardListTable
              boardList={boardList}
              page={page}
              boardLinkHref='/admin/reports/boards/{{boardId}}'
              pageLinkHref='/admin/reports/boards?page={{page}}'
            />
          </CardBody>
        </Card>
      </VStack>
    </PageBody>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo === null) {
    return {
      notFound: true,
    };
  }

  const pageQuery: string | undefined = context.query.page as string;
  const page: number = pageQuery ? Number.parseInt(pageQuery, 10) : 1;
  const PAGE_LIMIT: number = 5;
  const skip: number = PAGE_LIMIT * (page - 1);
  const limit: number = PAGE_LIMIT;

  const responseList: PromiseSettledResult<any>[] = await Promise.allSettled([
    iricomAPI.getMyAccount(tokenInfo),
    iricomAPI.getReceivePersonalMessageList(tokenInfo, PersonalMessageStatus.UNREAD, 0, 1),
    iricomAPI.getBoardListByBoardAdmin(tokenInfo, skip, limit),
  ]);

  if (responseList[0].status === 'rejected') {
    return {
      notFound: true,
    };
  }

  const accountResponse = responseList[0] as PromiseFulfilledResult<Account>;
  const unreadPersonalMessageListResponse = responseList[1] as PromiseFulfilledResult<PersonalMessageList>;
  const boardListResponse = responseList[2] as PromiseFulfilledResult<BoardList>;

  const account: Account = accountResponse.value;
  const unreadPersonalMessageList = unreadPersonalMessageListResponse.value;
  const boardList: BoardList = boardListResponse.value;

  if (account.auth !== AccountAuth.SYSTEM_ADMIN && account.auth !== AccountAuth.BOARD_ADMIN) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      account,
      unreadPersonalMessageList: JSON.parse(JSON.stringify(unreadPersonalMessageList)),
      boardList: JSON.parse(JSON.stringify(boardList)),
      page,
    },
  };
};

export default AdminReportsBoardsPage;
