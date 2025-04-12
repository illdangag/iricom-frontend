// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, } from '@chakra-ui/react';

import { MainLayout, PageBody, } from '@root/layouts';
import { PostEditor, BoardPageTitle, } from '@root/components';
import { InvalidPostAlert, PostPublishAlert, } from '@root/components/alerts';

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
  board: Board | null,
  post: Post | null,
}

const BoardsPostsEditPage = (props: Props) => {
  const router = useRouter();

  const board = Object.assign(new Board(), props.board);
  const post = props.post;

  const [publishPost, setPublishPost,] = useState<Post | null>(null);
  const [isOpenInvalidPostAlert, setOpenInvalidPostAlert,] = useState<boolean>(false);
  const [isOpenPostPublishAlert, setOpenPostPublishAlert,] = useState<boolean>(false);

  const [account, setAccount,] = useRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setAccount(props.account);
    setOpenInvalidPostAlert(board === null || post === null);
  }, [router.isReady,]);

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
        {board && <BoardPageTitle board={board} isShowCreateButton={false}/>}
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
              boardId={board.id}
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

  var board: Board | null = null;

  try {
    board = await iricomAPI.getBoard(tokenInfo, boardId);
  } catch (error) {
    board = null;
  }

  var post: Post | null = null;
  try {
    post = await iricomAPI.getPost(tokenInfo, boardId, postId, PostState.TEMPORARY);
  } catch (error) {
    try {
      post = await iricomAPI.getPost(tokenInfo, boardId, postId, PostState.PUBLISH);
    } catch (error) {
      post = null;
    }
  }

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
        board: JSON.parse(JSON.stringify(board)),
        post: post,
      },
    };
  }
};

export default BoardsPostsEditPage;
