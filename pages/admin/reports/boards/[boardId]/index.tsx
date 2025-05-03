// react
import { useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, VStack, } from '@chakra-ui/react';
import { MainLayout, PageBody, } from '@root/layouts';
import { NoContent, PageTitle, ReportPostListTable, } from '@root/components';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, unreadPersonalMessageListAtom, } from '@root/recoil';

// etc
import { Account, AccountAuth, Board, IricomGetServerSideProps, PersonalMessageList, PostReportList, TokenInfo, } from '@root/interfaces';
import iricomAPI from '@root/utils/iricomAPI';
import { BORDER_RADIUS, } from '@root/constants/style';

type Props = {
  account: Account,
  unreadPersonalMessageList: PersonalMessageList,
  postReportList: PostReportList,
  page: number,
  board: Board,
};

const AdminReportsBoardsBoardIdPage = (props: Props) => {
  const account: Account = props.account;
  const unreadPersonalMessageList: PersonalMessageList = Object.assign(new PersonalMessageList(), props.unreadPersonalMessageList);
  const postReportList: PostReportList = Object.assign(new PostReportList(), props.postReportList);
  const page: number = props.page;
  const board: Board = Object.assign(new Board(), props.board);

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

  return <MainLayout>
    <PageBody>
      <PageTitle title={`'${board.title}' 신고 내역`} descriptions={['',]}/>
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
            {postReportList.reports.length !== 0 && <ReportPostListTable
              reportPostList={postReportList}
              page={page}
              pageLinkHref={`/admin/reports/boards/${board.id}?page={{page}}`}
              reportLinkHref={`/admin/reports/boards/${board.id}/posts/{{postId}}/reports/{{reportId}}`}
            />}
            {postReportList.reports.length === 0 && <NoContent
              message='신고 내역이 존재하지 않습니다.'
            />}
          </CardBody>
        </Card>
      </VStack>
    </PageBody>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context: IricomGetServerSideProps) => {
  const tokenInfo: TokenInfo | null = context.req.data.tokenInfo;
  const account: Account = context.req.data.account;

  if (tokenInfo === null || account.auth !== AccountAuth.SYSTEM_ADMIN && account.auth !== AccountAuth.BOARD_ADMIN) {
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

  const responseList: PromiseSettledResult<any>[] = await Promise.allSettled([
    iricomAPI.getBoard(tokenInfo, boardId),
    iricomAPI.getReportedPostList(tokenInfo, boardId, skip, limit, null, null),
  ]);

  const boardResponse = responseList[0] as PromiseFulfilledResult<Board>;
  const postReportListRseponse = responseList[1] as PromiseFulfilledResult<PostReportList>;

  const board: Board = boardResponse.value;
  const postReportList: PostReportList = postReportListRseponse.value;

  return {
    props: {
      postReportList: JSON.parse(JSON.stringify(postReportList)),
      page,
      board: JSON.parse(JSON.stringify(board)),
    },
  };
};

export default AdminReportsBoardsBoardIdPage;
