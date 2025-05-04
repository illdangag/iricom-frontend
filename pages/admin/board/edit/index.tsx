// react
import { useEffect, useState, } from 'react';
import NextLink from 'next/link';
import { GetServerSideProps, } from 'next/types';
import { Card, CardBody, Divider, LinkBox, LinkOverlay, VStack, } from '@chakra-ui/react';

import { BoardView, NoContent, PageTitle, } from '@root/components';
import { PageBody, } from '@root/layouts';
import MainLayout from '@root/layouts/MainLayout';

// store
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, unreadPersonalMessageListAtom, } from '@root/recoil';

// etc
import { Account, AccountAuth, Board, BoardList, IricomGetServerSideProps, PersonalMessageList, TokenInfo, } from '@root/interfaces';
import { BORDER_RADIUS, } from '@root/constants/style';
import iricomAPI from '@root/utils/iricomAPI';

type Props = {
  account: Account | null,
  unreadPersonalMessageList: PersonalMessageList,
  boardList: Board[],
};

const AdminBoardEditPage = (props: Props) => {
  const account: Account = props.account;
  const unreadPersonalMessageList: PersonalMessageList = Object.assign(new PersonalMessageList(), props.unreadPersonalMessageList);

  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);
  const setUnreadPersonalMessageList = useSetRecoilState<PersonalMessageList | null>(unreadPersonalMessageListAtom);
  const [boardList, setBoardList,] = useState<Board[] | null>(null);

  useEffect(() => {
    setAccount(account);
    setUnreadPersonalMessageList(unreadPersonalMessageList);
    setBoardList(props.boardList);
  }, []);

  const getBoardListElement = (boardList: Board[]) => {
    const elementList: JSX.Element[] = [];
    for (let index = 0; index < boardList.length; index++) {
      const board: Board = boardList[index];
      elementList.push(
        <LinkBox key={index}>
          <LinkOverlay as={NextLink} href={`/admin/board/edit/${board.id}`}/>
          <BoardView board={board}/>
        </LinkBox>,
      );
      if (index < boardList.length - 1) {
        elementList.push(<Divider key={`divider-${index}`}/>);
      }
    }
    return elementList;
  };

  return (
    <MainLayout>
      <PageBody>
        <PageTitle
          title='게시판 수정'
          descriptions={['게시판 정보를 수정합니다',]}
        />
        <Card
          shadow={{ base: 'none', md: 'sm', }}
          borderRadius={{ base: '0', md: BORDER_RADIUS, }}
        >
          <CardBody>
            {boardList && boardList.length === 0 && <NoContent message='게시판이 존재하지 않습니다.'/>}
            {boardList && boardList.length > 0 && <VStack align='stretch' spacing='1rem'>
              {getBoardListElement(boardList)}
            </VStack>}
          </CardBody>
        </Card>
      </PageBody>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: IricomGetServerSideProps) => {
  const tokenInfo: TokenInfo | null = context.req.data.tokenInfo;
  const account: Account = context.req.data.account;

  if (tokenInfo === null || account.auth !== AccountAuth.SYSTEM_ADMIN) {
    return {
      notFound: true,
    };
  }

  const responseList: PromiseSettledResult<any>[] = await Promise.allSettled([
    iricomAPI.getBoardList(tokenInfo, 0, 20, null),
  ]);

  const boardListResponse = responseList[0] as PromiseFulfilledResult<BoardList>;
  const boardList: BoardList = boardListResponse.value;

  return {
    props: {
      boardList: boardList.boards,
    },
  };
};


export default AdminBoardEditPage;
