// react
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Card, CardBody, VStack, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../layouts/MainLayout';
import { LinkCard, } from '../../../components';
// etc
import { AccountAuth, } from '../../../interfaces';

const AdminBoardPage = () => {
  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.SYSTEM_ADMIN}>
      <Card shadow='none' borderRadius='0' marginBottom='1rem'>
        <CardBody>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>이리콤</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href='/admin/board'>게시판 설정</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </CardBody>
      </Card>
      <VStack marginLeft='auto' marginRight='auto' paddingLeft='1rem' paddingRight='1rem' spacing='1rem' maxWidth='60rem'>
        <LinkCard
          title='게시판 생성'
          description={['새로운 게시판을 생성합니다.',]}
          href='/admin/board/create'
        />
        <LinkCard
          title='게시판 수정'
          description={[
            '게시판 정보를 수정합니다.',
          ]}
          href='/admin/board/edit'
        />
        <LinkCard
          title='게시판 관리자 설정'
          description={[
            '게시판에 관리자를 설정합니다.',
            '게시판 관리자는 해당 게시판에 공지사항을 작성 할 수 있으며, 게시물을 차단 할 수 있습니다.',
          ]}
          href='/admin/board/admin'
        />
      </VStack>
    </MainLayout>
  );
};

export default AdminBoardPage;
