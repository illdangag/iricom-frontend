// react
import { useState, } from 'react';
import NextLink from 'next/link';
import { VStack, Card, CardBody, Divider, LinkBox, LinkOverlay, } from '@chakra-ui/react';
import { BoardView, NoContent, PageTitle, } from '../../../../components';
import { PageBody, } from '../../../../layouts';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { useIricomAPI, } from '../../../../hooks';
// etc
import { AccountAuth, Board, } from '../../../../interfaces';
import { BORDER_RADIUS, } from '../../../../constants/style';

const AdminBoardEditPage = () => {
  const iricomApi = useIricomAPI();
  const [boardList, setBoardList,] = useState<Board[] | null>(null);

  const onMount = () => {
    void iricomApi.getBoardList(0, 20, null)
      .then(boardList => {
        setBoardList(boardList.boards);
      });
  };

  const getBoardListElement = (boardList: Board[]) => {
    const elementList: JSX.Element[] = [];
    for (let index = 0; index < boardList.length; index++) {
      const board: Board = boardList[index];
      elementList.push(<LinkBox>
        <LinkOverlay as={NextLink} href={`/admin/board/edit/${board.id}`}/>
        <BoardView board={board}/>
      </LinkBox>);
      if (index < boardList.length - 1) {
        elementList.push(<Divider/>);
      }
    }
    return elementList;
  };

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.SYSTEM_ADMIN} onMount={onMount}>
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

export default AdminBoardEditPage;
