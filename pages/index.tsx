// reacts
import { useEffect, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, VStack, } from '@chakra-ui/react';
import { MainLayout, PageBody, } from '@root/layouts';
import BoardPostPreview from '@root/components/BoardPostPreview';

// etc
import { Account, Board, BoardList, PersonalMessageList, PostList, PostType, TokenInfo, } from '@root/interfaces';
import { BORDER_RADIUS, MAX_WIDTH, } from '@root/constants/style';
import iricomAPI from '@root/utils/iricomAPI';
import { getTokenInfoByCookies, } from '@root/utils';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, unreadPersonalMessageListAtom, } from '@root/recoil';

type BoardPostList = {
  board: Board,
  postList: PostList,
}

type Props = {
  account: Account | null,
  unreadPersonalMessageList: PersonalMessageList,
  boardPostListList: BoardPostList[],
}

const IndexPage = (props: Props) => {
  const account: Account = props.account;
  const unreadPersonalMessageList: PersonalMessageList = Object.assign(new PersonalMessageList(), props.unreadPersonalMessageList);
  const boardPostListList: BoardPostList[] = props.boardPostListList;

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const setUnreadPersonalMessageList = useSetRecoilState<PersonalMessageList | null>(unreadPersonalMessageListAtom);

  useEffect(() => {
    setAccount(account);
    setUnreadPersonalMessageList(unreadPersonalMessageList);
  }, []);

  return (
    <MainLayout>
      <PageBody>
        <VStack
          align='stretch'
          spacing='1rem'
          maxWidth={MAX_WIDTH}
        >
          {boardPostListList && boardPostListList.map((boardPostList, index) => {
            return <Card
              key={index}
              width='100%'
              shadow={{ base: 'none', md: 'sm', }}
              borderRadius={{ base: '0', md: BORDER_RADIUS, }}
            >
              <CardBody>
                <BoardPostPreview board={boardPostList.board} postList={boardPostList.postList} key={index}/>
              </CardBody>
            </Card>;
          })}
        </VStack>
      </PageBody>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  const boardList: BoardList = await iricomAPI.getBoardList(tokenInfo, 0, 20, true);
  const boardPostListList: BoardPostList[] = [];

  for (const board of boardList.boards) {
    const postList: PostList = await iricomAPI.getPostList(tokenInfo, board.id, 0, 5, PostType.POST);
    boardPostListList.push({
      board: board,
      postList: postList,
    } as BoardPostList);
  }

  return {
    props: {
      boardPostListList: JSON.parse(JSON.stringify(boardPostListList)),
    },
  };
};

export default IndexPage;
