// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, } from '@chakra-ui/react';

import { MainLayout, PageBody, } from '@root/layouts';
import { BoardTitle, PostEditor, } from '@root/components';
import { NotExistBoardAlert, } from '@root/components/alerts';
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

const PostCreatePage = (props: Props) => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();

  const [board, setBoard,] = useState<Board | null>(null);
  const [isShowNotExistBoardAlert, setShowNotExistBoardAlert,] = useState<boolean>(false);

  const [account, setAccount,] = useRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setAccount(props.account);

    const boardId: string = router.query.boardId as string;

    if (boardId) {
      void iricomAPI.getBoard(boardId)
        .then(board => {
          setBoard(board);
        })
        .catch(() => {
          setBoard(null);
          setShowNotExistBoardAlert(true);
        });
    }
  }, [router.isReady,]);

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
    <MainLayout>
      <PageBody>
        {/* 게시판 헤더 */}
        {board && <BoardTitle board={board} isShowCreateButton={false}/>}
        {/* 게시물 에디터 */}
        <Card
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
        >
          <CardBody>
            <PostEditor
              accountAuth={account === null ? AccountAuth.NONE : account.auth}
              boardId={board === null ? '' : board.id}
              disabled={board === null}
              onRequest={onRequest}
            />
          </CardBody>
        </Card>
      </PageBody>
      <NotExistBoardAlert isOpen={isShowNotExistBoardAlert} onClose={onCloseNotExistBoardAlert}/>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  const boardId: string = context.query.boardId as string;

  if (tokenInfo === null) {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: `/login?success=/boards/${boardId}/posts/create`,
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

export default PostCreatePage;
