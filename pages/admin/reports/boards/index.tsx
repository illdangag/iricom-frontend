// react
import { useEffect, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { VStack, Card, CardBody, Text, CardHeader, } from '@chakra-ui/react';
import { MainLayout, PageBody, } from '@root/layouts';
import { PageTitle, BoardListTable, } from '@root/components';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '@root/recoil';

// etc
import { Account, AccountAuth, BoardList, TokenInfo, } from '@root/interfaces';
import { getTokenInfoByCookies, } from '@root/utils';
import iricomAPI from '@root/utils/iricomAPI';
import { BORDER_RADIUS, } from '@root/constants/style';

type Props = {
  account: Account,
  boardList: BoardList,
  page: number,
}

const AdminReportsBoardsPage = (props: Props) => {
  const boardList = Object.assign(new BoardList(), props.boardList);
  const page: number = props.page;

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    setAccount(props.account);
  }, []);

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

  const account: Account = await iricomAPI.getMyAccount(tokenInfo);
  const auth: AccountAuth = account.auth;

  if (auth !== AccountAuth.SYSTEM_ADMIN && auth !== AccountAuth.BOARD_ADMIN) {
    return {
      notFound: true,
    };
  }

  const pageQuery: string | undefined = context.query.page as string;
  const page: number = pageQuery ? Number.parseInt(pageQuery, 10) : 1;
  const PAGE_LIMIT: number = 5;
  const skip: number = PAGE_LIMIT * (page - 1);
  const limit: number = PAGE_LIMIT;

  const boardList: BoardList = await iricomAPI.getBoardListByBoardAdmin(tokenInfo, skip, limit);

  return {
    props: {
      account,
      boardList: JSON.parse(JSON.stringify(boardList)),
      page,
    },
  };
};

export default AdminReportsBoardsPage;
