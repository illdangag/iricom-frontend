// react
import { useState, useEffect, } from 'react';
import NextLink from 'next/link';
import { useRouter, } from 'next/router';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Card, CardBody, VStack, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';
import { BoardView, NoContent, } from '../../../../components';
import { useIricomAPI, } from '../../../../hooks';
// etc
import { AccountAuth, BoardList, } from '../../../../interfaces';

const AdminBoardAdminPage = () => {
  const router = useRouter();
  const iricomApi = useIricomAPI();
  const [boardList, setBoardList,] = useState<BoardList | null>(null);

  useEffect(() => {
    if (router.isReady) {
      void init();
    }
  }, [router.isReady,]);

  const init = async () => {
    const boardList: BoardList = await iricomApi.getBoardList(0, 20, null);
    setBoardList(boardList);
  };

  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.SYSTEM_ADMIN}>
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
              <BreadcrumbLink href='/admin/board/admin'>게시판 관리자 설정</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </CardBody>
      </Card>
      <VStack alignItems='stretch' marginLeft='auto' marginRight='auto' paddingLeft='1rem' paddingRight='1rem' spacing='1rem' maxWidth='60rem'>
        {boardList && boardList.boards.length === 0 && <Card shadow='none'>
          <CardBody>
            <NoContent message='게시판이 존재하지 않습니다.'/>
          </CardBody>
        </Card>}
        {boardList && boardList.boards.map((board, index) => <NextLink href={`/admin/board/admin/${board.id}`} key={index}>
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

export default AdminBoardAdminPage;
