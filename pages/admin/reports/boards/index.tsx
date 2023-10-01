// react
import { useEffect, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { VStack, Card, CardBody, } from '@chakra-ui/react';
import { MainLayout, PageBody, } from '../../../../layouts';
import { PageTitle, BoardListTable, } from '../../../../components';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../../../../recoil';

// etc
import { Account, AccountAuth, BoardList, TokenInfo, Board, } from '../../../../interfaces';
import { getTokenInfoByCookies, } from '../../../../utils';
import iricomAPI from '../../../../utils/iricomAPI';
import { BORDER_RADIUS, } from '../../../../constants/style';
const PAGE_LIMIT: number = 5;

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

  const onClickBoard = (board: Board) => {
    console.log(board);
  };

  return <MainLayout>
    <PageBody>
      <PageTitle title='게시물 신고 내역' descriptions={['관리자로 등록된 게시판 목록',]}/>
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
          <CardBody>
            <BoardListTable
              boardList={boardList}
              page={page}
              pageLinkHref='/admin/reports/boards?page={{page}}'
              onClickBoard={onClickBoard}
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
  const skip: number = PAGE_LIMIT * (page - 1);
  const limit: number = PAGE_LIMIT;

  const account: Account = await iricomAPI.getMyAccount(tokenInfo);
  const auth: AccountAuth = account.auth;

  if (auth !== AccountAuth.SYSTEM_ADMIN && auth !== AccountAuth.BOARD_ADMIN) {
    return {
      notFound: true,
    };
  }

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
