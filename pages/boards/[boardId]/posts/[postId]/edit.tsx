// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Card, CardBody, useMediaQuery, } from '@chakra-ui/react';
import { PageBody, } from '../../../../../layouts';
import MainLayout, { LoginState, } from '../../../../../layouts/MainLayout';
import { PostEditor, } from '../../../../../components';
import { InvalidPostAlert, PostPublishAlert, } from '../../../../../components/alerts';
import { useAccountState, useIricomAPI, } from '../../../../../hooks';
// etc
import { AccountAuth, Board, Post, PostState, } from '../../../../../interfaces';
import BoarderHeader from '../../../../../components/BoardTitle';
import { BORDER_RADIUS, MOBILE_MEDIA_QUERY, } from '../../../../../constants/style';

const BoardsPostsEditPage = () => {
  const router = useRouter();
  const [_loginState, accountAuth,] = useAccountState();
  const iricomAPI = useIricomAPI();
  const [isMobile,] = useMediaQuery(MOBILE_MEDIA_QUERY, {
    ssr: true,
    fallback: false,
  });

  const boardId: string = router.query.boardId as string;
  const postId: string = router.query.postId as string;

  const [board, setBoard,] = useState<Board | null>(null);
  const [post, setPost,] = useState<Post | null>(null);
  const [publishPost, setPublishPost,] = useState<Post | null>(null);
  const [isOpenInvalidPostAlert, setOpenInvalidPostAlert,] = useState<boolean>(false);
  const [isOpenPostPublishAlert, setOpenPostPublishAlert,] = useState<boolean>(false);

  useEffect(() => {
    if (boardId && postId) {
      init();
    }
  }, [boardId, postId,]);

  const init = () => {
    void iricomAPI.getPost(boardId, postId, PostState.TEMPORARY)
      .then(post => {
        setPost(post);
      })
      .catch(() => {
        void iricomAPI.getPost(boardId, postId, PostState.PUBLISH)
          .then(post => {
            setPost(post);
          })
          .catch(() => {
            setOpenInvalidPostAlert(true);
          });
      });

    void iricomAPI.getBoard(boardId)
      .then(board => {
        setBoard(board);
      })
      .catch(() => {
        setOpenInvalidPostAlert(true);
      });
  };

  const onCloseInvalidPostAlert = () => {
    setOpenInvalidPostAlert(false);
  };

  const onClosePostPublishAlert = () => {
    setOpenPostPublishAlert(false);
  };

  const onRequest = (postState: PostState, post: Post) => {
    if (postState === PostState.TEMPORARY) {
      // TODO 임시 저장에 성공한 메시지를 나타내야 함
    } else { // POST.PUBLISH
      setPublishPost(post);
      setOpenPostPublishAlert(true);
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
            {!post && <PostEditor
              accountAuth={accountAuth}
              disabled={true}
            />}
            {post && <PostEditor
              accountAuth={accountAuth}
              defaultValue={post}
              boardId={boardId}
              onRequest={onRequest}
            />}
          </CardBody>
        </Card>
      </PageBody>
      <InvalidPostAlert isOpen={isOpenInvalidPostAlert} onClose={onCloseInvalidPostAlert}/>
      {publishPost && <PostPublishAlert
        isOpen={isOpenPostPublishAlert}
        post={publishPost}
        onClose={onClosePostPublishAlert}
      />}
    </MainLayout>
  );
};

export default BoardsPostsEditPage;
