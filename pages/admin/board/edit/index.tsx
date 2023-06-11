// react
import { useState, } from 'react';
import NextLink from 'next/link';
import { VStack, Card, CardBody, HStack, Box, Heading, Text, useMediaQuery, Divider, LinkBox, LinkOverlay, } from '@chakra-ui/react';
import { BoardView, NoContent, } from '../../../../components';
import { PageBody, } from '../../../../layouts';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { useIricomAPI, } from '../../../../hooks';
// etc
import { AccountAuth, Board, } from '../../../../interfaces';
import { BORDER_RADIUS, MOBILE_MEDIA_QUERY, } from '../../../../constants/style';

const AdminBoardEditPage = () => {
  const iricomApi = useIricomAPI();
  const [isMobile,] = useMediaQuery(MOBILE_MEDIA_QUERY, { ssr: true, fallback: false, });
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
        <HStack justifyContent='space-between' alignItems='end' marginBottom='1rem'>
          <Box marginLeft={isMobile ? '1rem' : '0'}>
            <Heading size='md' fontWeight='semibold'>게시판 수정</Heading>
            <Text fontSize='xs'>게시판 정보를 수정합니다.</Text>
          </Box>
        </HStack>
        <Card
          shadow={isMobile ? 'none' : 'sm'}
          borderRadius={isMobile ? '0' : BORDER_RADIUS}
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
