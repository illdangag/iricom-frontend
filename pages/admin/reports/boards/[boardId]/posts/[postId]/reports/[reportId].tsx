// react
import { useEffect, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, VStack, Tag, Box, FormControl, FormLabel, } from '@chakra-ui/react';
import { MainLayout, PageBody, } from '../../../../../../../../layouts';
import { PageTitle, PostView, } from '../../../../../../../../components';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '../../../../../../../../recoil';

// etc
import { Account, AccountAuth, PostReport, ReportType, TokenInfo, } from '../../../../../../../../interfaces';
import iricomAPI from '../../../../../../../../utils/iricomAPI';
import { getTokenInfoByCookies, } from '../../../../../../../../utils';
import { BORDER_RADIUS, } from '../../../../../../../../constants/style';

type Props = {
  account: Account,
  postReport: PostReport,
};

const AdminReportsBoardsBoardIdReportsPage = (props: Props) => {
  const account: Account = props.account;
  const postReport: PostReport = props.postReport;

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    setAccount(account);
  }, []);

  const getTypeElement = (type: ReportType) => {
    switch (type) {
      case ReportType.HATE:
        return <Tag variant='solid' colorScheme='orange'>증오</Tag>;
      case ReportType.POLITICAL:
        return <Tag variant='solid' colorScheme='orange'>정치</Tag>;
      case ReportType.PORNOGRAPHY:
        return <Tag variant='solid' colorScheme='orange'>음란물</Tag>;
      case ReportType.ETC:
        return <Tag variant='solid' colorScheme='orange'>기타</Tag>;
    }
  };

  return <MainLayout>
    <PageBody>
      <PageTitle title={`'${postReport.post.title}' 신고 내역`}/>
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
            <VStack alignItems='flex-start' spacing='1rem'>
              <FormControl>
                <FormLabel>종류</FormLabel>
                {getTypeElement(postReport.type)}
              </FormControl>
              <FormControl>
                <FormLabel>신고 사유</FormLabel>
                <Box
                  width='100%'
                  borderWidth='1px'
                  padding='0.5rem'
                  borderRadius={BORDER_RADIUS}
                >
                  {postReport.reason}
                </Box>
              </FormControl>
            </VStack>
          </CardBody>
        </Card>
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
            <PostView
              post={postReport.post}
              isShowVote={false}
              isShowShare={false}
              isShowReport={false}
              isShowBan={false}
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

  const boardId: string = context.query.boardId as string;
  const postId: string = context.query.postId as string;
  const reportId: string = context.query.reportId as string;

  const postReport: PostReport = await iricomAPI.getPostReport(tokenInfo, boardId, postId, reportId);

  return {
    props: {
      account,
      postReport,
    },
  };
};

export default AdminReportsBoardsBoardIdReportsPage;
