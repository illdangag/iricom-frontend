// react
import { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, } from '@chakra-ui/react';

import { MainLayout, PageBody, } from '@root/layouts';
import { BoardTitle, PostEditor, } from '@root/components';
import { NotExistBoardAlert, UnregisteredAccountAlert, } from '@root/components/alerts';

// store
import { useRecoilState, } from 'recoil';
import { myAccountAtom, } from '@root/recoil';

// etc
import { Account, AccountAuth, Board, Post, PostState, TokenInfo, } from '@root/interfaces';
import { BORDER_RADIUS, } from '@root/constants/style';
import { getTokenInfoByCookies, } from '@root/utils';
import iricomAPI from '@root/utils/iricomAPI';

type Props = {
  account: Account | null
  board: Board,
}

const PostCreatePage = (props: Props) => {
  const router = useRouter();

  const board: Board = Object.assign(new Board(), props.board);
  const [isShowNotExistBoardAlert, setShowNotExistBoardAlert,] = useState<boolean>(false);
  const [isShowUnregisteredAccountAlert, setShowUnregisteredAccountAlert,] = useState<boolean>(true);

  const [account, setAccount,] = useRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setAccount(props.account);
  }, [router.isReady,]);

  const onCloseNotExistBoardAlert = () => {
    setShowNotExistBoardAlert(false);
  };

  const onCloseUnregisteredAccountAlert = () => {
    setShowUnregisteredAccountAlert(false);
    void router.back();
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
      <UnregisteredAccountAlert
        isOpen={isShowUnregisteredAccountAlert}
        onClose={onCloseUnregisteredAccountAlert}
        redirectURL={`/boards/${board.id}/posts/create`}
      />
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

    const resultList: [Account, Board] = await Promise.all([
      iricomAPI.getMyAccount(tokenInfo),
      iricomAPI.getBoard(tokenInfo, boardId),
    ]);

    return {
      props: {
        account: resultList[0],
        board: JSON.parse(JSON.stringify(resultList[1])),
      },
    };
  }
};

export default PostCreatePage;
