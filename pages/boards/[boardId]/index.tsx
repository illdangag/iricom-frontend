// react
import { useEffect, useState, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { useRouter, } from 'next/router';
import { Badge, Card, CardBody, VStack, } from '@chakra-ui/react';
import { MainLayout, PageBody, } from '@root/layouts';
import { BoardPageTitle, NoContent, PostListTable, } from '@root/components';
import { RequireAccountDetailAlert, } from '@root/components/alerts';
// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, unreadPersonalMessageListAtom, } from '@root/recoil';
// etc
import { Account, Board, IricomGetServerSideProps, PersonalMessageList, PostList, PostType, TokenInfo, } from '@root/interfaces';
import { BORDER_RADIUS, } from '@root/constants/style';
import iricomAPI from '@root/utils/iricomAPI';
import { parseInt, } from '@root/utils';

const PAGE_LIMIT: number = 10;
const NOTIFICATION_PAGE_LIMIT: number = 5;

type Props = {
  account: Account | null,
  unreadPersonalMessageList: PersonalMessageList,
  board: Board,
  postList: PostList,
  notificationList: PostList,
  boardId: string,
};

const BoardsPage = (props: Props) => {
  const account: Account | null = props.account;
  const unreadPersonalMessageList: PersonalMessageList = Object.assign(new PersonalMessageList(), props.unreadPersonalMessageList);
  const boardId: string = props.boardId;
  const board = Object.assign(new Board(), props.board as Board);
  const postList = Object.assign(new PostList(), props.postList as PostList);
  const notificationList = Object.assign(new PostList(), props.notificationList as PostList);

  const router = useRouter();

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const setUnreadPersonalMessageList = useSetRecoilState<PersonalMessageList | null>(unreadPersonalMessageListAtom);

  const [showRegisteredAccountAlert, setShowRegisteredAccountAlert,] = useState<boolean>(false);

  useEffect(() => {
    if (!router.isReady && !account) {
      return;
    }
    setAccount(account);
    setUnreadPersonalMessageList(unreadPersonalMessageList);
  }, [router.isReady,]);

  const onCloseRegisteredAccountDetailAlert = () => {
    setShowRegisteredAccountAlert(false);
  };

  return (
    <MainLayout>
      <PageBody>
        {board && <BoardPageTitle board={board} isShowCreateButton={true}/>}
        <VStack align='stretch'>
          {notificationList && notificationList.total > 0 && <Card
            shadow={{ base: 'none', md: 'sm', }}
            borderRadius={{ base: '0', md: BORDER_RADIUS, }}
          >
            <CardBody>
              <Badge fontSize='1rem' colorScheme='purple' marginBottom='0.5rem'>공지사항</Badge>
              <PostListTable
                postList={notificationList}
                page={1}
                isShowPagination={false}
                isShowPostState={false}
              />
            </CardBody>
          </Card>}
          {postList && postList.total > 0 && <Card
            shadow={{ base: 'none', md: 'sm', }}
            borderRadius={{ base: '0', md: BORDER_RADIUS, }}
          >
            <CardBody>
              <PostListTable
                postList={postList}
                page={postList.currentPage}
                isShowPostState={false}
                pageLinkHref={`/boards/${boardId}?page={{page}}`}
              />
            </CardBody>
          </Card>}
          {postList && postList.total === 0 && <NoContent message='게시물이 존재하지 않습니다.'/>}
        </VStack>
      </PageBody>
      <RequireAccountDetailAlert
        text='글을 쓰기 위해서는 계정 정보 등록이 필요합니다.'
        isOpen={showRegisteredAccountAlert}
        onClose={onCloseRegisteredAccountDetailAlert}
      />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: IricomGetServerSideProps) => {
  const tokenInfo: TokenInfo | null = context.req.data.tokenInfo;

  const boardId: string = context.query.boardId as string;
  const pageQuery: string | undefined = context.query.page as string;
  const page: number = parseInt(pageQuery, 1);
  const limit: number = PAGE_LIMIT;
  const skip: number = limit * (page - 1);

  const responseList: PromiseSettledResult<any>[] = await Promise.allSettled([
    iricomAPI.getBoard(tokenInfo, boardId),
    iricomAPI.getPostList(tokenInfo, boardId, skip, limit, PostType.POST),
    iricomAPI.getPostList(tokenInfo, boardId, 0, NOTIFICATION_PAGE_LIMIT, PostType.NOTIFICATION),
  ]);

  const boardResponse = responseList[0] as PromiseFulfilledResult<Board>;
  const postListResponse = responseList[1] as PromiseFulfilledResult<PostList>;
  const notificationListResponse = responseList[2] as PromiseFulfilledResult<PostList>;

  const board: Board = boardResponse.value;
  const postList: PostList = postListResponse.value;
  const notificationList: PostList = notificationListResponse.value;

  return {
    props: {
      boardId,
      board: JSON.parse(JSON.stringify(board)),
      postList: JSON.parse(JSON.stringify(postList)),
      notificationList: JSON.parse(JSON.stringify(notificationList)),
    },
  };
};

export default BoardsPage;
