// react
import React, { useState, useEffect, } from 'react';
import NextLink from 'next/link';
import { useRouter, } from 'next/router';
import { Card, CardBody, Divider, LinkBox, LinkOverlay, VStack, } from '@chakra-ui/react';
import { PageBody, } from '../../../../layouts';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { BoardView, NoContent, PageTitle, } from '../../../../components';
import { useIricomAPI, } from '../../../../hooks';
// etc
import { AccountAuth, Board, BoardList, } from '../../../../interfaces';
import { BORDER_RADIUS, } from '../../../../constants/style';

const AdminBoardAdminPage = () => {
  const router = useRouter();
  const iricomApi = useIricomAPI();
  const [boardList, setBoardList,] = useState<Board[] | null>(null);

  useEffect(() => {
    if (router.isReady) {
      void init();
    }
  }, [router.isReady,]);

  const init = async () => {
    const boardList: BoardList = await iricomApi.getBoardList(0, 20, null);
    setBoardList(boardList.boards);
  };

  const getBoardListElement = (boardList: Board[]) => {
    const elementList: JSX.Element[] = [];
    for (let index = 0; index < boardList.length; index++) {
      const board: Board = boardList[index];
      elementList.push(<LinkBox key={index}>
        <LinkOverlay as={NextLink} href={`/admin/board/admin/${board.id}`}/>
        <BoardView board={board}/>
      </LinkBox>);
      if (index < boardList.length - 1) {
        elementList.push(<Divider key={'divider-' + index}/>);
      }
    }
    return elementList;
  };

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.SYSTEM_ADMIN}>
      <PageBody>
        <PageTitle
          title='게시판 관리자 설정'
          descriptions={['게시판에 관리자를 설정합니다.', '게시판 관리자는 해당 게시판에 공지사항을 작성 할 수 있으며, 게시물을 차단 할 수 있습니다.',]}
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

export default AdminBoardAdminPage;
