// react
import {} from 'react';
import { GetServerSideProps, } from 'next/types';
import {} from '@chakra-ui/react';
import { MainLayout, PageBody, } from '../../../../layouts';
import { PageTitle, } from '../../../../components';

// etc
import { Account, AccountAuth, ReportPostList, TokenInfo, } from '../../../../interfaces';
import iricomAPI from '../../../../utils/iricomAPI';
import { getTokenInfoByCookies, } from '../../../../utils';

type Props = {
  reportPostList: ReportPostList,
};

const AdminReportsBoardsBoardIdPage = ({
  reportPostList,
}: Props) => {
  console.log(reportPostList);
  return <MainLayout>
    <PageBody>
      <PageTitle title='게시물 신고 내역' descriptions={['',]}/>
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

  const boardId: string = context.query.boardId as string;
  const pageQuery: string | undefined = context.query.page as string;
  const page: number = pageQuery ? Number.parseInt(pageQuery, 10) : 1;
  const PAGE_LIMIT: number = 5;
  const skip: number = PAGE_LIMIT * (page - 1);
  const limit: number = PAGE_LIMIT;

  const reportPostList: ReportPostList = await iricomAPI.getReportedPostList(tokenInfo, boardId, skip, limit, null, null);
  return {
    props: {
      reportPostList: JSON.parse(JSON.stringify(reportPostList)),
    },
  };
};

export default AdminReportsBoardsBoardIdPage;
