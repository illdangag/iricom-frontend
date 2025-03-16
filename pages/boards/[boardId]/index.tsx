// react
import { useEffect, useState, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { Badge, Card, CardBody, VStack, } from '@chakra-ui/react';

import { MainLayout, PageBody, } from '@root/layouts';
import { NoContent, PostListTable, BoardPageTitle, } from '@root/components';
import { RequireAccountDetailAlert, } from '@root/components/alerts';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '@root/recoil';

// etc
import { Account, Board, PostList, PostType, TokenInfo, } from '@root/interfaces';
import { BORDER_RADIUS, } from '@root/constants/style';
import iricomAPI from '@root/utils/iricomAPI';
import { getTokenInfoByCookies, } from '@root/utils';

const PAGE_LIMIT: number = 10;
const NOTIFICATION_PAGE_LIMIT: number = 5;

type Props = {
  account: Account | null,
  board: Board,
  postList: PostList,
  notificationList: PostList,
  page: number,
  boardId: string,
};

const BoardsPage = (props: Props) => {
  const boardId: string = props.boardId;
  const page: number = props.page;
  const board = Object.assign(new Board(), props.board as Board);
  const postList = Object.assign(new PostList(), props.postList as PostList);
  const notificationList = Object.assign(new PostList(), props.notificationList as PostList);

  const [showRegisteredAccountAlert, setShowRegisteredAccountAlert,] = useState<boolean>(false);

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    setAccount(props.account);
  }, []);

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
                page={page}
                isShowPostState={false}
                pageLinkHref={`/boards/${boardId}?page={{page}}`}
              />
            </CardBody>
          </Card>}
          {postList && postList.total === 0 && <>
            <NoContent message='게시물이 존재하지 않습니다.'/>
          </>}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  const account: Account | null = tokenInfo !== null ? await iricomAPI.getMyAccount(tokenInfo) : null;

  const boardId: string = context.query.boardId as string;
  const pageQuery: string | undefined = context.query.page as string;

  const page: number = pageQuery ? Number.parseInt(pageQuery, 10) : 1;
  const skip: number = PAGE_LIMIT * (page - 1);
  const limit: number = PAGE_LIMIT;

  const resultList = await Promise.all([
    iricomAPI.getBoard(tokenInfo, boardId),
    iricomAPI.getPostList(tokenInfo, boardId, skip, limit, PostType.POST),
    iricomAPI.getPostList(tokenInfo, boardId, 0, NOTIFICATION_PAGE_LIMIT, PostType.NOTIFICATION),
  ]);

  const board: Board = resultList[0];
  const postList: PostList = resultList[1];
  const notificationList: PostList = resultList[2];

  return {
    props: {
      account,
      boardId,
      page,
      board: JSON.parse(JSON.stringify(board)),
      postList: JSON.parse(JSON.stringify(postList)),
      notificationList: JSON.parse(JSON.stringify(notificationList)),
    },
  };
};

export default BoardsPage;
