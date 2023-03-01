// react
import { useRouter, } from 'next/router';
import MainLayout, { LoginState, } from '../../../../layouts/MainLayout';

const PostCreatePage = () => {
  const router = useRouter();

  const { boardId, } = router.query;

  return (
    <MainLayout loginState={LoginState.LOGIN}>
      board id: {boardId}
    </MainLayout>
  );
};

export default PostCreatePage;
