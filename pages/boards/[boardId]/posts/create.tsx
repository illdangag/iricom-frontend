// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Card, CardBody, } from '@chakra-ui/react';
import { PageBody, } from '../../../../layouts';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { PostEditor, BoardTitle, } from '../../../../components';
import { NotExistBoardAlert, } from '../../../../components/alerts';
import { useAccountState, useIricomAPI, } from '../../../../hooks';
// etc
import { AccountAuth, Board, Post, PostState, } from '../../../../interfaces';
import { BORDER_RADIUS, } from '../../../../constants/style';

enum PageState {
  INVALID,
  VALID,
  INVALID_BOARD,
}

const PostCreatePage = () => {
  const router = useRouter();
  const [_loginState, accountAuth,] = useAccountState();
  const iricomAPI = useIricomAPI();

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
        {board && <BoardTitle board={board} isShowCreateButton={false}/>}
        {/* 게시물 에디터 */}
        <Card
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
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
