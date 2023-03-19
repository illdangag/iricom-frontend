// react
import { useState, } from 'react';
import NextLink from 'next/link';
import { VStack, Card, Image, HStack, Spacer, Text, CardBody, Breadcrumb, BreadcrumbItem, BreadcrumbLink, } from '@chakra-ui/react';
import { BoardView, } from '../../../components';
import MainLayout, { LoginState, } from '../../../layouts/MainLayout';
import { useIricomAPI, } from '../../../hooks';
// etc
import { AccountAuth, Board, } from '../../../interfaces';

const AdminBoardEditPage = () => {
  const iricomApi = useIricomAPI();
  const [boardList, setBoardList,] = useState<Board[] | null>(null);

  const onMount = () => {
    void iricomApi.getBoardList(0, 20, null)
      .then(boardList => {
        setBoardList(boardList.boards);
      });
  };

  const emptyBoardList =
    <Card shadow='sm' padding='1rem'>
      <HStack>
        <Spacer/>
        <Image src='/static/images/empty.png' width='6rem' alt='empty board list'/>
        <Spacer/>
      </HStack>
      <Text marginTop='1rem' fontSize='lg'>게시판이 존재하지 않습니다.</Text>
    </Card>;

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.SYSTEM_ADMIN} onMount={onMount}>
      <Card shadow='none' borderRadius='0' marginBottom='1rem'>
        <CardBody>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>이리콤</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/admin/board'>게시판 설정</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href='/admin/board/edit'>수정</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </CardBody>
      </Card>
      <VStack alignItems='stretch' marginLeft='auto' marginRight='auto' paddingLeft='1rem' paddingRight='1rem' spacing='1rem' maxWidth='60rem'>
        {boardList && boardList.length === 0 && emptyBoardList}
        {boardList && boardList.map((board, index) => <NextLink href={`/admin/board/edit/${board.id}`} key={index}>
          <Card shadow='none'>
            <CardBody>
              <BoardView board={board}/>
            </CardBody>
          </Card>
        </NextLink>)}
      </VStack>
    </MainLayout>
  );
};

export default AdminBoardEditPage;
