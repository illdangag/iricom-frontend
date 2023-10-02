// react
import { useEffect, } from 'react';
import { GetServerSideProps, } from 'next/types';
import {} from '../../../../../../layouts';
import {} from '../../../../../../components';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../../../../../../recoil';

// etc
import { Account, AccountAuth, ReportPost, TokenInfo, } from '../../../../../../interfaces';
import iricomAPI from '../../../../../../utils/iricomAPI';
import { getTokenInfoByCookies, } from '../../../../../../utils';

type Props = {
};

const AdminReportsBoardsBoardIdReportsPage = (props: Props) => {

  return <></>;
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
  const reportId: string = context.query.reportId as string;

  console.log(boardId, reportId);

  return {
    props: {

    },
  };
};

export default AdminReportsBoardsBoardIdReportsPage;
