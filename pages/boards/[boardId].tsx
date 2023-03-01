// react
import { useEffect, useState, } from 'react';
import NextLink from 'next/link';
import { useRouter, } from 'next/router';
import { Button, HStack, } from '@chakra-ui/react';
import { MdCreate, } from 'react-icons/md';
import MainLayout, { LoginState, } from '../../layouts/MainLayout';
import { useIricomAPI, } from '../../hooks';
// etc
import { Post, PostList, } from '../../interfaces';

const BoardsPage = () => {
  const router = useRouter();
  const iricomAPI = useIricomAPI();

  const { boardId, } = router.query;

  const [postList, setPostList,] = useState<Post[] | null>(null);

  useEffect(() => {
    if (typeof boardId === 'string') {
      void init(boardId);
    } else {
      // TODO 잘못된 요청 처리
    }
  }, []);

  const init = async (boardId: string) => {
    const postList: PostList = await iricomAPI.getPostList(boardId, 0, 20, null);
    setPostList(postList.posts);
  };

  return (
    <MainLayout loginState={LoginState.ANY}>
      <HStack justifyContent='flex-end'>
        <NextLink href={`/boards/${boardId}/posts/create`}>
          <Button size='sm' variant='outline' backgroundColor='gray.50' leftIcon={<MdCreate/>}>글 쓰기</Button>
        </NextLink>
      </HStack>
    </MainLayout>
  );
};

export default BoardsPage;
