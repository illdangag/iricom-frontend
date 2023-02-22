import { VStack, } from '@chakra-ui/react';
import MainLayout, { LoginState, } from '../../../layouts/MainLayout';
import { LinkCard, } from '../../../components';
import { AccountAuth, } from '../../../interfaces';

const AdminBoardPage = () => {
  return (
    <MainLayout loginState={LoginState.LOGIN} auth={AccountAuth.SYSTEM_ADMIN}>
      <VStack padding='0.8rem'>
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
          href='#'
        />
        <LinkCard
          title='게시판 관리자 설정'
          description={[
            '게시판에 관리자를 설정합니다.',
            '게시판 관리자는 해당 게시판에 공지사항을 작성 할 수 있습니다.',
            '게시판 관리자는 해당 게시판의 게시물을 차단 할 수 있습니다.',
          ]}
          href='#'
        />
      </VStack>
    </MainLayout>
  );
};

export default AdminBoardPage;
