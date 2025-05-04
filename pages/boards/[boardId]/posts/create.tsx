// react
import { useEffect, useState, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, } from '@chakra-ui/react';

import { MainLayout, PageBody, } from '@root/layouts';
import { BoardPageTitle, PostEditor, } from '@root/components';
import { NotExistBoardAlert, UnregisteredAccountAlert, } from '@root/components/alerts';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, unreadPersonalMessageListAtom, } from '@root/recoil';

// etc
import { Account, AccountAuth, Board, IricomGetServerSideProps, PersonalMessageList, Post, PostState, TokenInfo, } from '@root/interfaces';
import { BORDER_RADIUS, } from '@root/constants/style';
import iricomAPI from '@root/utils/iricomAPI';

type Props = {
  account: Account | null
  unreadPersonalMessageList: PersonalMessageList,
  board: Board,
}

const PostCreatePage = (props: Props) => {
  const account: Account = props.account;
  const unreadPersonalMessageList: PersonalMessageList = Object.assign(new PersonalMessageList(), props.unreadPersonalMessageList);
  const board: Board = Object.assign(new Board(), props.board);

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const setUnreadPersonalMessageList = useSetRecoilState<PersonalMessageList | null>(unreadPersonalMessageListAtom);

  const [isShowNotExistBoardAlert, setShowNotExistBoardAlert,] = useState<boolean>(false);
  const [isShowUnregisteredAccountAlert, setShowUnregisteredAccountAlert,] = useState<boolean>(false);

  useEffect(() => {
    setAccount(props.account);
    setUnreadPersonalMessageList(unreadPersonalMessageList);

    if (props.account.auth === AccountAuth.UNREGISTERED_ACCOUNT) {
      setShowUnregisteredAccountAlert(true);
    }
  }, []);

  const onCloseNotExistBoardAlert = () => {
    setShowNotExistBoardAlert(false);
  };

  const onCloseUnregisteredAccountAlert = () => {
    window.history.back();
  };

  const onRequest = (postState: PostState, post: Post) => {
    if (postState === PostState.TEMPORARY) {
      window.location.replace(`/boards/${post.boardId}/posts/${post.id}/edit`);
    } else { // POST.PUBLISH
      window.location.href = '/';
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

export const getServerSideProps: GetServerSideProps = async (context: IricomGetServerSideProps) => {
  const tokenInfo: TokenInfo | null = context.req.data.tokenInfo;

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
    const board: Board = await iricomAPI.getBoard(tokenInfo, boardId);
    return {
      props: {
        board: JSON.parse(JSON.stringify(board)),
      },
    };
  }
};

export default PostCreatePage;
