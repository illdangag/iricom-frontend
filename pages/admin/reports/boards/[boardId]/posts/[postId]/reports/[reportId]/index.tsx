// react
import { useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, VStack, Tag, Box, FormControl, FormLabel, } from '@chakra-ui/react';
import { MainLayout, PageBody, } from '@root/layouts';
import { PageTitle, PostView, } from '@root/components';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, unreadPersonalMessageListAtom, } from '@root/recoil';

// etc
import { Account, AccountAuth, PersonalMessageList, PersonalMessageStatus, PostReport, PostReportList, ReportType, TokenInfo, } from '@root/interfaces';
import iricomAPI from '@root/utils/iricomAPI';
import { getTokenInfoByCookies, } from '@root/utils';
import { BORDER_RADIUS, } from '@root/constants/style';

type Props = {
  account: Account,
  unreadPersonalMessageList: PersonalMessageList,
  postReport: PostReport,
};

const AdminReportsBoardsBoardIdReportsPage = (props: Props) => {
  const account: Account = props.account;
  const unreadPersonalMessageList: PersonalMessageList = Object.assign(new PersonalMessageList(), props.unreadPersonalMessageList);
  const postReport: PostReport = props.postReport;

  const router = useRouter();

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const setUnreadPersonalMessageList = useSetRecoilState<PersonalMessageList | null>(unreadPersonalMessageListAtom);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setAccount(account);
    setUnreadPersonalMessageList(unreadPersonalMessageList);
  }, [router.isReady,]);

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
              isShowBlock={false}
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

  const boardId: string = context.query.boardId as string;
  const postId: string = context.query.postId as string;
  const reportId: string = context.query.reportId as string;

  const responseList: PromiseSettledResult<any>[] = await Promise.allSettled([
    iricomAPI.getMyAccount(tokenInfo),
    iricomAPI.getReceivePersonalMessageList(tokenInfo, PersonalMessageStatus.UNREAD, 0, 1),
    iricomAPI.getPostReport(tokenInfo, boardId, postId, reportId),
  ]);

  if (responseList[0].status === 'rejected') {
    return {
      notFound: true,
    };
  }

  const accountResponse = responseList[0] as PromiseFulfilledResult<Account>;
  const unreadPersonalMessageListResponse = responseList[1] as PromiseFulfilledResult<PersonalMessageList>;
  const postReportResult = responseList[2] as PromiseFulfilledResult<PostReport>;

  const account: Account = accountResponse.value;
  const unreadPersonalMessageList = unreadPersonalMessageListResponse.value;
  const postReport: PostReport = postReportResult.value;

  if (account.auth !== AccountAuth.SYSTEM_ADMIN && account.auth !== AccountAuth.BOARD_ADMIN) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      account,
      unreadPersonalMessageList: JSON.parse(JSON.stringify(unreadPersonalMessageList)),
      postReport,
    },
  };
};

export default AdminReportsBoardsBoardIdReportsPage;
