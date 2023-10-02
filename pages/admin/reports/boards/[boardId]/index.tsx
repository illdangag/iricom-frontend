// react
import { useEffect, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, VStack, } from '@chakra-ui/react';
import { MainLayout, PageBody, } from '../../../../../layouts';
import { PageTitle, ReportPostListTable, } from '../../../../../components';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../../../../../recoil';

// etc
import { Account, AccountAuth, ReportPostList, TokenInfo, } from '../../../../../interfaces';
import iricomAPI from '../../../../../utils/iricomAPI';
import { getTokenInfoByCookies, } from '../../../../../utils';
import { BORDER_RADIUS, } from '../../../../../constants/style';

type Props = {
  account: Account,
  reportPostList: ReportPostList,
  page: number,
  boardId: string,
};

const AdminReportsBoardsBoardIdPage = (props: Props) => {
  const account: Account = props.account;
  const reportPostList: ReportPostList = Object.assign(new ReportPostList(), props.reportPostList);
  const page: number = props.page;
  const boardId: string = props.boardId;

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    setAccount(account);
  }, []);

  return <MainLayout>
    <PageBody>
      <PageTitle title='게시물 신고 내역' descriptions={['',]}/>
      <VStack alignItems='stretch' spacing='1rem'>
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
            <ReportPostListTable
              reportPostList={reportPostList}
              page={page}
              pageLinkHref={`/admin/reports/boards/${boardId}?page={{page}}`}
              reportLinkHref={`/admin/reports/boards/${boardId}/reports/{{reportId}}`}
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

  const PAGE_LIMIT: number = 5;

  const boardId: string = context.query.boardId as string;
  const pageQuery: string | undefined = context.query.page as string;
  const page: number = pageQuery ? Number.parseInt(pageQuery, 10) : 1;
  const skip: number = PAGE_LIMIT * (page - 1);
  const limit: number = PAGE_LIMIT;

  const reportPostList: ReportPostList = await iricomAPI.getReportedPostList(tokenInfo, boardId, skip, limit, null, null);

  return {
    props: {
      account,
      reportPostList: JSON.parse(JSON.stringify(reportPostList)),
      page,
      boardId,
    },
  };
};

export default AdminReportsBoardsBoardIdPage;
