// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, } from '@chakra-ui/react';

import { PageBody, MainLayout, } from '@root/layouts';
import { PostEditor, } from '@root/components';
import BoarderHeader from '@root/components/BoardTitle';
import { InvalidPostAlert, PostPublishAlert, } from '@root/components/alerts';
import { useIricomAPI, } from '@root/hooks';

// store
import { useRecoilState, } from 'recoil';
import { myAccountAtom, } from '@root/recoil';

// etc
import { Account, AccountAuth, Board, Post, PostState, TokenInfo, } from '@root/interfaces';
import { BORDER_RADIUS, } from '@root/constants/style';
import { getTokenInfoByCookies, } from '@root/utils';
import iricomAPI from '@root/utils/iricomAPI';

type Props = {
  account: Account | null,
}

const BoardsPostsEditPage = (props: Props) => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();

  const boardId: string = router.query.boardId as string;
  const postId: string = router.query.postId as string;

  const [board, setBoard,] = useState<Board | null>(null);
  const [post, setPost,] = useState<Post | null>(null);
  const [publishPost, setPublishPost,] = useState<Post | null>(null);
  const [isOpenInvalidPostAlert, setOpenInvalidPostAlert,] = useState<boolean>(false);
  const [isOpenPostPublishAlert, setOpenPostPublishAlert,] = useState<boolean>(false);

  const [account, setAccount,] = useRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setAccount(props.account);

  }, [router.isReady,]);

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
    <MainLayout>
      <PageBody>
        {/* 게시판 헤더 */}
        {board && <BoarderHeader board={board} isShowCreateButton={false}/>}
        {/* 게시물 에디터 */}
        <Card
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
        >
          <CardBody>
            {!post && <PostEditor
              accountAuth={account !== null ? account.auth : AccountAuth.NONE}
              disabled={true}
            />}
            {post && <PostEditor
              accountAuth={account !== null ? account.auth : AccountAuth.NONE}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  const boardId: string = context.query.boardId as string;
  const postId: string = context.query.postId as string;

  if (tokenInfo === null) {
    return {
      props: {},
      redirect: {
        statusCode: 307,
        destination: `/login?success=/boards/${boardId}/posts/${postId}/edit`,
      },
    };
  } else {
    return {
      props: {
        account: await iricomAPI.getMyAccount(tokenInfo),
      },
    };
  }
};

export default BoardsPostsEditPage;
