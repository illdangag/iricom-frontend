// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Card, CardBody, useMediaQuery, } from '@chakra-ui/react';
import { PageBody, } from '../../../../layouts';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { PostEditor, } from '../../../../components';
import { NotExistBoardAlert, } from '../../../../components/alerts';
import { useAccountState, useIricomAPI, } from '../../../../hooks';
// etc
import { AccountAuth, Board, Post, PostState, } from '../../../../interfaces';
import { BORDER_RADIUS, MOBILE_MEDIA_QUERY, } from '../../../../constants/style';
import BoarderHeader from '../../../../components/BoardHeader';

enum PageState {
  INVALID,
  VALID,
  INVALID_BOARD,
}

const PostCreatePage = () => {
  const router = useRouter();
  const [_loginState, accountAuth,] = useAccountState();
  const iricomAPI = useIricomAPI();
  const [isMobile,] = useMediaQuery(MOBILE_MEDIA_QUERY, {
    ssr: true,
    fallback: false,
  });

  const boardId: string = router.query.boardId as string;
  const [board, setBoard,] = useState<Board | null>(null);
  const [pageState, setPageState,] = useState<PageState>(PageState.INVALID);
  const [isShowNotExistBoardAlert, setShowNotExistBoardAlert,] = useState<boolean>(false);

  useEffect(() => {
    if (boardId) {
      void iricomAPI.getBoard(boardId)
        .then(board => {
          setBoard(board);
        })
        .catch(() => {
          setPageState(PageState.INVALID_BOARD);
          setShowNotExistBoardAlert(true);
        });
    }
  }, [boardId,]);

  const onCloseNotExistBoardAlert = () => {
    setShowNotExistBoardAlert(false);
  };

  const onRequest = (postState: PostState, post: Post) => {
    if (postState === PostState.TEMPORARY) {
      void router.replace(`/boards/${post.boardId}/posts/${post.id}/edit`);
    } else { // POST.PUBLISH
      void router.push('/');
    }
  };

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.ACCOUNT}>
      <PageBody>
        {/* 게시판 헤더 */}
        {board && <BoarderHeader board={board} isShowCreateButton={false}/>}
        {/* 게시물 에디터 */}
        <Card
          shadow={isMobile ? 'none' : 'sm'}
          borderRadius={isMobile ? '0' : BORDER_RADIUS}
        >
          <CardBody>
            <PostEditor accountAuth={accountAuth} boardId={boardId} disabled={pageState === PageState.INVALID_BOARD} onRequest={onRequest}/>
          </CardBody>
        </Card>
      </PageBody>
      <NotExistBoardAlert isOpen={isShowNotExistBoardAlert} onClose={onCloseNotExistBoardAlert}/>
    </MainLayout>
  );
};

export default PostCreatePage;
